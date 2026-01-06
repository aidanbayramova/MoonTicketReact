import React from "react";
import { Link } from "react-router-dom";
import "./Contact.css";
import ScrollingTicker from "../components/ScrollingTicker"; 
import ContactSection  from "../components/ContactSection"; 

import MapWithBranches from "../components/MapWithBranches"; 



export default function Contact() {
  return (
    <div className="contact-page">
      <section className="contact-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Contact</h1>
            <nav className="breadcrumb-navv">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
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
