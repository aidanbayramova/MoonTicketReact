import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";

const API_BASE = "http://localhost:5149";

function ProductIndex() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ProductGetAll`);
      const data = await res.json();

      console.log("DATA:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`${API_BASE}/api/ProductDelete/${id}`, {
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
                {/* NAME */}
                <td>{p.name ?? p.Name ?? "-"}</td>

                {/* ADDRESS */}
                <td>{p.address ?? p.Address ?? "-"}</td>

                {/* START DATE */}
                <td>
                  {p.startDate || p.StartDate
                    ? new Date(p.startDate || p.StartDate).toLocaleString()
                    : "-"}
                </td>

                {/* AGE */}
                <td>{(p.ageRestriction ?? p.AgeRestriction ?? 0) + "+"}</td>

                {/* IMAGE */}
                <td>
                  {p.image || p.Image ? (
                    <img
                      src={`${API_BASE}${p.image ?? p.Image}`}
                      alt="product"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>

                {/* ACTIONS */}
                <td>
                  <button onClick={() => navigate(`/admin/product/detailProduct/${p.id}`)}>
                    Detail
                  </button>

                  <button onClick={() => navigate(`/admin/product/editProductForm/${p.id}`)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
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