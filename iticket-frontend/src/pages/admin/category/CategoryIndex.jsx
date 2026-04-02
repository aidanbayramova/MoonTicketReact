import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryIndex.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function CategoryIndex() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/CategoryGetAll`);
      const data = await res.json();

      // 🔹 NEWEST FIRST SORT
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => {
            // əvvəlcə createdDate varsa ona görə sırala
            if (a.createdDate && b.createdDate) {
              return new Date(b.createdDate) - new Date(a.createdDate);
            }
            // yoxdursa id ilə fallback
            return b.id - a.id;
          })
        : [];

      setCategories(sorted);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await fetch(`${API_BASE}/api/CategoryDelete/${id}`, {
        method: "DELETE",
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 PATH FIX FUNCTION
  const getMediaUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_BASE}${path}`;
  };

  if (loading) {
    return <div className="loading-box">Loading...</div>;
  }

  return (
    <div className="category-container">
      <h2 style={{ fontSize: "36px", marginBottom: "20px", fontWeight: 600 }}>
        Categories
      </h2>

      <button
        className="create-btn"
        onClick={() => navigate("/admin/category/createCategoryForm")}
      >
        + Create
      </button>

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Video</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="5">No categories found</td>
            </tr>
          ) : (
            categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>

                <td className="desc">{c.description}</td>

                {/* IMAGE */}
                <td className="media">
                  {c.image ? (
                    <img src={getMediaUrl(c.image)} alt={c.name} />
                  ) : (
                    <span>No image</span>
                  )}
                </td>

                {/* VIDEO */}
                <td className="media">
                  {c.video ? (
                    <video
                      src={getMediaUrl(c.video)}
                      controls
                      width="120"
                    />
                  ) : (
                    <span>No video</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="actions">
                  <button
                    className="buton"
                    onClick={() =>
                      navigate(`/admin/category/editCategoryForm/${c.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="buton2"
                    onClick={() => handleDelete(c.id)}
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

export default CategoryIndex;