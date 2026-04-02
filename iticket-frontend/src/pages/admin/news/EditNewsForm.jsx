import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewsAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const getMediaUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

function EditNewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [newsAuthorId, setNewsAuthorId] = useState("");
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, authorsRes] = await Promise.all([
          fetch(`${API_BASE}/api/NewsGetById/${id}`),
          fetch(`${API_BASE}/api/NewsAuthorGetAll`),
        ]);

        if (!newsRes.ok) throw new Error("News not found");

        const newsData = await newsRes.json();
        const authorsData = await authorsRes.json();

        const list = Array.isArray(authorsData) ? authorsData : [];
        setAuthors(list);

        setTitle(newsData.title || "");
        setDesc(newsData.desc || "");
        setLocation(newsData.location || "");
        setNewsAuthorId(String(newsData.newsAuthorId || ""));
        setOldImage(newsData.image || "");
      } catch (err) {
        alert(err.message);
        navigate("/admin/news/newsIndex");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Desc", desc);
    formData.append("Location", location);
    formData.append("NewsAuthorId", newsAuthorId);
    if (image) formData.append("Image", image);

    try {
      const res = await fetch(`${API_BASE}/api/NewsEdit/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Edit failed");
      }

      alert("News updated successfully!");
      navigate("/admin/news/newsIndex");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="news-admin-loading">Loading...</div>;

  return (
    <div className="news-admin-form-page">
      <h2 className="news-admin-title">Edit News</h2>

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
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.fullName}
            </option>
          ))}
        </select>

        {oldImage && <img src={getMediaUrl(oldImage)} alt="Current" style={{ width: "180px", borderRadius: "10px" }} />}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <div className="news-admin-form-buttons">
          <button className="news-admin-primary-btn" type="submit">
            Save
          </button>
          <button
            className="news-admin-secondary-btn"
            type="button"
            onClick={() => navigate("/admin/news/newsIndex")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNewsForm;
