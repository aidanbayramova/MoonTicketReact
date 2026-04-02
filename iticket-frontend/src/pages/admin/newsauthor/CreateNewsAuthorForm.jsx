import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewsAuthorAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function CreateNewsAuthorForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/NewsAuthorCreate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      alert("Author created successfully!");
      navigate("/admin/newsauthor/newsAuthorIndex");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="news-author-admin-form-page">
      <h2 className="news-author-admin-title">Create News Author</h2>

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
            Create
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

export default CreateNewsAuthorForm;
