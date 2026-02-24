import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateSettingForm() {
  const navigate = useNavigate();

  // Text states
  const [websiteName, setWebsiteName] = useState("");
  const [footerDesc, setFooterDesc] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [contactTitleOne, setContactTitleOne] = useState("");
  const [contactTitleTwo, setContactTitleTwo] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");

  // File states
  const [bannerImg, setBannerImg] = useState(null);
  const [aboutImg, setAboutImg] = useState(null);
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("WebsiteName", websiteName);
    formData.append("FooterDesc", footerDesc);
    formData.append("AboutTitle", aboutTitle);
    formData.append("AboutDescription", aboutDescription);
    formData.append("ContactTitleOne", contactTitleOne);
    formData.append("ContactTitleTwo", contactTitleTwo);
    formData.append("Email", email);
    formData.append("Number", number);

    if (bannerImg) formData.append("BannerImg", bannerImg);
    if (aboutImg) formData.append("AboutImg", aboutImg);
    if (video) formData.append("Video", video);

    try {
      const res = await fetch("https://localhost:7204/api/SettingCreate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Create failed");
      }

      alert("Setting created successfully!");
      navigate("/admin/setting/SettingIndex"); 
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="setting-form-page">
      <h2 className="create-font">Create Setting</h2>

      <form onSubmit={handleSubmit} className="setting-form" encType="multipart/form-data">
        <input
          type="text"
          placeholder="Website Name"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Footer Description"
          value={footerDesc}
          onChange={(e) => setFooterDesc(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="About Title"
          value={aboutTitle}
          onChange={(e) => setAboutTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="About Description"
          value={aboutDescription}
          onChange={(e) => setAboutDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Title One"
          value={contactTitleOne}
          onChange={(e) => setContactTitleOne(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Title Two"
          value={contactTitleTwo}
          onChange={(e) => setContactTitleTwo(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
        />

        <label>Banner Image</label>
        <input type="file" onChange={(e) => setBannerImg(e.target.files[0])} />

        <label>About Image</label>
        <input type="file" onChange={(e) => setAboutImg(e.target.files[0])} />

        <label>Video</label>
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />

        <div style={{ marginTop: "10px" }}>
          <button className="buton" type="submit">Create</button>
          <button
            className="buton"
            type="button"
            onClick={() => navigate("/admin/setting/SettingIndex")}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSettingForm;
