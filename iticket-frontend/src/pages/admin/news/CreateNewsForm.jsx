import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { AdminButton } from "../../../components/admin/AdminButton";
import "./NewsAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function CreateNewsForm() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [newsAuthorId, setNewsAuthorId] = useState("");
  const [image, setImage] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/NewsAuthorGetAll`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAuthors(list);
        if (list.length > 0) {
          setNewsAuthorId(String(list[0].id));
        }
      })
      .catch(() => setAuthors([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !desc.trim()) {
      showToast("Title and description are required", "warning");
      return;
    }

    if (!image) {
      showToast("Image is required", "warning");
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Desc", desc);
    formData.append("Location", location);
    formData.append("NewsAuthorId", newsAuthorId);
    formData.append("Image", image);

    try {
      const res = await fetch(`${API_BASE}/api/NewsCreate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      showToast("✓ News created successfully!", "success");
      setTimeout(() => navigate("/admin/news/newsIndex"), 1000);
    } catch (err) {
      showToast("Error: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="news-admin-form-page">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <h2 className="news-admin-title">Create News</h2>

      <form className="news-admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <select
          value={newsAuthorId}
          onChange={(e) => setNewsAuthorId(e.target.value)}
          required
        >
          {authors.length === 0 ? (
            <option value="">No authors found</option>
          ) : (
            authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.fullName}
              </option>
            ))
          )}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />

        <div className="news-admin-form-buttons">
          <AdminButton type="submit" variant="primary" loading={saving} disabled={saving}>
            {saving ? "Creating..." : "Create News"}
          </AdminButton>
          <AdminButton
            type="button"
            variant="cancel"
            onClick={() => navigate("/admin/news/newsIndex")}
            disabled={saving}
          >
            Cancel
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

export default CreateNewsForm;
