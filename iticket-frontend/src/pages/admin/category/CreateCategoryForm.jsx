import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { AdminButton } from "../../../components/admin/AdminButton";
import "./CategoryIndex.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function CreateCategoryForm() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      showToast("Name and description are required", "warning");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    if (image) formData.append("Image", image);
    if (video) formData.append("Video", video);

    try {
      const res = await fetch(`${API_BASE}/api/CategoryCreate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create category");
      }

      showToast("✓ Category created successfully!", "success");
      setTimeout(() => {
        navigate("/admin/category/categoryIndex");
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast("Error creating category: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="category-form-page">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <h2 className="form-title">Create New Category</h2>

      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label htmlFor="name">Category Name *</label>
          <input
            id="name"
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            placeholder="Enter category description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Category Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && <p className="file-name">✓ {image.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="video">Category Video</label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
          {video && <p className="file-name">✓ {video.name}</p>}
        </div>

        <div className="form-buttons">
          <AdminButton type="submit" variant="primary" disabled={saving} loading={saving}>
            {saving ? "Creating..." : "Create Category"}
          </AdminButton>
          <AdminButton
            type="button"
            variant="cancel"
            onClick={() => navigate("/admin/category/categoryIndex")}
            disabled={saving}
          >
            Cancel
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

export default CreateCategoryForm;