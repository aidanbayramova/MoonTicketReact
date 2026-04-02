import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewsAuthorAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function NewsAuthorIndex() {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);

  const fetchAuthors = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/NewsAuthorGetAll`);
      const data = await res.json();
      setAuthors(Array.isArray(data) ? data : []);
    } catch {
      setAuthors([]);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;

    await fetch(`${API_BASE}/api/NewsAuthorDelete/${id}`, {
      method: "DELETE",
    });

    fetchAuthors();
  };

  return (
    <div className="news-author-admin-container">
      <h2 className="news-author-admin-title">News Authors</h2>

      <button
        className="news-author-admin-create-btn"
        onClick={() => navigate("/admin/newsauthor/createNewsAuthorForm")}
      >
        + Create
      </button>

      <table className="news-author-admin-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {authors.length === 0 ? (
            <tr>
              <td colSpan="2">No authors found</td>
            </tr>
          ) : (
            authors.map((a) => (
              <tr key={a.id}>
                <td>{a.fullName}</td>
                <td>
                  <button
                    className="news-author-admin-primary-btn"
                    onClick={() => navigate(`/admin/newsauthor/detailNewsAuthor/${a.id}`)}
                  >
                    Detail
                  </button>
                  <button
                    className="news-author-admin-primary-btn"
                    onClick={() => navigate(`/admin/newsauthor/editNewsAuthorForm/${a.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="news-author-admin-secondary-btn"
                    onClick={() => handleDelete(a.id)}
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

export default NewsAuthorIndex;
