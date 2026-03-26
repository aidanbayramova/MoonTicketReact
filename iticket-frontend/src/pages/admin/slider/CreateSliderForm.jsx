import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function CreateSliderForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      alert("Slider created successfully!");
      navigate("/admin/slider/sliderIndex"); 
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="slider-form-page">
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
          <button className="buton" type="submit">Create</button>
          <button className="buton"
            type="button"
            onClick={() => navigate("/admin/slider/sliderIndex")}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSliderForm;
