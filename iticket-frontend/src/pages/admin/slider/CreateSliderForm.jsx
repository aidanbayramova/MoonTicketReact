import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { AdminButton } from "../../../components/admin/AdminButton";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function CreateSliderForm() {
  const navigate = useNavigate();
    const { toasts, showToast, removeToast } = useToast();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  setSaving(true);

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("SubTitle", subTitle);
    formData.append("Desc", desc);
    if (image) formData.append("Image", image);

    try {
      const res = await fetch(`${API_BASE}/api/SliderCreate`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

  showToast("✓ Slider created successfully!", "success");
  setTimeout(() => navigate("/admin/slider/sliderIndex"), 1000);
    } catch (err) {
      console.error(err);
      showToast("Error: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="slider-form-page">
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <h2 className="create-font">Create Slider</h2>

      <form onSubmit={handleSubmit} className="slider-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="SubTitle"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <div style={{ marginTop: "10px" }}>
          <AdminButton type="submit" variant="primary" loading={saving} disabled={saving}>
            {saving ? "Creating..." : "Create Slider"}
          </AdminButton>
          <AdminButton
            type="button"
            variant="cancel"
            onClick={() => navigate("/admin/slider/sliderIndex")}
            disabled={saving}
          >
            Cancel
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

export default CreateSliderForm;
