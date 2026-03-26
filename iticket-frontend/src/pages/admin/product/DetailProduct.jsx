import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Product.css";

const API_BASE = "http://localhost:5149";

function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/ProductGetById/${id}`);
        const data = await res.json();
        console.log("DETAIL:", data);
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="detail-wrapper">
      <h2>{product.name ?? product.Name}</h2>

      {/* IMAGE */}
      {(product.image ?? product.Image) && (
        <img
          src={`${API_BASE}${product.image ?? product.Image}`}
          className="detail-image"
          alt="product"
        />
      )}

      <p>
        <strong>Description:</strong>{" "}
        {product.description ?? product.Description ?? "-"}
      </p>

      <p>
        <strong>Address:</strong>{" "}
        {product.address ?? product.Address ?? "-"}
      </p>

      <p>
        <strong>Age:</strong>{" "}
        {(product.ageRestriction ?? product.AgeRestriction ?? 0) + "+"}
      </p>

      <p>
        <strong>Start:</strong>{" "}
        {product.startDate || product.StartDate
          ? new Date(product.startDate || product.StartDate).toLocaleString()
          : "-"}
      </p>

      <p>
        <strong>End:</strong>{" "}
        {product.endDate || product.EndDate
          ? new Date(product.endDate || product.EndDate).toLocaleString()
          : "-"}
      </p>

      <button onClick={() => navigate("/admin/product")}>Back</button>
    </div>
  );
}

export default DetailProduct;