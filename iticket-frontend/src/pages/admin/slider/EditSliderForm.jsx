import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SliderIndex.css";

function EditSliderForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [slider, setSlider] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Slider fetch
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch(
          `https://localhost:7204/api/SliderGetById/${id}`
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        setSlider(data);
        setTitle(data.title || "");
        setSubTitle(data.subTitle || "");
        setDesc(data.desc || "");
      } catch {
        alert("Slider tapılmadı");
        navigate("/admin/slider/sliderIndex");
      } finally {
        setLoading(false);
      }
    };

    fetchSlider();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slider) return;

    setSaving(true);

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("SubTitle", subTitle);
    formData.append("Desc", desc);
    if (image) formData.append("Image", image);

    try {
      const res = await fetch(
        `https://localhost:7204/api/SliderEdit/${slider.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) throw new Error();

      navigate("/admin/slider/sliderIndex");
    } catch {
      alert("Edit zamanı xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-box">Loading slider...</div>;
  }

  return (
    <div className="edit-slider-wrapper">
      <form className="edit-slider-form" onSubmit={handleSubmit}>
        <h2 style={{ fontSize: "39px" }}>Edit Slider</h2>
        <div className="form-group">
          <label htmlFor="name">Title</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="name">SubTitle</label>

          <input
            type="text"
            placeholder="SubTitle"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            required
          />
          <label htmlFor="name">Description</label>

          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            required
          />
        </div>


        {slider.image && (
          <div className="image-preview" >
            <p>Current image:</p>
            <img style={{width:"20pc"}} src={slider.image} alt="slider" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="form-actions">
          <button className="create-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Edit"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/slider/sliderIndex")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSliderForm;
