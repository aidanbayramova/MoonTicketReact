import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonForms.css";

function PersonIndex() {
    const navigate = useNavigate();
    const [persons, setPersons] = useState([]);

    const fetchPersons = async () => {
        try {
            const res = await fetch("https://localhost:7204/api/PersonGetAll");
            const data = await res.json();
            setPersons(Array.isArray(data) ? data : []);
        } catch {
            setPersons([]);
        }
    };

    useEffect(() => {
        fetchPersons();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this person?")) return;
        await fetch(`https://localhost:7204/api/PersonDelete/${id}`, {
            method: "DELETE",
        });
        fetchPersons();
    };

    return (
        <div className="person-container">
            <h2 className="page-title">Persons</h2>

            <button
                className="create-btn"
                onClick={() => navigate("/admin/person/createPersonForm")}
            >
                + Create
            </button>

            <table className="person-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Products Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {persons.length === 0 ? (
                        <tr>
                            <td colSpan="3">No persons found</td>
                        </tr>
                    ) : (
                        persons.map((p) => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.products?.length || 0}</td>
                                <td className="actions">
                                    <button
                                        className="buton"
                                        onClick={() => navigate(`/admin/person/editPersonForm/${p.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="buton2"
                                        onClick={() => handleDelete(p.id)}
                                    >
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

export default PersonIndex;