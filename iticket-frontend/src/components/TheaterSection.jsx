"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import "./TheaterSection.css";

const TheaterSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const containerRef = useRef(null);

    const shows = [
        { 
            id: 1, 
            title: "Uncle Vanya", 
            genre: "Drama • Classic", 
            rating: "8.7", 
            year: "2021", 
            img: "src/assets/images/Uncle Vanya.jpg" 
        },
        { 
            id: 2, 
            title: "The Crucible", 
            genre: "Drama • Historical", 
            rating: "9.0", 
            year: "2022", 
            img: "src/assets/images/The Crucible.jpg" 
        },
        { 
            id: 3, 
            title: "Romeo and Juliet", 
            genre: "Tragedy • Romance", 
            rating: "9.2", 
            year: "2020", 
            img: "src/assets/images/romeoandjuliet.jpg" 
        },
        { 
            id: 4, 
            title: "Les Misérables", 
            genre: "Musical • Drama", 
            rating: "9.5", 
            year: "2019", 
            img: "src/assets/images/Les Misérables.jpg" 
        },
        { 
            id: 5, 
            title: "Uncle Vanya (Revival)", 
            genre: "Drama • Classic", 
            rating: "8.8", 
            year: "2023", 
            img: "src/assets/images/Uncle Vanya.jpg" 
        },
        { 
            id: 6, 
            title: "Hamilton", 
            genre: "Musical • History", 
            rating: "9.6", 
            year: "2023", 
            img: "src/assets/images/Hamilton.jpg" 
        },
    ];
    

    const visibleCards = 4;
    const maxIndex = shows.length - visibleCards;

    const nextSlide = () => {
        if (currentIndex < maxIndex) setCurrentIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    return (
        <div className="theater-container">
            <div className="theater-background-overlay" />

            <div className="theater-content">
                <div className="theater-header">
                    <div className="theater-title-section">
                        <h1 className="hover-zoom theater-main-title">
                            THEATER
                            <span
                                className="theater-explore"
                                style={{ marginLeft: "1pc" }}
                                onMouseEnter={() => setHoveredCard("explore")}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => window.location.href = "/event/theater"}
                            >
                                &gt; 
                                {hoveredCard === "explore" && (
                                    <span className="theater-explore-tooltip">Explore More</span>
                                )}
                            </span>
                        </h1>
                        <p className="theater-subtitle">
                            Discover the most amazing theater shows around the world
                        </p>
                    </div>

                    <div className="theater-nav-controls">
                        <button onClick={prevSlide} className="theater-nav-btn">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextSlide} className="theater-nav-btn">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="theater-cards-wrapper">
                    <div
                        className="theater-cards-container"
                        ref={containerRef}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                            transition: "transform 0.6s ease-in-out",
                        }}
                    >
                        {shows.map((show, i) => (
                            <div
                                key={show.id}
                                className={`theater-card ${hoveredCard === i ? "hovered" : ""}`}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="theater-card-inner">
                                    <div className="theater-card-image-container">
                                        <img src={show.img} alt={show.title} className="theater-card-image" />
                                        <div className="theater-card-gradient" />

                                        <div className="theater-card-overlay-content">
                                            <h3 className="theater-card-title">{show.title}</h3>
                                            <div className="theater-card-meta">
                                                <span>{show.year}</span> • <span>{show.genre}</span>
                                            </div>
                                        </div>
                                        <div className="theater-card-actions">
                                            <button className="theater-info-btn">
                                                <Info size={20} /> Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {hoveredCard === i && <div className="theater-card-glow" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheaterSection;
