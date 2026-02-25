import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryIndex.css";


function CreateCategoryForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    if (image) formData.append("Image", image);
    if (video) formData.append("Video", video);

    try {
      const res = await fetch("https://localhost:7204/api/CategoryCreate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      alert("Category created successfully!");
      navigate("/admin/category/categoryIndex"); 
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="category-form-page">
      <h2 className="form-title">Create Category</h2>

      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <label>Video:</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
        />

        <div className="form-buttons">
          <button className="buton" type="submit">Create</button>
          <button
            className="buton"
            type="button"
            onClick={() => navigate("//admin/category/categoryIndex")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCategoryForm;