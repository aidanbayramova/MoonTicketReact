import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CategoryIndex.css";

function EditCategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [category, setCategory] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 🔹 Fetch category
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`https://localhost:7204/api/CategoryGetById/${id}`);
                if (!res.ok) throw new Error("Category tapılmadı");

                const data = await res.json();
                setCategory(data);
                setName(data.name || "");
                setDescription(data.description || "");
            } catch (err) {
                alert(err.message);
                navigate("/admin/category/");
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id, navigate]);

    // 🔹 Submit edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) return;

        setSaving(true);

        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Description", description);
        if (image) formData.append("Image", image);
        if (video) formData.append("Video", video);

        try {
            const res = await fetch(`https://localhost:7204/api/CategoryEdit/${category.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Edit failed");
            }

            alert("Category updated successfully!");
            navigate("/admin/category/categoryIndex");
        } catch (err) {
            alert("Edit zamanı xəta baş verdi: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-box">Loading category...</div>;
    }

    return (
        <div className="category-form-page">
            <form className="category-form" onSubmit={handleSubmit}>
                <h2 className="form-title">Edit Category</h2>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                    />
                </div>

                {/* 🔹 Şəkil və video yan-yana */}
                <div className="media-preview-container">
                    {category.image && (
                        <div className="media-preview">
                            <p>Current Image:</p>
                            <img src={`https://localhost:7204${category.image}`} alt="category" />
                        </div>
                    )}

                    {category.video && (
                        <div className="media-preview">
                            <p>Current Video:</p>
                            <video src={`https://localhost:7204${category.video}`} controls />
                        </div>
                    )}
                </div>

                {/* 🔹 Fayl inputları */}
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />

                <div className="form-actions">
                    <button className="create-btn" type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Edit"}
                    </button>
                    <button
                        className="cancel-btn"
                        style={{ marginLeft: "1pc" }}
                        type="button"
                        onClick={() => navigate("/admin/category/categoryIndex")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditCategoryForm;