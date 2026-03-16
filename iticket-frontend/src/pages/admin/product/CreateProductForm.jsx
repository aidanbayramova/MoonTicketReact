import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";

const API_BASE = "https://localhost:7204";

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
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/CategoryGetAll`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/SubCategoryGetAll`);
        const data = await res.json();
        setSubCategories(data);
      } catch (err) {
        console.error("Failed to fetch subCategories:", err);
      }
    };
    fetchSubCategories();
  }, []);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/PersonGetAll`);
        const data = await res.json();
        setPersons(data);
      } catch (err) {
        console.error("Failed to fetch persons:", err);
      }
    };
    fetchPersons();
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/LanguageGetAll`);
        const data = await res.json();
        setLanguages(data);
      } catch (err) {
        console.error("Failed to fetch languages:", err);
      }
    };
    fetchLanguages();
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

    if (new Date(form.startDate) < new Date()) {
      alert("Keçmiş tarix seçilə bilməz");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End Date Start Date-dən böyük olmalıdır");
      return;
    }

    const data = new FormData();
    data.append("Name", form.name);
    data.append("Description", form.description);
    data.append("Address", form.address);
    data.append("AgeRestriction", form.ageRestriction);
    data.append("StartDate", form.startDate);
    data.append("EndDate", form.endDate);
    data.append("CategoryId", form.categoryId);
    data.append("SubCategoryId", form.subCategoryId || "");
    data.append("PersonId", form.personId);
    form.languageIds.forEach(id => data.append("LanguageIds", id));

    if (image) data.append("Image", image);
    if (video) data.append("Video", video);

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/Product/Create`, {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Product successfully created ");
      navigate("/admin/product/productIndex");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-wrapper">
      <form className="product-form" onSubmit={handleSubmit}>
        <h2>Create Product</h2>

        <label>Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>Address</label>
        <input type="text" name="address" value={form.address} onChange={handleChange} required />

        <label>Age Restriction</label>
        <input type="number" name="ageRestriction" min="0" value={form.ageRestriction} onChange={handleChange} />

        <label>Start Date & Time</label>
        <input type="datetime-local" name="startDate" min={now} value={form.startDate} onChange={handleChange} required />

        <label>End Date & Time</label>
        <input type="datetime-local" name="endDate" min={form.startDate || now} value={form.endDate} onChange={handleChange} required />

        <label>Category</label>
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Sub Category</label>
        <select name="subCategoryId" value={form.subCategoryId} onChange={handleChange}>
          <option value="">Select SubCategory</option>
          {subCategories.map(sc => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>

        <label>Person</label>
        <select name="personId" value={form.personId} onChange={handleChange} required>
          <option value="">Select Person</option>
          {persons.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <label>Languages</label>
        <select multiple onChange={handleLanguageChange}>
          {languages.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <label>Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

        <label>Video</label>
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreateProductForm;