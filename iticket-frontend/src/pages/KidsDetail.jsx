import React, { useState } from "react";
import { Link } from "react-router-dom";
import ScrollingTicker from "../components/ScrollingTicker"; 
import KidsClassImg from "../assets/images/T3.jpg";
import "./KidsDetail.css";

const kidsTheaters = [
  {
    id: "2",
    title: "The salam",
    desc: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
    duration: "175 min",
    rating: "9.2",
    genre: "Crime, Drama",
    poster: KidsClassImg,
    location: "Cinema Park – Mall 28",
    fromDate: "03 Jan 2025",
    time: "16:30",
    language: "English",
    age: "18+",
    price: 12,
  },
];

const relatedTheaters = [
  { id: "3", title: "Scarface", poster: KidsClassImg },
  { id: "4", title: "Goodfellas", poster: KidsClassImg },
];

function KidsTheaterDetail() {
  const theater = kidsTheaters[0]; 
  
  const [ticketCount, setTicketCount] = useState(1);

  const calculateTotal = () => {
    return theater.price * ticketCount;
  };

  return (
    <div className="kids-detail-page">
      <div className="blog-page">
        <section className="blog-banner">
          <div className="banner-overlay"></div>
          <div className="container">
            <div className="banner-content">
              <h1 className="banner-title">{theater.title}</h1>
              <nav className="breadcrumb-nav">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Kids</Link>
                  </li>
                  <li className="breadcrumb-item active">{theater.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
        <ScrollingTicker />
      </div>

      {/* Main Content */}
      <div className="kids-content-wrapper">
        <div className="kids-main-content">
          <img className="kids-poster" src={theater.poster} alt={theater.title} />

          <div className="kids-info-section">
            {/* Header Tags */}
            <div className="kids-header-tags">
              <span className="kids-tag kids-genre">{theater.genre}</span>
              <span className="kids-tag kids-rating">⭐ {theater.rating}</span>
              <span className="kids-tag kids-duration">🕐 {theater.duration}</span>
            </div>

            <p className="kids-description">{theater.desc}</p>

            {/* Info Cards */}
            <div className="kids-info-cards">
              <div className="kids-info-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Venue</span>
                  <span className="kids-info-value">{theater.location}</span>
                </div>
              </div>

              <div className="kids-info-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Date & Time</span>
                  <span className="kids-info-value">{theater.fromDate} • {theater.time}</span>
                </div>
              </div>

              <div className="kids-info-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Language</span>
                  <span className="kids-info-value">{theater.language}</span>
                </div>
              </div>

              <div className="kids-info-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Age Restriction</span>
                  <span className="kids-info-value">{theater.age}</span>
                </div>
              </div>

              <div className="kids-info-card kids-price-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Ticket Price</span>
                  <span className="kids-info-value kids-price-display">${theater.price}</span>
                </div>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="kids-ticket-section">
              <h3 className="kids-section-title">Select Number of Tickets</h3>
              <div className="kids-ticket-counter">
                <label>Number of Tickets:</label>
                <div className="kids-counter-controls">
                  <button 
                    className="kids-counter-btn"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  >
                    −
                  </button>
                  <span className="kids-counter-value">{ticketCount}</span>
                  <button 
                    className="kids-counter-btn"
                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Section */}
        <div className="kids-related-section">
          <h3 className="kids-section-title">Related Theaters</h3>
          <div className="kids-related-grid">
            {relatedTheaters.map((rm) => (
              <div key={rm.id} className="kids-related-card">
                <img src={rm.poster} alt={rm.title} />
                <p>{rm.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="kids-bottom-bar">
        <div className="kids-booking-info">
          <span className="kids-booking-details">
            {theater.fromDate} • {theater.time} • {theater.language}
          </span>
          <span className="kids-ticket-info">
            {ticketCount} Ticket{ticketCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="kids-booking-actions">
          <span className="kids-total-price">Total: ${calculateTotal()}</span>
          <button className="kids-payment-btn">
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}

export default KidsTheaterDetail;
