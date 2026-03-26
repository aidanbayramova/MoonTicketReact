import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";

const API_BASE = "http://localhost:5149";

function CreateProductForm() {
  const navigate = useNavigate();
  const now = new Date().toISOString().slice(0, 16);

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    ageRestriction: 0,
    startDate: "",
    endDate: "",
    categoryId: "",
    subCategoryId: "",
    personId: "",
    languageIds: []
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [persons, setPersons] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/CategoryGetAll`)
      .then(res => res.json())
      .then(setCategories);

    fetch(`${API_BASE}/api/SubCategoryGetAll`)
      .then(res => res.json())
      .then(setSubCategories);

    fetch(`${API_BASE}/api/PersonGetAll`)
      .then(res => res.json())
      .then(setPersons);

    fetch(`${API_BASE}/api/LanguageGetAll`)
      .then(res => res.json())
      .then(setLanguages);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLanguageChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      option => parseInt(option.value)
    );
    setForm({ ...form, languageIds: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 IMAGE MƏCBURİ
    if (!image) {
      alert("Şəkil seçmək məcburidir!");
      return;
    }

    if (!form.startDate || !form.endDate) {
      alert("Tarixləri seç");
      return;
    }

    if (new Date(form.startDate) < new Date()) {
      alert("Keçmiş tarix olmaz");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date böyük olmalıdır");
      return;
    }

    const data = new FormData();

    data.append("Name", form.name);
    data.append("Description", form.description);
    data.append("Address", form.address);
    data.append("AgeRestriction", parseInt(form.ageRestriction) || 0);

    data.append("StartDate", new Date(form.startDate).toISOString());
    data.append("EndDate", new Date(form.endDate).toISOString());

    data.append("CategoryId", parseInt(form.categoryId));
    data.append(
      "SubCategoryId",
      form.subCategoryId ? parseInt(form.subCategoryId) : ""
    );
    data.append("PersonId", parseInt(form.personId));

    form.languageIds.forEach(id =>
      data.append("LanguageIds", id)
    );

    // 🔥 ƏN VACİB HİSSƏ
    data.append("Image", image);

    if (video) data.append("Video", video);

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/ProductCreate`, {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Product created");
      navigate("/admin/product/productIndex");

    } catch (error) {
      console.error("FULL ERROR:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-wrapper">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Create Product</h2>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />

        <input type="number" name="ageRestriction" value={form.ageRestriction} onChange={handleChange} />

        <input type="datetime-local" name="startDate" min={now} value={form.startDate} onChange={handleChange} required />
        <input type="datetime-local" name="endDate" min={form.startDate || now} value={form.endDate} onChange={handleChange} required />

        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
          <option value="">Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select name="subCategoryId" value={form.subCategoryId} onChange={handleChange}>
          <option value="">SubCategory</option>
          {subCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
        </select>

        <select name="personId" value={form.personId} onChange={handleChange} required>
          <option value="">Person</option>
          {persons.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select multiple onChange={handleLanguageChange}>
          {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>

        {/* 🔥 FILE INPUT */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => {
            setImage(e.target.files[0]);
            console.log(e.target.files[0]); // debug
          }} 
          required
        />

        <input 
          type="file" 
          accept="video/*" 
          onChange={(e) => setVideo(e.target.files[0])} 
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreateProductForm;