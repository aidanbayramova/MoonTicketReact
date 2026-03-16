import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Product.css";

function EditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const now = new Date().toISOString().slice(0, 16);

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [ageRestriction, setAgeRestriction] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Mövcud product-u gətir
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7204/api/ProductGetById/${id}`);
        const data = await res.json();

        setProduct(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setAddress(data.address || "");
        setAgeRestriction(data.ageRestriction || 0);

        // datetime-local formatına çevir
        const formatDate = (date) =>
          new Date(date).toISOString().slice(0, 16);

        setStartDate(formatDate(data.startDate));
        setEndDate(formatDate(data.endDate));
      } catch {
        alert("Product tapılmadı");
        navigate("/admin/product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(startDate) < new Date()) {
      alert("Keçmiş tarix seçilə bilməz");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("EndDate StartDate-dən böyük olmalıdır");
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("Address", address);
    formData.append("AgeRestriction", ageRestriction);
    formData.append("StartDate", startDate);
    formData.append("EndDate", endDate);

    if (image) formData.append("Image", image);
    if (video) formData.append("Video", video);

    await fetch(`https://localhost:7204/api/ProductEdit/${id}`, {
      method: "PUT",
      body: formData,
    });

    navigate("/admin/product");
  };

  if (loading) return <div className="loading-box">Loading...</div>;

  return (
    <div className="product-form-wrapper">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Edit Product</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          type="number"
          value={ageRestriction}
          onChange={(e) => setAgeRestriction(e.target.value)}
        />

        {/* 🔥 Calendar + Saat */}
        <label>Start Date & Time</label>
        <input
          type="datetime-local"
          min={now}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End Date & Time</label>
        <input
          type="datetime-local"
          min={startDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        {/* Mövcud şəkil */}
        {product.image && (
          <div>
            <p>Current Image:</p>
            <img
              src={product.image}
              alt=""
              style={{ width: "150px", borderRadius: "10px" }}
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* Mövcud video */}
        {product.video && (
          <div>
            <p>Current Video:</p>
            <video
              src={product.video}
              width="200"
              controls
              style={{ borderRadius: "10px" }}
            />
          </div>
        )}

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/admin/product")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProductForm;