import React from "react";
import "./ContactSection.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-grid">

        <div className="contact-left">
          <h2>Get in touch with us</h2>
          <p>
            Whether you have questions, need support, or want to discuss a coffee shop,
            feel free to reach out.
          </p>

          <div className="info-card">
            <FontAwesomeIcon icon={faPhone} className="info-icon" />
            <div className="info-text">
              <h3>Phone Number</h3>
              <p>+91 123 456 789</p>
            </div>
          </div>

          <div className="info-card">
            <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
            <div className="info-text">
              <h3>Email Address</h3>
              <p>info@caffeluna.com</p>
            </div>
          </div>

      
        </div>

        <div className="contact-right">
          <h3>Send a Message</h3>
          <p>
            Unlock your potential with expert guidance! Schedule a free consultation
            toward personal and business success.
          </p>

          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>
            <div className="form-row">
              <input type="email" placeholder="E-mail Address" required />
              <input type="text" placeholder="Phone Number" required />
            </div>
            <textarea placeholder="Message" rows="5"></textarea>
            <button type="submit" className="btn-submit">Submit Message</button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
