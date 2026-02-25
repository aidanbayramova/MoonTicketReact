import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SettingIndex.css";

function EditSettingForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 text values
  const [form, setForm] = useState({
    websiteName: "",
    footerDesc: "",
    aboutTitle: "",
    aboutDescription: "",
    contactTitleOne: "",
    contactTitleTwo: "",
    email: "",
    number: "",
  });

  // 🔹 visibility (enable/disable)
  const [visible, setVisible] = useState({
    websiteName: true,
    footerDesc: true,
    aboutTitle: true,
    aboutDescription: true,
    contactTitleOne: true,
    contactTitleTwo: true,
    email: true,
    number: true,
  });

  // 🔹 files
  const [bannerImg, setBannerImg] = useState(null);
  const [aboutImg, setAboutImg] = useState(null);
  const [video, setVideo] = useState(null);

  // fetch setting by id
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch(`https://localhost:7204/api/SettingGetById/${id}`);
        if (!res.ok) throw new Error("Setting tapılmadı");
        const data = await res.json();

        // set text values
        setForm({
          websiteName: data.websiteName ?? "",
          footerDesc: data.footerDesc ?? "",
          aboutTitle: data.aboutTitle ?? "",
          aboutDescription: data.aboutDescription ?? "",
          contactTitleOne: data.contactTitleOne ?? "",
          contactTitleTwo: data.contactTitleTwo ?? "",
          email: data.email ?? "",
          number: data.number ?? "",
        });

        // set visibility from backend
        setVisible({
          websiteName: data.isShowWebsiteName ?? true,
          footerDesc: data.isShowFooterDesc ?? true,
          aboutTitle: data.isShowAboutTitle ?? true,
          aboutDescription: data.isShowAboutDescription ?? true,
          contactTitleOne: data.isShowContactTitleOne ?? true,
          contactTitleTwo: data.isShowContactTitleTwo ?? true,
          email: data.isShowEmail ?? true,
          number: data.isShowNumber ?? true,
        });

      } catch (err) {
        alert(err.message);
        navigate("/admin/setting/settingIndex");
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();

    // add text + bool values
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key] ?? ""); // string fields
      formData.append(`IsShow${key.charAt(0).toUpperCase() + key.slice(1)}`, visible[key]); // bool fields
    });

    // add files if exist
    if (bannerImg) formData.append("BannerImg", bannerImg);
    if (aboutImg) formData.append("AboutImg", aboutImg);
    if (video) formData.append("Video", video);

    try {
      const res = await fetch(`https://localhost:7204/api/SettingEdit/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Xəta baş verdi");

      alert("Setting updated successfully!");
      navigate("/admin/setting/settingIndex");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-setting-wrapper">
      <h2>Edit Setting</h2>

      <form className="setting-form" onSubmit={handleSubmit}>

        {Object.keys(form).map((key) =>
          visible[key] ? (
            <div key={key} className="setting-field">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={visible[key]}
                  onChange={() => setVisible(p => ({ ...p, [key]: !p[key] }))}
                />
                Enable {key}
              </label>

              <input
                type="text"
                value={form[key]}
                onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ) : (
            <div key={key} className="setting-field">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={visible[key]}
                  onChange={() => setVisible(p => ({ ...p, [key]: !p[key] }))}
                />
                Enable {key}
              </label>
            </div>
          )
        )}

        <div className="file-section">
          <p>Banner Image:</p>
          <input type="file" onChange={(e) => setBannerImg(e.target.files[0])} />

          <p>About Image:</p>
          <input type="file" onChange={(e) => setAboutImg(e.target.files[0])} />

          <p>Video:</p>
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
        </div>

        <div className="form-actions">
          <button type="create-btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => navigate("/admin/setting/settingIndex")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditSettingForm;
