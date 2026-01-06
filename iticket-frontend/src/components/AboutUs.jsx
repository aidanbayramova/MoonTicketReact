import React from "react";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <section className="about-section">
      <div className="about-row">
        <div className="about-image-box">
          <img
            src="src/assets/images/salama.jpg"
            alt="Haqqımızda"
            className="about-image"
          />
        </div>

        <div className="about-text">
          <h2 className="about-title">Your Gateway to Europe’s Best Events</h2>
          <p className="about-description">
          MoonTicket is a modern ticketing platform with a mission to host the most remarkable and exciting events all across Europe. Our goal is not only to provide ticket sales but also to connect people with the magical world of music, art, sports, and culture. With MoonTicket, users can enjoy fast reservations, secure payments, and a mobile-friendly interface that ensures easy access to every event. We believe that every event creates a memory, and every memory is a lasting treasure. MoonTicket is more than a ticket – it’s the gateway to unforgettable experiences across Europe.
          </p>
        
        </div>
      </div>
    </section>
  );
}
