"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import "./TourismSection.css";

const TourismSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const containerRef = useRef(null);

    const tours = [
        { id: 1, title: "Germany Tour", genre: "History • Culture", rating: "9.1", year: "2024", img: "src/assets/images/germany.jpg" },
        { id: 2, title: "Switzerland ", genre: "Mountain • Ski", rating: "9.5", year: "2023", img: "src/assets/images/isvecre.jpg" },
        { id: 3, title: "Italy Tour", genre: "City • Culture", rating: "9.0", year: "2022", img: "src/assets/images/italy.jpg" },
        { id: 4, title: "London Trip", genre: "City • Modern", rating: "8.8", year: "2024", img: "src/assets/images/london.jpg" },
        { id: 5, title: "Paris Tour", genre: "Romance • Culture", rating: "8.9", year: "2023", img: "src/assets/images/paris.jpg" },
        { id: 6, title: "Spain Adventure", genre: "Beach • Relax", rating: "9.2", year: "2019", img: "src/assets/images/spanish.jpg" },
    ];
    

    const visibleCards = 4;
    const maxIndex = tours.length - visibleCards;

    const nextSlide = () => {
        if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    return (
        <div className="tourism-container">
            <div className="tourism-background-overlay" />

            <div className="tourism-content">
                <div className="tourism-header">
                    <div className="tourism-title-section">
                        <h1 className="tourism-main-title">
                            TOURISM
                            <span
                                className="tourism-explore"
                                style={{ marginLeft: "1pc" }}
                                onMouseEnter={() => setHoveredCard("explore")}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => window.location.href = "/event/Tourism"}
                            >
                                &gt; 
                                {hoveredCard === "explore" && (
                                    <span className="tourism-explore-tooltip">Explore More</span>
                                )}
                            </span>
                        </h1>
                        <p className="tourism-subtitle">
                            Discover the most amazing destinations around the world
                        </p>
                    </div>

                    <div className="tourism-nav-controls">
                        <button onClick={prevSlide} className="tourism-nav-btn">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextSlide} className="tourism-nav-btn">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="tourism-cards-wrapper">
                    <div
                        className="tourism-cards-container"
                        ref={containerRef}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                            transition: "transform 0.6s ease-in-out",
                        }}
                    >
                        {tours.map((tour, i) => (
                            <div
                                key={tour.id}
                                className={`tourism-card ${hoveredCard === i ? "hovered" : ""}`}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="tourism-card-inner">
                                    <div className="tourism-card-image-container">
                                        <img src={tour.img} alt={tour.title} className="tourism-card-image" />
                                        <div className="tourism-card-gradient" />

                                        <div className="tourism-card-overlay-content">
                                            <h3 className="tourism-card-title">{tour.title}</h3>
                                            <div className="tourism-card-meta">
                                                <span>{tour.year}</span> • <span>{tour.genre}</span>
                                            </div>
                                        </div>
                                        <div className="tourism-card-actions">
                                            <button className="tourism-info-btn">
                                                <Info size={20} /> Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {hoveredCard === i && <div className="tourism-card-glow" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourismSection;
