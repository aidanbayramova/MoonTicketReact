import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewsAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const getMediaUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

function DetailNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/NewsGetById/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("News not found");
        return res.json();
      })
      .then((data) => setNews(data))
      .catch(() => {
        alert("News not found");
        navigate("/admin/news/newsIndex");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="news-admin-loading">Loading...</div>;
  if (!news) return null;

  return (
    <div className="news-admin-detail-container">
      <h2 className="news-admin-title">News Detail</h2>

      <table className="news-admin-detail-table">
        <tbody>
          <tr>
            <th>Title</th>
            <td>{news.title}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{news.desc}</td>
          </tr>
          <tr>
            <th>Location</th>
            <td>{news.location}</td>
          </tr>
          <tr>
            <th>Author</th>
            <td>{news.newsAuthorFullName}</td>
          </tr>
          <tr>
            <th>Image</th>
            <td>{news.image ? <img src={getMediaUrl(news.image)} alt={news.title} /> : "No image"}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          className="news-admin-primary-btn"
          onClick={() => navigate(`/admin/news/editNewsForm/${news.id}`)}
        >
          Edit
        </button>
        <button
          className="news-admin-secondary-btn"
          onClick={() => navigate("/admin/news/newsIndex")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default DetailNews;
