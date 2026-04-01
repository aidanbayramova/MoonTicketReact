"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { buildAssetUrl, fetchProducts } from "../api/products";
import "./TrendingSection.css";

const fallbackMovies = [
  { id: 1, title: "Minions", genre: "Animation • Comedy", rating: "8.4", year: "2024", img: "src/assets/images/minion.jpg" },
  { id: 2, title: "Shark Tale", genre: "Animation • Adventure", rating: "8.1", year: "2022", img: "src/assets/images/shark.jpg" },
  { id: 3, title: "Christian Movie 1", genre: "Drama • Family", rating: "8.7", year: "2021", img: "src/assets/images/christian.jpg" },
  { id: 4, title: "Baby Boss", genre: "Animation • Comedy", rating: "7.9", year: "2024", img: "src/assets/images/baby.jpg" },
  { id: 5, title: "Salam Story", genre: "Drama • Mystery", rating: "8.2", year: "2023", img: "src/assets/images/salam.jpg" },
];

const toCard = (product) => {
  const genreParts = [product.categoryName, product.subCategoryName].filter(Boolean);
  return {
    id: product.id,
    title: product.name,
    genre: genreParts.length ? genreParts.join(" • ") : "Event",
    rating: product.ageRestriction ? `${product.ageRestriction}+` : product.personName || "—",
    year: product.startDate ? product.startDate.getFullYear() : "",
    img: buildAssetUrl(product.image),
  };
};

const TrendingSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [cards, setCards] = useState(fallbackMovies);
  const containerRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => {
        if (!active || !list.length) return;
        const mapped = list
          .sort((a, b) => (b.startDate || 0) - (a.startDate || 0))
          .slice(0, 10)
          .map(toCard)
          .filter((c) => c.img);
        if (mapped.length) setCards(mapped);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const visibleCards = 4;
  const slides = [...cards, ...cards];
  const totalCards = cards.length || slides.length || 1;

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1); 
    setIsTransitioning(true);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1); 
    setIsTransitioning(true);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= totalCards) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev - totalCards);
    } else if (currentIndex < 0) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev + totalCards);
    } else {
      setIsTransitioning(true);
    }
  };

  return (
    <div className="trending-container">
      <div className="trending-background-overlay" />
      <div className="trending-content">
        <div className="trending-header">
          <div className="trending-title-section">
            <h1 className="trending-main-title">TRENDING NOW</h1>
            <p className="trending-subtitle">
              Discover the most exclusive content curated just for you
            </p>
          </div>
          <div className="trending-nav-controls">
            <button onClick={prevSlide} className="trending-nav-btn">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="trending-nav-btn">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="trending-cards-wrapper">
          <div
            className="trending-cards-container"
            ref={containerRef}
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              transition: isTransitioning ? "transform 0.6s ease-in-out" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((movie, i) => (
              <div
                key={`${movie.id}-${i}`}
                className={`trending-card ${hoveredCard === i ? "hovered" : ""}`}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="trending-card-inner">
                  <div className="trending-card-image-container">
                    <img src={movie.img} alt={movie.title} className="trending-card-image" />
                    <div className="trending-card-gradient" />
                    <div className="trending-card-rank">
                      <span className="trending-rank-number">{(i % totalCards) + 1}</span>
                      <span className="trending-rank-shadow">{(i % totalCards) + 1}</span>
                    </div>
                    <div className="trending-card-rating">
                      <span>★ {movie.rating}</span>
                    </div>
                    <div className="trending-card-overlay-content">
                      <h3 className="trending-card-title">{movie.title}</h3>
                      <div className="trending-card-meta">
                        <span>{movie.year}</span> • <span>{movie.genre}</span>
                      </div>
                    </div>
                    <div className="trending-card-actions">
                      <button className="trending-info-btn">
                        <Info size={20} /> Info
                      </button>
                    </div>
                  </div>
                </div>
                {hoveredCard === i && <div className="trending-card-glow" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
