import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewsAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const getMediaUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

function NewsIndex() {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/NewsGetAll`);
      const data = await res.json();
      setNewsList(Array.isArray(data) ? data : []);
    } catch {
      setNewsList([]);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;

    await fetch(`${API_BASE}/api/NewsDelete/${id}`, {
      method: "DELETE",
    });

    fetchNews();
  };

  return (
    <div className="news-admin-container">
      <h2 className="news-admin-title">News</h2>

      <button
        className="news-admin-create-btn"
        onClick={() => navigate("/admin/news/createNewsForm")}
      >
        + Create
      </button>

      <table className="news-admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Author</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {newsList.length === 0 ? (
            <tr>
              <td colSpan="6">No news found</td>
            </tr>
          ) : (
            newsList.map((n) => (
              <tr key={n.id}>
                <td>{n.title}</td>
                <td>{n.desc}</td>
                <td>{n.location}</td>
                <td>{n.newsAuthorFullName || "-"}</td>
                <td>
                  {n.image ? (
                    <img src={getMediaUrl(n.image)} alt={n.title} />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="news-admin-actions">
                  <button
                    className="news-admin-primary-btn"
                    onClick={() => navigate(`/admin/news/detailNews/${n.id}`)}
                  >
                    Detail
                  </button>

                  <button
                    className="news-admin-primary-btn"
                    onClick={() => navigate(`/admin/news/editNewsForm/${n.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="news-admin-secondary-btn"
                    onClick={() => handleDelete(n.id)}
                  >
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

export default NewsIndex;
