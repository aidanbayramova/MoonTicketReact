import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { AdminButton } from "../../../components/admin/AdminButton";
import "./CategoryIndex.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function EditCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/CategoryGetById/${id}`);
        if (!res.ok) throw new Error("Category not found");

        const data = await res.json();
        setCategory(data);
        setName(data.name || data.Name || "");
        setDescription(data.description || data.Description || "");
      } catch (err) {
        showToast(err.message, "error");
        setTimeout(() => navigate("/admin/category/categoryIndex"), 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return;

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
      const res = await fetch(`${API_BASE}/api/CategoryEdit/${category.id || category.Id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update category");
      }

      showToast("✓ Category updated successfully!", "success");
      setTimeout(() => {
        navigate("/admin/category/categoryIndex");
      }, 1000);
    } catch (err) {
      console.error(err);
      showToast("Error updating category: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-box">Loading category...</div>;
  }

  return (
    <div className="category-form-page">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <h2 className="form-title">Edit Category</h2>

      <form className="category-form" onSubmit={handleSubmit}>
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
            rows={4}
            required
          />
        </div>

        {/* Media Preview */}
        <div className="media-preview-container">
          {category && (category.image || category.Image) && (
            <div className="media-preview">
              <p>Current Image:</p>
              <img
                src={`${API_BASE}${category.image || category.Image}`}
                alt="category"
              />
            </div>
          )}

          {category && (category.video || category.Video) && (
            <div className="media-preview">
              <p>Current Video:</p>
              <video src={`${API_BASE}${category.video || category.Video}`} controls />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">New Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && <p className="file-name">✓ {image.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="video">New Video</label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
          {video && <p className="file-name">✓ {video.name}</p>}
        </div>

        <div className="form-buttons">
          <AdminButton
            type="submit"
            variant="primary"
            disabled={saving}
            loading={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
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

export default EditCategoryForm;