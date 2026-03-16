import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubCategoryForms.css";

function SubCategoryIndex() {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);

  const fetchSubCategories = async () => {
    try {
      const res = await fetch("https://localhost:7204/api/SubCategoryGetAll");
      const data = await res.json();
      setSubCategories(Array.isArray(data) ? data : []);
    } catch {
      setSubCategories([]);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;

    await fetch(`https://localhost:7204/api/SubCategoryDelete/${id}`, {
      method: "DELETE",
    });

    fetchSubCategories();
  };

  return (
    <div className="subcategory-container">
      <h2 className="page-title">SubCategories</h2>

      <button
        className="create-btn"
        onClick={() => navigate("/admin/subcategory/createSubCategoryForm")}
      >
        + Create
      </button>

      <table className="subcategory-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Parent Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subCategories.length === 0 ? (
            <tr>
              <td colSpan="3">No subcategories found</td>
            </tr>
          ) : (
            subCategories.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.categoryName || "—"}</td> {/* 🔹 düzəliş burada */}
                <td className="action">
                  <button
                    className="buton"
                    onClick={() => navigate(`/admin/subcategory/editSubCategoryForm/${s.id}`)}
                  >
                    Edit
                  </button>
                  <button className="buton" onClick={() => handleDelete(s.id)}>
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

export default SubCategoryIndex;