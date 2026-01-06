"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import "./ConcertSection.css";

const ConcertSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const containerRef = useRef(null);

    const concerts = [
        { id: 1, title: "Billie Eilish", genre: "Pop • Live", rating: "8.9", year: "2024", img: "src/assets/images/c1.jpg" },
        { id: 2, title: "Dua Lipa", genre: "Pop • Live", rating: "9.0", year: "2023", img: "src/assets/images/c2.jpg" },
        { id: 3, title: "Shakira", genre: "Latin • Live", rating: "8.7", year: "2022", img: "src/assets/images/c3.jpg" },
        { id: 4, title: "Dragon", genre: "Rock • Live", rating: "8.8", year: "2024", img: "src/assets/images/c4.jpg" },
        { id: 5, title: "Inna", genre: "Dance • Live", rating: "8.5", year: "2023", img: "src/assets/images/c5.jpg" },
        { id: 6, title: "Lana Del Rey", genre: "Alternative • Live", rating: "8.6", year: "2019", img: "src/assets/images/c6.jpg" },
        { id: 7, title: "Billie Eilish", genre: "Pop • Live", rating: "8.9", year: "2024", img: "src/assets/images/c2.jpg" },
        { id: 8, title: "Dua Lipa", genre: "Pop • Live", rating: "9.0", year: "2023", img: "src/assets/images/c5.jpg" },
        { id: 9, title: "Shakira", genre: "Latin • Live", rating: "8.7", year: "2022", img: "src/assets/images/c3.jpg" },
        { id: 10, title: "Dragon", genre: "Rock • Live", rating: "8.8", year: "2024", img: "src/assets/images/c1.jpg" },
        { id: 11, title: "Inna", genre: "Dance • Live", rating: "8.5", year: "2023", img: "src/assets/images/c6.jpg" },
        { id: 12, title: "Lana Del Rey", genre: "Alternative • Live", rating: "8.6", year: "2019", img: "src/assets/images/c4.jpg" },
    ];
    
    

    const visibleCards = 4;
    const maxIndex = concerts.length - visibleCards;

    const nextSlide = () => {
        if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    return (
        <div className="concert-container">
            <div className="concert-background-overlay" />

            <div className="concert-conttent">
                <div className="concert-header">
                    <div className="concert-title-section">
                        <h1 className="hover-zoom concert-main-title">
                            CONCERTS
                            <span
                                className="concert-explore"style={{
                                    marginLeft: "1pc"
                                }}
                                onMouseEnter={() => setHoveredCard("explore")}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => window.location.href = "/event/concert"}
                            >
                                &gt; 
                                {hoveredCard === "explore" && (
                                    <span className="concert-explore-tooltip">Explore More</span>
                                )}
                            </span>
                        </h1>
                        <p className="concert-subtitle">
                            Discover the most exciting concerts happening near you
                        </p>
                    </div>


                    <div className="concert-nav-controls">
                        <button onClick={prevSlide} className="concert-nav-btn">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextSlide} className="concert-nav-btn">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="concert-cards-wrapper">
                    <div
                        className="concert-cards-container"
                        ref={containerRef}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                            transition: "transform 0.6s ease-in-out",
                        }}
                    >
                        {concerts.map((concert, i) => (
                            <div
                                key={concert.id}
                                className={`concert-card ${hoveredCard === i ? "hovered" : ""}`}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="concert-card-inner">
                                    <div className="concert-card-image-container">
                                        <img src={concert.img} alt={concert.title} className="concert-card-image" />
                                        <div className="concert-card-gradient" />


                                        <div className="concert-card-overlay-content">
                                            <h3 className="concert-card-title">{concert.title}</h3>
                                            <div className="concert-card-meta">
                                                <span>{concert.year}</span> • <span>{concert.genre}</span>
                                            </div>
                                        </div>
                                        <div className="concert-card-actions">
                                            <button className="concert-info-btn">
                                                <Info size={20} /> Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {hoveredCard === i && <div className="concert-card-glow" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConcertSection;
