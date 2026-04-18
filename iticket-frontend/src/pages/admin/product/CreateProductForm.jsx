import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { AdminButton } from "../../../components/admin/AdminButton";
import "./Product.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

function CreateProductForm() {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, scRes, pRes, lRes] = await Promise.all([
          fetch(`${API_BASE}/api/CategoryGetAll`),
          fetch(`${API_BASE}/api/SubCategoryGetAll`),
          fetch(`${API_BASE}/api/PersonGetAll`),
          fetch(`${API_BASE}/api/LanguageGetAll`),
        ]);

        const categories = await cRes.json();
        const subCategories = await scRes.json();
        const persons = await pRes.json();
        const languages = await lRes.json();

        setCategories(Array.isArray(categories) ? categories : []);
        setSubCategories(Array.isArray(subCategories) ? subCategories : []);
        setPersons(Array.isArray(persons) ? persons : []);
        setLanguages(Array.isArray(languages) ? languages : []);
      } catch (error) {
        console.error("Error fetching form data:", error);
        showToast("Failed to load form data", "error");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
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

    // Validation
    if (!form.name.trim()) {
      showToast("Product name is required", "warning");
      return;
    }

    if (!image) {
      showToast("Product image is required", "warning");
      return;
    }

    if (!form.startDate || !form.endDate) {
      showToast("Start and end dates are required", "warning");
      return;
    }

    if (new Date(form.startDate) < new Date()) {
      showToast("Start date cannot be in the past", "warning");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      showToast("End date must be after start date", "warning");
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
    if (form.subCategoryId) {
      data.append("SubCategoryId", parseInt(form.subCategoryId));
    }
    data.append("PersonId", parseInt(form.personId));

    form.languageIds.forEach(id => data.append("LanguageIds", id));
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
        throw new Error(errorText || "Failed to create product");
      }

      showToast("✓ Product created successfully!", "success");
      setTimeout(() => {
        navigate("/admin/product/productIndex");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      showToast("Error creating product: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading-box">Loading form data...</div>;
  }

  return (
    <div className="product-form-wrapper">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <form className="product-form" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: "24px" }}>Create New Product</h2>

        <div className="form-group">
          <label>Product Name *</label>
          <input
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter product description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Address *</label>
          <input
            name="address"
            placeholder="Enter event address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age Rating</label>
            <input
              type="number"
              min="0"
              name="ageRestriction"
              value={form.ageRestriction}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="datetime-local"
              name="startDate"
              min={now}
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="datetime-local"
              name="endDate"
              min={form.startDate || now}
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id || c.Id} value={c.id || c.Id}>
                  {c.name || c.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sub-Category</label>
            <select
              name="subCategoryId"
              value={form.subCategoryId}
              onChange={handleChange}
            >
              <option value="">Select a sub-category</option>
              {subCategories.map(sc => (
                <option key={sc.id || sc.Id} value={sc.id || sc.Id}>
                  {sc.name || sc.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Organizer *</label>
            <select
              name="personId"
              value={form.personId}
              onChange={handleChange}
              required
            >
              <option value="">Select an organizer</option>
              {persons.map(p => (
                <option key={p.id || p.Id} value={p.id || p.Id}>
                  {p.name || p.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Languages</label>
          <select multiple onChange={handleLanguageChange} style={{ minHeight: "100px" }}>
            {languages.map(l => (
              <option key={l.id || l.Id} value={l.id || l.Id}>
                {l.name || l.Name}
              </option>
            ))}
          </select>
          <small>Hold Ctrl/Cmd to select multiple languages</small>
        </div>

        <div className="form-group">
          <label>Product Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          {image && <p className="file-name">✓ {image.name}</p>}
        </div>

        <div className="form-group">
          <label>Product Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
          {video && <p className="file-name">✓ {video.name}</p>}
        </div>

        <div className="form-buttons">
          <AdminButton
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </AdminButton>
          <AdminButton
            type="button"
            variant="cancel"
            onClick={() => navigate("/admin/product/productIndex")}
            disabled={loading}
          >
            Cancel
          </AdminButton>
        </div>
      </form>
    </div>
  );
}

export default CreateProductForm;