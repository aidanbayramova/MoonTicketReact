import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoryIndex.css";

function CategoryIndex() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await fetch("https://localhost:7204/api/CategoryGetAll");
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch {
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        await fetch(`https://localhost:7204/api/CategoryDelete/${id}`, {
            method: "DELETE",
        });
        fetchCategories();
    };

    return (
        <div className="category-container">
            <h2 style={{ fontSize: "36px", marginBottom: "20px", fontWeight: 600 }}>Categories</h2>

            <button
                className="create-btn"
                onClick={() => navigate("/admin/category/createCategoryForm")}
            >
                + Create
            </button>

            <table className="category-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Video</th>

                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan="7">No categories found</td>
                        </tr>
                    ) : (
                        categories.map((c) => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td className="desc">{c.description}</td>
                                <td className="media">
                                    {c.image && (
                                      <img src={`https://localhost:7204${c.image}`} alt={c.name} />
                                    )}
                                </td>
                                <td className="media">
                                    {c.video && (
                                       <video src={`https://localhost:7204${c.video}`} controls />
                                    )}
                                </td>

                                <td className="actions">
                                    <button
                                        className="buton"
                                        onClick={() => navigate(`/admin/category/editCategoryForm/${c.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="buton2"
                                        onClick={() => handleDelete(c.id)}
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

export default CategoryIndex;