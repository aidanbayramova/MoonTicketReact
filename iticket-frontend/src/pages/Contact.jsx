import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Contact.css";
import ScrollingTicker from "../components/ScrollingTicker"; 
import ContactSection from "../components/ContactSection"; 
import MapWithBranches from "../components/MapWithBranches"; 

export default function Contact() {
  const [bannerImg, setBannerImg] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7204/api/SettingGetAll")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBannerImg(data[0].bannerImg);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="contact-page">
      {/* Banner */}
      <section
        className="contact-banner"
        style={{
          background: bannerImg
            ? `url('${bannerImg}') center center / cover no-repeat`
            : "url('../assets/images/hello.jpg') center center / cover no-repeat"
        }}
      >
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Contact</h1>
            <nav className="breadcrumb-navv">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Contact</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker/>
      <ContactSection/>
      <MapWithBranches/>
    </div>
  );
}
