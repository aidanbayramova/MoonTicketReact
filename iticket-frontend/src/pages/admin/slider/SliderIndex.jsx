import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { AdminButton } from "../../../components/admin/AdminButton";
import "./SliderIndex.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function SliderIndex() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/SliderGetAll`);
      if (!res.ok) throw new Error("Failed to fetch sliders");
      const data = await res.json();
      setSliders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showToast("Failed to load sliders", "error");
      setSliders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ open: false, id: null });

    try {
      const res = await fetch(`${API_BASE}/api/SliderDelete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete slider");

      showToast("Slider deleted successfully!", "success");
      fetchSliders();
    } catch (error) {
      console.error(error);
      showToast("Error deleting slider", "error");
    }
  };

  if (loading) {
    return <div className="loading-box">Loading sliders...</div>;
  }

  return (
    <div className="slider-container">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="page-header">
        <h2>Sliders Management</h2>
        <AdminButton
          variant="primary"
          onClick={() => navigate("/admin/slider/createSliderForm")}
        >
          + Create Slider
        </AdminButton>
      </div>

      <table className="slider-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Sub Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sliders.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-state">
                No sliders found
              </td>
            </tr>
          ) : (
            sliders.map((s) => {
              const id = s.id || s.Id;
              return (
                <tr key={id}>
                  <td className="title name-cell">{s.title || s.Title}</td>
                  <td className="title">{s.subTitle || s.SubTitle || "-"}</td>
                  <td className="description">{s.desc || s.Desc || "-"}</td>
                  <td className="media">
                    {s.image || s.Image ? (
                      <img src={`${API_BASE}${s.image || s.Image}`} alt={s.title || s.Title} />
                    ) : (
                      <span className="no-media">No image</span>
                    )}
                  </td>
                  <td className="actions">
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/slider/editSliderForm/${id}`)
                      }
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
        title="Delete Slider"
        message="Are you sure you want to delete this slider? This action cannot be undone."
        confirmText="Delete Permanently"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
        isDangerous={true}
      />
    </div>
  );
}

export default SliderIndex;
