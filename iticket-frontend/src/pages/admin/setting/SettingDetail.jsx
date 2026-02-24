import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SettingIndex.css";

function SettingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch(
          `https://localhost:7204/api/SettingGetById/${id}`
        );
        if (!res.ok) throw new Error();

        const data = await res.json();
        setSetting(data);
      } catch {
        alert("Setting tapılmadı");
        navigate("/admin/setting");
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, [id, navigate]);

  if (loading) return <div className="loading-box">Loading...</div>;
  if (!setting) return null;

  return (
    <div className="setting-detail-container">
      <h2 style={{ fontSize: "36px" }}>Setting Detail</h2>

      <table className="setting-detail-table">
        <tbody>
          <tr>
            <th>Website Name</th>
            <td>{setting.websiteName}</td>
          </tr>

          <tr>
            <th>Footer</th>
            <td>{setting.footerDesc}</td>
          </tr>

          <tr>
            <th>About Title</th>
            <td>{setting.aboutTitle}</td>
          </tr>

          <tr>
            <th>About Description</th>
            <td>{setting.aboutDescription}</td>
          </tr>

          {setting.bannerImg && (
            <tr>
              <th>Banner Image</th>
              <td>
                <img src={setting.bannerImg} alt="Banner" />
              </td>
            </tr>
          )}

          {setting.aboutImg && (
            <tr>
              <th>About Image</th>
              <td>
                <img src={setting.aboutImg} alt="About" />
              </td>
            </tr>
          )}

          {setting.video && (
            <tr>
              <th>Video</th>
              <td>
                <video width="320" controls>
                  <source src={setting.video} type="video/mp4" />
                </video>
              </td>
            </tr>
          )}

          <tr>
            <th>Contact Title One</th>
            <td>{setting.contactTitleOne}</td>
          </tr>

          <tr>
            <th>Contact Title Two</th>
            <td>{setting.contactTitleTwo}</td>
          </tr>

          <tr>
            <th>Email</th>
            <td>{setting.email}</td>
          </tr>

          <tr>
            <th>Number</th>
            <td>{setting.number}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          className="buton"
          onClick={() => navigate(`/admin/setting/editSettingForm/${setting.id}`)}
        >
          Edit
        </button>

        <button
          className="buton2"
          onClick={() => navigate("/admin/setting/settingIndex")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default SettingDetail;
