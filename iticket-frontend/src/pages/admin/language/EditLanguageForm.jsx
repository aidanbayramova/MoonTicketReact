import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./LanguageForms.css";

function EditLanguageForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [language, setLanguage] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const res = await fetch(`https://localhost:7204/api/LanguageGetById/${id}`);
        if (!res.ok) throw new Error("Language not found");

        const data = await res.json();
        setLanguage(data);
        setName(data.name || data.Name || "");
      } catch (err) {
        alert(err.message);
        navigate("/admin/language/languageIndex");
      } finally {
        setLoading(false);
      }
    };
    fetchLanguage();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!language?.id) return;

    setSaving(true);

    try {
      const res = await fetch(`https://localhost:7204/api/LanguageEdit/${language.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("Edit failed: " + errorText);
        return;
      }

      alert("Language updated successfully!");
      navigate("/admin/language/languageIndex");
    } catch (err) {
      alert("Edit failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-box">Loading...</div>;

  return (
    <div className="language-form-page">
      <h2 className="form-title">Edit Language</h2>

      <form className="language-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="form-actions">
          <button className="create-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Edit"}
          </button>
          <button
            className="cancel-btn"
            type="button"
            onClick={() => navigate("/admin/language/languageIndex")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLanguageForm;