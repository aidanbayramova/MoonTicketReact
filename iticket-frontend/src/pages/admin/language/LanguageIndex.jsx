import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LanguageForms.css";

function LanguageIndex() {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);

  const fetchLanguages = async () => {
    try {
      const res = await fetch("https://localhost:7204/api/LanguageGetAll");
      const data = await res.json();
      setLanguages(Array.isArray(data) ? data : []);
    } catch {
      setLanguages([]);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this language?")) return;
    await fetch(`https://localhost:7204/api/LanguageDelete/${id}`, { method: "DELETE" });
    fetchLanguages();
  };

  return (
    <div className="language-container">
      <h2 className="page-title">Languages</h2>

      <button
        className="create-btn"
        onClick={() => navigate("/admin/language/createLanguageForm")}
      >
        + Create
      </button>

      <table className="language-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Products Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {languages.length === 0 ? (
            <tr>
              <td colSpan="3">No languages found</td>
            </tr>
          ) : (
            languages.map((l) => (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td>{l.productLanguages?.length || 0}</td>
                <td className="actions">
                  <button
                    className="buton"
                    onClick={() => navigate(`/admin/language/editLanguageForm/${l.id}`)}
                  >
                    Edit
                  </button>
                  <button className="buton2" onClick={() => handleDelete(l.id)}>
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

export default LanguageIndex;