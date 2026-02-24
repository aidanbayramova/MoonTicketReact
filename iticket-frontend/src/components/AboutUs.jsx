import React, { useEffect, useState } from "react";
import "./AboutUs.css";


export default function AboutUs() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7204/api/SettingGetAll")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched About data:", data);
        // data arraydirsə, birinci element götür
        setAboutData(Array.isArray(data) ? data[0] : data);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setAboutData(null);
      })
      .finally(() => setLoading(false));
  }, []);
  

  if (loading) return <p>Loading...</p>;
  if (!aboutData) return <p>No About Us data available</p>;

  return (
    <section className="about-section">
      <div className="about-row">
        <div className="about-image-box">
          <img
            src={aboutData.aboutImg} // Kiçik hərflə
            alt="Haqqımızda"
            className="about-image"
          />
        </div>

        <div className="about-text">
          <h2 className="about-title">{aboutData.aboutTitle}</h2>
          <p className="about-description">{aboutData.aboutDescription}</p>
        </div>
      </div>
    </section>
  );
}
