import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollingTicker from "../components/ScrollingTicker"; 
import AboutUs from "../components/AboutUs"; 
import TicketWhySection from "../components/TicketWhySection"; 
import SuccessStory from "../components/SuccessStory"; 
import MapWithBranches from "../components/MapWithBranches"; 

import "./About.css";

export default function About() {
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
    <div className="about-page">
      <section
        className="about-banner"
        style={{
          background: bannerImg
            ? `url('${bannerImg}') center center / cover no-repeat`
            : "url('../assets/images/hello.jpg') center center / cover no-repeat"
        }}
      >
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">About</h1>
            <nav className="breadcrumb-nav">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">About Us</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker/>
      <AboutUs /> 
      <TicketWhySection /> 
      <SuccessStory /> 
      <MapWithBranches /> 
    </div>
  );
}
