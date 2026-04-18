import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { AdminButton } from "../../../components/admin/AdminButton";
import "./CategoryIndex.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function CategoryIndex() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/CategoryGetAll`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      
      const data = await res.json();

      // 🔹 NEWEST FIRST SORT
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => {
            const dateA = a.createdDate || a.CreatedDate;
            const dateB = b.createdDate || b.CreatedDate;
            
            if (dateA && dateB) {
              return new Date(dateB) - new Date(dateA);
            }
            return (b.id || b.Id) - (a.id || a.Id);
          })
        : [];

      setCategories(sorted);
    } catch (err) {
      console.error(err);
      showToast("Failed to load categories", "error");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ open: false, id: null });

    try {
      const res = await fetch(`${API_BASE}/api/CategoryDelete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete category");

      showToast("Category deleted successfully!", "success");
      fetchCategories();
    } catch (err) {
      console.error(err);
      showToast("Error deleting category", "error");
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
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="page-header">
        <h2>Categories</h2>
        <AdminButton
          variant="primary"
          onClick={() => navigate("/admin/category/createCategoryForm")}
        >
          + Create Category
        </AdminButton>
      </div>

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
              <td colSpan="5" className="empty-state">
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((c) => (
              <tr key={c.id || c.Id}>
                <td className="name-cell">{c.name || c.Name}</td>

                <td className="desc">{c.description || c.Description}</td>

                {/* IMAGE */}
                <td className="media">
                  {c.image || c.Image ? (
                    <img src={getMediaUrl(c.image || c.Image)} alt={c.name || c.Name} />
                  ) : (
                    <span className="no-media">No image</span>
                  )}
                </td>

                {/* VIDEO */}
                <td className="media">
                  {c.video || c.Video ? (
                    <video
                      src={getMediaUrl(c.video || c.Video)}
                      controls
                      width="120"
                    />
                  ) : (
                    <span className="no-media">No video</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="actions">
                  <AdminButton
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/admin/category/editCategoryForm/${c.id || c.Id}`)
                    }
                  >
                    Edit
                  </AdminButton>

                  <AdminButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(c.id || c.Id)}
                  >
                    Delete
                  </AdminButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete Permanently"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
        isDangerous={true}
      />
    </div>
  );
}

export default CategoryIndex;