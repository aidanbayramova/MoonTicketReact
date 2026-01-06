import React from "react";
import { Link } from "react-router-dom";
import ScrollingTicker from "../components/ScrollingTicker"; 
import AboutUs from "../components/AboutUs"; 
import TicketWhySection from "../components/TicketWhySection"; 
import SuccessStory from "../components/SuccessStory"; 
import MapWithBranches from "../components/MapWithBranches"; 




import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <section className="about-banner">
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
