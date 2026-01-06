import React, { useState } from "react";
import { Link } from "react-router-dom";
import ScrollingTicker from "../components/ScrollingTicker";
import museumClassImg from "../assets/images/T3.jpg";
import "./MuseumDetail.css";

const museumDetail = [
    {
        id: "2",
        title: "The salam",
        desc: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
        duration: "175 min",
        rating: "9.2",
        genre: "Crime, Drama",
        poster: museumClassImg,
        location: "Cinema Park – Mall 28",
        fromDate: "03 Jan 2025",
        time: "10:00-20:00",
        language: "English",
        price: 12,
    },
];

const relatedMuseums = [
    { id: "3", title: "Scarface", poster: museumClassImg },
    { id: "4", title: "Goodfellas", poster: museumClassImg },
];

function MuseumDetail() {
    const museum = museumDetail[0];

    const [ticketCount, setTicketCount] = useState(1);

    const calculateTotal = () => {
        return museum.price * ticketCount;
    };

    return (
        <div className="museum-detail-page">
            <section className="museum-banner">
                <div className="banner-overlay"></div>
                <div className="container">
                    <div className="banner-content">
                        <h1 className="banner-title">{museum.title}</h1>
                        <nav className="breadcrumb-navv" style={{ marginLeft: "-2pc" }}>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active">{museum.title}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <ScrollingTicker />

            {/* Main Content */}
            <div className="museum-content-wrapper">
                <div className="museum-main-content">
                    <img className="museum-poster" src={museum.poster} alt={museum.title} />

                    <div className="museum-info-section">
                        {/* Header Tags */}
                        <div className="museum-header-tags">
                            <span className="museum-tag museum-genre">{museum.genre}</span>
                            <span className="museum-tag museum-rating">⭐ {museum.rating}</span>
                            <span className="museum-tag museum-duration">🕐 {museum.duration}</span>
                        </div>

                        <p className="museum-description">{museum.desc}</p>

                        {/* Info Cards */}
                        <div className="museum-info-cards">
                            <div className="museum-info-card">
                                <div className="museum-info-content">
                                    <span className="museum-info-label">Venue</span>
                                    <span className="museum-info-value">{museum.location}</span>
                                </div>
                            </div>

                            <div className="museum-info-card">
                                <div className="museum-info-content">
                                    <span className="museum-info-label">Date & Time</span>
                                    <span className="museum-info-value">
                                        Mon – Sat 
                                        <br />• {museum.time}
                                        <br />
                                        <small className="museum-note">
                                            Closed on Sundays and public holidays
                                        </small>
                                    </span>
                                </div>
                            </div>

                            <div className="museum-info-card museum-price-card">
                                <div className="museum-info-content">
                                    <span className="museum-info-label">Ticket Price</span>
                                    <span className="museum-info-value museum-price-display">
                                        ${museum.price}
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* Ticket Selection */}
                        <div className="museum-ticket-section">
                            <h3 className="museum-section-title">Select Number of Tickets</h3>
                            <div className="museum-ticket-counter">
                                <label>Number of Tickets:</label>
                                <div className="museum-counter-controls">
                                    <button
                                        className="museum-counter-btn"
                                        onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                    >
                                        −
                                    </button>
                                    <span className="museum-counter-value">{ticketCount}</span>
                                    <button
                                        className="museum-counter-btn"
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
                <div className="museum-related-section">
                    <h3 className="museum-section-title">Related museums</h3>
                    <div className="museum-related-grid">
                        {relatedMuseums.map((rm) => (
                            <div key={rm.id} className="museum-related-card">
                                <img src={rm.poster} alt={rm.title} />
                                <p>{rm.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="museum-bottom-bar">
                <div className="museum-booking-info">
                    <span className="museum-booking-details">
                        {museum.fromDate} • {museum.time} • {museum.language}
                    </span>
                    <span className="museum-ticket-info">
                        {ticketCount} Ticket{ticketCount !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="museum-booking-actions">
                    <span className="museum-total-price">Total: ${calculateTotal()}</span>
                    <button className="museum-payment-btn">
                        Continue to Payment →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MuseumDetail;
