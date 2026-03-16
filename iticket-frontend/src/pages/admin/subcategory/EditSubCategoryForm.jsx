import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SubCategoryForms.css";

function EditSubCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // ✅ əlavə edildi

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Bütün kateqoriyaları götür
        const catRes = await fetch("https://localhost:7204/api/CategoryGetAll");
        const cats = await catRes.json();
        setCategories(cats);

        // SubCategory məlumatını götür
        const res = await fetch(
          `https://localhost:7204/api/SubCategoryGetById/${id}`
        );
        const data = await res.json();

        setName(data.name);

        // Seçilmiş kateqoriyanı tap və ID-ni saxla
        const cat = cats.find((c) => c.name === data.categoryName);
        setCategoryId(cat ? cat.id : "");

        setLoading(false);
      } catch (err) {
        alert("Error fetching data: " + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const selectedCategory = categories.find(
        (c) => c.id === Number(categoryId)
      );

      if (!selectedCategory) {
        alert("Kateqoriya seçilməyib!");
        setSaving(false);
        return;
      }

      const res = await fetch(
        `https://localhost:7204/api/SubCategoryEdit/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Number(id),
            name: name,
            categoryName: selectedCategory.name,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("SubCategory uğurla yeniləndi!");
      navigate("/admin/subcategory/subCategoryIndex");
    } catch (err) {
      alert("Xəta: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-box">Loading...</div>;

  return (
    <div className="subcategory-form-page">
      <h2 className="form-title">Edit SubCategory</h2>

      <form onSubmit={handleSubmit} className="subcategory-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">-- Choose category --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="form-actions">
          <button className="create-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Edit"}
          </button>

          <button
            className="cancel-btn"
            style={{ marginLeft: "1pc" }}
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

export default EditSubCategoryForm;