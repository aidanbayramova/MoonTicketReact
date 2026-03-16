import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SubCategoryForms.css";

function CreateSubCategoryForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://localhost:7204/api/CategoryGetAll");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending:", {
      name,
      categoryName,
    });

    try {
      const res = await fetch("https://localhost:7204/api/SubCategoryCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          categoryName: categoryName,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || "Create failed");
      }

      alert("SubCategory created successfully!");
      navigate("/admin/subcategory/subCategoryIndex");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="subcategory-form-page">
      <h2 className="form-title">Create SubCategory</h2>

      <form onSubmit={handleSubmit} className="subcategory-form">
        {/* Name */}
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <select
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button className="buton" type="submit">
            Create
          </button>

          <button
            className="buton"
            type="button"
            onClick={() =>
              navigate("/admin/subcategory/subCategoryIndex")
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSubCategoryForm;