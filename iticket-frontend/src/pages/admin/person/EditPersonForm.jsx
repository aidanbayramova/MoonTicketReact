import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PersonForms.css";

function EditPersonForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch person by ID
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await fetch(`https://localhost:7204/api/PersonGetById/${id}`);
        if (!res.ok) throw new Error("Person not found");

        const data = await res.json();
        console.log("Fetched person:", data);

        setPerson(data);
        setName(data.name || data.Name || ""); // backend PascalCase ola bilər
      } catch (err) {
        alert(err.message);
        navigate("/admin/person/personIndex");
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
  }, [id, navigate]);

  // Submit edited person
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!person || !person.id) return;

    setSaving(true);

    const dto = { Name: name }; // backend ilə match edir

    try {
      const res = await fetch(`https://localhost:7204/api/PersonEdit/${person.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        alert("Edit failed: " + errorText);
        return;
      }

      alert("Person updated successfully!");
      navigate("/admin/person/personIndex");
    } catch (err) {
      console.error(err);
      alert("Edit failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="loading-box">Loading...</div>;

  return (
    <div className="person-form-page">
      <h2 className="form-title">Edit Person</h2>

      <form className="person-form" onSubmit={handleSubmit}>
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
            onClick={() => navigate("/admin/person/personIndex")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPersonForm;