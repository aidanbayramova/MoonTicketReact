import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Product.css";

function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`https://localhost:7204/api/ProductGetById/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="detail-wrapper">
      <h2>{product.name}</h2>

      {product.image && <img src={product.image} className="detail-image" alt="" />}

      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Address:</strong> {product.address}</p>
      <p><strong>Age:</strong> {product.ageRestriction}+</p>
      <p><strong>Start:</strong> {new Date(product.startDate).toLocaleString()}</p>
      <p><strong>End:</strong> {new Date(product.endDate).toLocaleString()}</p>

      <button onClick={() => navigate("/admin/product")}>Back</button>
    </div>
  );
}

export default DetailProduct;