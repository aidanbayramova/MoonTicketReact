import React, { useState } from "react";
import { Link } from "react-router-dom";
import ScrollingTicker from "../components/ScrollingTicker";
import tourismClassImg from "../assets/images/italy.jpg";
import "./TourismDetail.css";

const tourismDetail = [
    {
        id: "2",
        title: "The salam",
        desc: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
        duration: "175 min",
        rating: "9.2",
        genre: "Crime, Drama",
        poster: tourismClassImg,
        location: "Cinema Park – Mall 28",
        time: "10:00-20:00",
        price: 12,
        availableDates: ["2025-12-21", "2025-12-22", "2025-12-24"] // Seçilə biləcək tarixlər
    },
];

const relatedtourisms = [
    { id: "3", title: "Scarface", poster: tourismClassImg },
    { id: "4", title: "Goodfellas", poster: tourismClassImg },
];

function TourismDetail() {
    const tourism = tourismDetail[0];

    const [ticketCount, setTicketCount] = useState(1);
    const [selectedDate, setSelectedDate] = useState(tourism.availableDates[0]);

    const calculateTotal = () => tourism.price * ticketCount;

    return (
        <div className="tourism-detail-page">
            <section className="tourism-banner">
                <div className="banner-overlay"></div>
                <div className="container">
                    <div className="banner-content">
                        <h1 className="banner-title">{tourism.title}</h1>
                        <nav className="breadcrumb-navv" style={{ marginLeft: "-2pc" }}>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active">{tourism.title}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <ScrollingTicker />

            {/* Main Content */}
            <div className="tourism-content-wrapper">
                <div className="tourism-main-content">
                    <img className="tourism-poster" src={tourism.poster} alt={tourism.title} />

                    <div className="tourism-info-section">
                        {/* Header Tags */}
                        <div className="tourism-header-tags">
                            <span className="tourism-tag tourism-genre">{tourism.genre}</span>
                            <span className="tourism-tag tourism-rating">⭐ {tourism.rating}</span>
                            <span className="tourism-tag tourism-duration">🕐 {tourism.duration}</span>
                        </div>

                        <p className="tourism-description">{tourism.desc}</p>

                        {/* Info Cards */}
                        <div className="tourism-info-cards">
                            <div className="tourism-info-card">
                                <div className="tourism-info-content">
                                    <span className="tourism-info-label">Venue</span>
                                    <span className="tourism-info-value">{tourism.location}</span>
                                </div>
                            </div>

                            <div className="tourism-info-card">
                                <div className="tourism-info-content">
                                    <span className="tourism-info-label">Select Date</span>
                                    <div className="tourism-options">
                                        {tourism.availableDates.map((date) => (
                                            <button
                                                key={date}
                                                className={`tourism-option-btn ${selectedDate === date ? "tourism-active" : ""}`}
                                                onClick={() => setSelectedDate(date)}
                                            >
                                                {new Date(date).toLocaleDateString("en-US", {
                                                    day: "2-digit",
                                                    month: "short"
                                                })}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div className="tourism-info-card tourism-price-card">
                                <div className="tourism-info-content">
                                    <span className="tourism-info-label">Ticket Price</span>
                                    <span className="tourism-info-value tourism-price-display">
                                        ${tourism.price}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Selection */}
                        <div className="tourism-ticket-section">
                            <h3 className="tourism-section-title">Select Number of Tickets</h3>
                            <div className="tourism-ticket-counter">
                                <label>Number of Tickets:</label>
                                <div className="tourism-counter-controls">
                                    <button
                                        className="tourism-counter-btn"
                                        onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                    >
                                        −
                                    </button>
                                    <span className="tourism-counter-value">{ticketCount}</span>
                                    <button
                                        className="tourism-counter-btn"
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
                <div className="tourism-related-section">
                    <h3 className="tourism-section-title">Related tourisms</h3>
                    <div className="tourism-related-grid">
                        {relatedtourisms.map((rm) => (
                            <div key={rm.id} className="tourism-related-card">
                                <img src={rm.poster} alt={rm.title} />
                                <p>{rm.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="tourism-bottom-bar">
                <div className="tourism-booking-info">
                    <span className="tourism-booking-details">
                        {new Date(selectedDate).toLocaleDateString("en-US")} • {tourism.time}
                    </span>
                    <span className="tourism-ticket-info">
                        {ticketCount} Ticket{ticketCount !== 1 ? "s" : ""}
                    </span>
                </div>
                <div className="tourism-booking-actions">
                    <span className="tourism-total-price">Total: ${calculateTotal()}</span>
                    <button className="tourism-payment-btn">
                        Continue to Payment →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TourismDetail;
