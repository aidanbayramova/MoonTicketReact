"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import "./MuseumSection.css";

const MuseumSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const containerRef = useRef(null);

    const museums = [
        { id: 1, title: "Louvre", genre: "Art • Paris", rating: "9.5", year: "1793", img: "src/assets/images/Louvre.jpg" },
        { id: 2, title: "British Museum", genre: "History • London", rating: "9.2", year: "1753", img: "src/assets/images/British Museum.jpg" },
        { id: 3, title: "Prado", genre: "Art • Madrid", rating: "9.0", year: "1819", img: "src/assets/images/Prado.jpg" },
        { id: 4, title: "Metropolitan", genre: "Art • New York", rating: "9.3", year: "1870", img: "src/assets/images/Metropolitan.jpg" },
        { id: 5, title: "Vatican Museums", genre: "Religion • Rome", rating: "9.4", year: "1506", img: "src/assets/images/Vatican Museums.jpg" },
        { id: 6, title: "Hermitage", genre: "Art • St. Petersburg", rating: "9.1", year: "1764", img: "src/assets/images/Hermitage.jpg" },
    ];

    const visibleCards = 4;
    const maxIndex = museums.length - visibleCards;

    const nextSlide = () => {
        if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    return (
        <div className="museum-container">
            <div className="museum-background-overlay" />

            <div className="museum-content">
                <div className="museum-header">
                    <div className="museum-title-section">
                        <h1 className="hover-zoom museum-main-title">
                            MUSEUMS
                            <span
                                className="museum-explore"
                                style={{ marginLeft: "1pc" }}
                                onMouseEnter={() => setHoveredCard("explore")}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => window.location.href = "/event/museum"}
                            >
                                &gt;
                                {hoveredCard === "explore" && (
                                    <span className="museum-explore-tooltip">Explore More</span>
                                )}
                            </span>
                        </h1>
                        <p className="museum-subtitle">
                            Discover the most famous museums around the world
                        </p>
                    </div>

                    <div className="museum-nav-controls">
                        <button onClick={prevSlide} className="museum-nav-btn">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextSlide} className="museum-nav-btn">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="museum-cards-wrapper">
                    <div
                        className="museum-cards-container"
                        ref={containerRef}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                            transition: "transform 0.6s ease-in-out",
                        }}
                    >
                        {museums.map((museum, i) => (
                            <div
                                key={museum.id}
                                className={`museum-card ${hoveredCard === i ? "hovered" : ""}`}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="museum-card-inner">
                                    <div className="museum-card-image-container">
                                        <img src={museum.img} alt={museum.title} className="museum-card-image" />
                                        <div className="museum-card-gradient" />

                                        <div className="museum-card-overlay-content">
                                            <h3 className="museum-card-title">{museum.title}</h3>
                                            <div className="museum-card-meta">
                                                <span>{museum.year}</span> • <span>{museum.genre}</span>
                                            </div>
                                        </div>
                                        <div className="museum-card-actions">
                                            <button className="museum-info-btn">
                                                <Info size={20} /> Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {hoveredCard === i && <div className="museum-card-glow" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MuseumSection;
