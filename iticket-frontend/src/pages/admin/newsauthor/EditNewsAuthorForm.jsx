import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NewsAuthorAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function EditNewsAuthorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/NewsAuthorGetById/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Author not found");
        return res.json();
      })
      .then((data) => setFullName(data.fullName || ""))
      .catch((err) => {
        alert(err.message);
        navigate("/admin/newsauthor/newsAuthorIndex");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/NewsAuthorEdit/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Edit failed");
      }

      alert("Author updated successfully!");
      navigate("/admin/newsauthor/newsAuthorIndex");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div className="news-author-admin-loading">Loading...</div>;

  return (
    <div className="news-author-admin-form-page">
      <h2 className="news-author-admin-title">Edit News Author</h2>

      <form className="news-author-admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <div className="news-author-admin-form-buttons">
          <button className="news-author-admin-primary-btn" type="submit">
            Save
          </button>
          <button
            className="news-author-admin-secondary-btn"
            type="button"
            onClick={() => navigate("/admin/newsauthor/newsAuthorIndex")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditNewsAuthorForm;
