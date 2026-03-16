import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";

function ProductIndex() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("https://localhost:7204/api/ProductGetAll");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`https://localhost:7204/api/ProductDelete/${id}`, {
      method: "DELETE",
    });

    fetchProducts();
  };

  return (
    <div className="product-container">
      <h2>Products</h2>

      <button
        className="create-btn"
        onClick={() => navigate("/admin/product/createProductForm")}
      >
        + Create
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Start</th>
            <th>Age</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6">No products</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.address}</td>
                <td>{new Date(p.startDate).toLocaleString()}</td>
                <td>{p.ageRestriction}+</td>
                <td>
                  {p.image && <img src={p.image} alt="" />}
                </td>
                <td className="actions">
                  <button onClick={() => navigate(`/admin/product/detail/${p.id}`)}>Detail</button>
                  <button onClick={() => navigate(`/admin/product/edit/${p.id}`)}>Edit</button>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductIndex;