import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SliderIndex.css";

function SliderIndex() {
  const navigate = useNavigate();

  const [sliders, setSliders] = useState([]);

  const fetchSliders = async () => {
    try {
      const res = await fetch("https://localhost:7204/api/SliderGetAll");
      const data = await res.json();
      setSliders(Array.isArray(data) ? data : []);
    } catch {
      setSliders([]);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await fetch(`https://localhost:7204/api/SliderDelete/${id}`, {
      method: "DELETE",
    });
    fetchSliders();
  };

  return (
    <div className="slider-container">
      <h2>Sliders</h2>

      <button
        className="create-btn"
        onClick={() => navigate("/admin/slider/createSliderForm")}
      >
        + Create
      </button>

      <table className="slider-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>SubTitle</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sliders.length === 0 ? (
            <tr>
              <td colSpan="5">No sliders</td>
            </tr>
          ) : (
            sliders.map((s) => (
              <tr key={s.id}>
                <td className="title">{s.title}</td>
                <td className="title">{s.subTitle}</td>
                <td className="description">{s.desc}</td>
                <td className="title" style={{width:"20PC"}}>{s.image && <img src={s.image} alt="" />}</td>
                <td className="actions">
                  <button className="buton"
                    onClick={() =>
                      navigate(`/admin/slider/editSliderForm/${s.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button className="buton2" onClick={() => handleDelete(s.id)}>
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

export default SliderIndex;
