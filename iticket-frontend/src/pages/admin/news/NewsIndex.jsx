import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { AdminButton } from "../../../components/admin/AdminButton";
import { sortNewestFirst } from "../utils/sortNewestFirst";
import "./NewsAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const getMediaUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

function NewsIndex() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/NewsGetAll`);
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      setNewsList(sortNewestFirst(data));
    } catch (error) {
      console.error(error);
      showToast("Failed to load news", "error");
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ open: false, id: null });

    try {
      const res = await fetch(`${API_BASE}/api/NewsDelete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete news");

      showToast("News deleted successfully!", "success");
      fetchNews();
    } catch (error) {
      console.error(error);
      showToast("Error deleting news", "error");
    }
  };

  if (loading) {
    return <div className="loading-box">Loading news...</div>;
  }

  return (
    <div className="news-admin-container">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="page-header">
        <h2 className="news-admin-title">News Management</h2>
        <AdminButton
          variant="primary"
          onClick={() => navigate("/admin/news/createNewsForm")}
        >
          + Create News
        </AdminButton>
      </div>

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
              <td colSpan="6" className="empty-state">
                No news found
              </td>
            </tr>
          ) : (
            newsList.map((n) => {
              const id = n.id || n.Id;
              return (
                <tr key={id}>
                  <td className="name-cell">{n.title || n.Title}</td>
                  <td className="desc">{n.desc || n.Desc}</td>
                  <td>{n.location || n.Location || "-"}</td>
                  <td>{n.newsAuthorFullName || n.NewsAuthorFullName || "-"}</td>
                  <td className="media">
                    {n.image || n.Image ? (
                      <img src={getMediaUrl(n.image || n.Image)} alt={n.title || n.Title} />
                    ) : (
                      <span className="no-media">No image</span>
                    )}
                  </td>
                  <td className="news-admin-actions">
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/admin/news/detailNews/${id}`)}
                    >
                      Detail
                    </AdminButton>

                    <AdminButton
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/admin/news/editNewsForm/${id}`)}
                    >
                      Edit
                    </AdminButton>

                    <AdminButton
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(id)}
                    >
                      Delete
                    </AdminButton>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete News"
        message="Are you sure you want to delete this news? This action cannot be undone."
        confirmText="Delete Permanently"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
        isDangerous={true}
      />
    </div>
  );
}

export default NewsIndex;
