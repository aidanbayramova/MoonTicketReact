import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonForms.css";

function CreatePersonForm() {

    const navigate = useNavigate();
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("https://localhost:7204/api/PersonCreate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Create failed");
            }

            alert("Person created successfully!");
            navigate("/admin/person/personIndex");

        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="person-form-page">
            <h2 className="form-title">Create Person</h2>

            <form onSubmit={handleSubmit} className="person-form">

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
            onClick={() => navigate("//admin/person/personIndex")}
          >
            Cancel
          </button>
        </div>

            </form>

        </div>
    );
}

export default CreatePersonForm;