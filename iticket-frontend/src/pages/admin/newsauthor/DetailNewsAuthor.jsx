import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewsAuthorAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function DetailNewsAuthor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/NewsAuthorGetById/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Author not found");
        return res.json();
      })
      .then((data) => setAuthor(data))
      .catch(() => {
        alert("Author not found");
        navigate("/admin/newsauthor/newsAuthorIndex");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="news-author-admin-loading">Loading...</div>;
  if (!author) return null;

  return (
    <div className="news-author-admin-detail-container">
      <h2 className="news-author-admin-title">News Author Detail</h2>

      <table className="news-author-admin-detail-table">
        <tbody>
          <tr>
            <th>Id</th>
            <td>{author.id}</td>
          </tr>
          <tr>
            <th>Full Name</th>
            <td>{author.fullName}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          className="news-author-admin-primary-btn"
          onClick={() => navigate(`/admin/newsauthor/editNewsAuthorForm/${author.id}`)}
        >
          Edit
        </button>
        <button
          className="news-author-admin-secondary-btn"
          onClick={() => navigate("/admin/newsauthor/newsAuthorIndex")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default DetailNewsAuthor;
