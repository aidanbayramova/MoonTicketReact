import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LanguageForms.css";

function CreateLanguageForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://localhost:7204/api/LanguageCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      alert("Language created successfully!");
      navigate("/admin/language/languageIndex");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="language-form-page">
      <h2 className="form-title">Create Language</h2>

      <form onSubmit={handleSubmit} className="language-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="form-buttons">
          <button className="buton" type="submit">Create</button>
          <button
            className="buton"
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

export default CreateLanguageForm;