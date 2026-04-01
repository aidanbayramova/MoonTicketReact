"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { buildAssetUrl, fetchProducts, filterProductsByCategory } from "../api/products";
import "./ConcertSection.css";

const fallbackConcerts = [
    { id: 1, title: "Billie Eilish", genre: "Pop • Live", rating: "8.9", year: "2024", img: "src/assets/images/c1.jpg" },
    { id: 2, title: "Dua Lipa", genre: "Pop • Live", rating: "9.0", year: "2023", img: "src/assets/images/c2.jpg" },
    { id: 3, title: "Shakira", genre: "Latin • Live", rating: "8.7", year: "2022", img: "src/assets/images/c3.jpg" },
    { id: 4, title: "Dragon", genre: "Rock • Live", rating: "8.8", year: "2024", img: "src/assets/images/c4.jpg" },
];

const toCard = (product) => {
    const genreParts = [product.categoryName, product.subCategoryName].filter(Boolean);
    return {
        id: product.id,
        title: product.name,
        genre: genreParts.length ? genreParts.join(" • ") : "Concert",
        rating: product.ageRestriction ? `${product.ageRestriction}+` : product.personName || "—",
        year: product.startDate ? product.startDate.getFullYear() : "",
        img: buildAssetUrl(product.image),
    };
};

const ConcertSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [concerts, setConcerts] = useState(fallbackConcerts);
    const containerRef = useRef(null);

    useEffect(() => {
        let active = true;
        fetchProducts()
            .then((list) => {
                if (!active || !list.length) return;
                const filtered = filterProductsByCategory(list, ["concert", "music", "live"]);
                const mapped = (filtered.length ? filtered : list)
                    .slice(0, 12)
                    .map(toCard)
                    .filter((c) => c.img);
                if (mapped.length) setConcerts(mapped);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const visibleCards = 4;
    const maxIndex = Math.max(concerts.length - visibleCards, 0);

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
                                                <span>{concert.year || ""}</span> • <span>{concert.genre}</span>
                                            </div>
                                        </div>
                                        <div className="concert-card-actions">
                                            <button
                                                className="concert-info-btn"
                                                onClick={() => concert.id && (window.location.href = `/event/concertdetail/${concert.id}`)}
                                            >
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
