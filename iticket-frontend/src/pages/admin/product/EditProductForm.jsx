import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { AdminButton } from "../../../components/admin/AdminButton";
import "./Product.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function EditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

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
  const [saving, setSaving] = useState(false);

  // 🔥 Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/ProductGetById/${id}`);
        const data = await res.json();

        setProduct(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setAddress(data.address || "");
        setAgeRestriction(data.ageRestriction || 0);

        // Convert to datetime-local format
        const formatDate = (date) =>
          new Date(date).toISOString().slice(0, 16);

        setStartDate(formatDate(data.startDate));
        setEndDate(formatDate(data.endDate));
      } catch {
        showToast("Product not found", "error");
        navigate("/admin/product/productIndex");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(startDate) < new Date()) {
      showToast("Cannot select past date", "warning");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      showToast("End date must be after start date", "warning");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("Address", address);
    formData.append("AgeRestriction", ageRestriction);
    formData.append("StartDate", startDate);
    formData.append("EndDate", endDate);

    if (image) formData.append("Image", image);
    if (video) formData.append("Video", video);
    try {
      const res = await fetch(`${API_BASE}/api/ProductEdit/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Edit failed");
      }

      showToast("✓ Product updated successfully!", "success");
      setTimeout(() => navigate("/admin/product/productIndex"), 1000);
    } catch (err) {
      showToast("Error: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-box">Loading...</div>;

  return (
    <div className="product-form-wrapper">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
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

        {/* 🔥 Calendar + Time */}
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

        {/* Current Image */}
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

        {/* Current Video */}
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
          <AdminButton type="submit" variant="primary" loading={saving} disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </AdminButton>
          <AdminButton type="button" variant="cancel" onClick={() => navigate("/admin/product/productIndex")} disabled={saving}>
            Cancel
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

export default EditProductForm;