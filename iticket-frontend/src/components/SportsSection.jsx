"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { buildAssetUrl, fetchProducts, filterProductsByCategory, formatDate, sortProductsByNewest } from "../api/products";
import "./SportsSection.css";

const fallbackSports = [
    { id: 1, title: "FC Barcelona vs Real Madrid", type: "Football • Live", rating: "9.2", date: "2025-09-15", img: "src/assets/images/FC Barcelona vs Real Madrid.jpg" },
    { id: 2, title: "NBA Finals: Lakers vs Celtics", type: "Basketball • Live", rating: "9.5", date: "2025-06-10", img: "src/assets/images/NBA Finals Lakers vs Celtics.jpg" },
    { id: 3, title: "Wimbledon Final", type: "Tennis • Live", rating: "8.9", date: "2025-07-12", img: "src/assets/images/Wimbledon Final.jpg" },
    { id: 4, title: "Super Bowl", type: "American Football • Live", rating: "9.7", date: "2025-02-08", img: "src/assets/images/Super Bowl.jpg" },
];

const toCard = (product) => {
    const type = [product.categoryName, product.subCategoryName].filter(Boolean).join(" • ") || "Sport";
    return {
        id: product.id,
        title: product.name,
        type,
        rating: product.ageRestriction ? `${product.ageRestriction}+` : product.personName || "—",
        date: formatDate(product.startDate) || "Soon",
        img: buildAssetUrl(product.image),
    };
};

const SportsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [sports, setSports] = useState(fallbackSports);
    const containerRef = useRef(null);

    useEffect(() => {
        let active = true;
        fetchProducts()
            .then((list) => {
                if (!active || !list.length) return;
                const filtered = filterProductsByCategory(list, ["sport", "sports", "football", "basketball", "tennis", "training"]);
                const mapped = sortProductsByNewest(filtered)
                    .slice(0, 12)
                    .map(toCard)
                    .filter((c) => c.img);
                if (mapped.length) setSports(mapped);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const visibleCards = 4;
    const maxIndex = Math.max(sports.length - visibleCards, 0);

    const nextSlide = () => {
        if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    return (
        <div className="sports-container">
            <div className="sports-background-overlay" />

            <div className="sports-content">
                <div className="sports-header">
                    <div className="sports-title-section">
                        <h1 className="hover-zoom sports-main-title">
                            SPORTS
                            <span
                                className="sports-explore"
                                onMouseEnter={() => setHoveredCard("explore")}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => window.location.href = "/event/sport"}
                            >
                                &gt; 
                                {hoveredCard === "explore" && (
                                    <span className="sports-explore-tooltip">Explore More</span>
                                )}
                            </span>
                        </h1>
                        <p className="sports-subtitle">
                            Discover the most exciting sports events happening near you
                        </p>
                    </div>

                    <div className="sports-nav-controls">
                        <button onClick={prevSlide} className="sports-nav-btn">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextSlide} className="sports-nav-btn">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="sports-cards-wrapper">
                    <div
                        className="sports-cards-container"
                        ref={containerRef}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                            transition: "transform 0.6s ease-in-out",
                        }}
                    >
                        {sports.map((sport, i) => (
                            <div
                                key={sport.id}
                                className={`sports-card ${hoveredCard === i ? "hovered" : ""}`}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="sports-card-inner">
                                    <div className="sports-card-image-container">
                                        <img src={sport.img} alt={sport.title} className="sports-card-image" />
                                        <div className="sports-card-gradient" />

                                        <div className="sports-card-overlay-content">
                                            <h3 className="sports-card-title">{sport.title}</h3>
                                            <div className="sports-card-meta">
                                                <span>{sport.date}</span> • <span>{sport.type}</span>
                                            </div>
                                        </div>
                                        <div className="sports-card-actions">
                                            <button
                                                className="sports-info-btn"
                                                onClick={() => sport.id && (window.location.href = `/event/sportdetail/${sport.id}`)}
                                            >
                                                <Info size={20} /> Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {hoveredCard === i && <div className="sports-card-glow" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SportsSection;
