import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingIndex.css";

function SettingIndex() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState([]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("https://localhost:7204/api/SettingGetAll");
      const data = await res.json();
      setSettings(Array.isArray(data) ? data : []);
    } catch {
      setSettings([]);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="setting-container">
      <h2>Settings</h2>

      {settings.length === 0 && (
        <button
          className="create-btn"
          onClick={() => navigate("/admin/setting/CreateSettingForm")}
        >
          + Create
        </button>
      )}

      <table className="setting-table">
        <thead>
          <tr>
            <th>Website Name</th>
            <th>Footer</th>
            <th>About Title</th>
            <th>About Image</th>
            <th>Video</th>
            <th>Contact 1</th>
            <th>Contact 2</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {settings.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                No settings found
              </td>
            </tr>
          ) : (
            settings.map((s) => (
              <tr key={s.id}>
                <td>{s.websiteName}</td>
                <td>{s.footerDesc}</td>
                <td>{s.aboutTitle}</td>
                <td className="image">
                  {s.aboutImg && <img src={s.aboutImg} alt="About" />}
                </td>
                <td className="image">
                  {s.video && (
                    <video width="120" height="70" controls>
                      <source src={s.video} type="video/mp4" />
                    </video>
                  )}
                </td>
                <td>{s.contactTitleOne}</td>
                <td>{s.contactTitleTwo}</td>
                <td className="actions">
                  <button
                    className="buton"
                    onClick={() => navigate(`/admin/setting/settingDetail/${s.id}`)}
                  >
                    Detail
                  </button>
                  <button
                    className="buton2"
                    onClick={() => navigate(`/admin/setting/editSettingForm/${s.id}`)}
                  >
                    Edit
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

export default SettingIndex;
