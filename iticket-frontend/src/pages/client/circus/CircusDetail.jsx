import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { buildAssetUrl, fetchProductById, formatDate } from "../../../api/products";
import { useBasket } from "../../../context/BasketContext";

import ScrollingTicker from "../../../components/ScrollingTicker"; 


import "./CircusDetail.css";
const shows = [
    {
      id: "1",
      title: "Grand Royal Circus",
      teams: "Acrobats • Clowns • Fire Show",
      desc:
        "An unforgettable circus experience featuring world-class acrobats, hilarious clowns, breathtaking aerial acts and a spectacular fire performance.",
      duration: "2 Hours",
      rating: "4.9",
      league: "International Circus Show",
      stadium: "Royal Circus Arena",
      date: "25 May 2025",
      time: "20:00",
      language: "No Dialogue",
      age: "5+",
    },
  ];
  

// ===== SECTIONS =====
const circusSections = [
  // VIP
  { id: "vip1", name: "VIP 1", price: 150, seats: 20, type: "vip", angle: 0 },
  { id: "vip2", name: "VIP 2", price: 150, seats: 20, type: "vip", angle: 45 },
  { id: "vip3", name: "VIP 3", price: 150, seats: 20, type: "vip", angle: 90 },
  { id: "vip4", name: "VIP 4", price: 150, seats: 20, type: "vip", angle: 135 },
  { id: "vip5", name: "VIP 5", price: 150, seats: 20, type: "vip", angle: 180 },
  { id: "vip6", name: "VIP 6", price: 150, seats: 20, type: "vip", angle: 225 },
  { id: "vip7", name: "VIP 7", price: 150, seats: 20, type: "vip", angle: 270 },
  { id: "vip8", name: "VIP 8", price: 150, seats: 20, type: "vip", angle: 315 },

  // PREMIUM
  { id: "prem1", name: "Premium 1", price: 100, seats: 30, type: "premium", angle: 22 },
  { id: "prem2", name: "Premium 2", price: 100, seats: 30, type: "premium", angle: 67 },
  { id: "prem3", name: "Premium 3", price: 100, seats: 30, type: "premium", angle: 112 },
  { id: "prem4", name: "Premium 4", price: 100, seats: 30, type: "premium", angle: 157 },
  { id: "prem5", name: "Premium 5", price: 100, seats: 30, type: "premium", angle: 202 },
  { id: "prem6", name: "Premium 6", price: 100, seats: 30, type: "premium", angle: 247 },
  { id: "prem7", name: "Premium 7", price: 100, seats: 30, type: "premium", angle: 292 },
  { id: "prem8", name: "Premium 8", price: 100, seats: 30, type: "premium", angle: 337 },

  // STANDARD
  { id: "std1", name: "Sector A", price: 50, seats: 40, type: "standard", angle: 11 },
  { id: "std2", name: "Sector B", price: 50, seats: 40, type: "standard", angle: 33 },
  { id: "std3", name: "Sector C", price: 50, seats: 40, type: "standard", angle: 56 },
  { id: "std4", name: "Sector D", price: 50, seats: 40, type: "standard", angle: 78 },
  { id: "std5", name: "Sector E", price: 50, seats: 40, type: "standard", angle: 101 },
  { id: "std6", name: "Sector F", price: 50, seats: 40, type: "standard", angle: 123 },
  { id: "std7", name: "Sector G", price: 50, seats: 40, type: "standard", angle: 146 },
  { id: "std8", name: "Sector H", price: 50, seats: 40, type: "standard", angle: 168 },
  { id: "std9", name: "Sector I", price: 50, seats: 40, type: "standard", angle: 191 },
  { id: "std10", name: "Sector J", price: 50, seats: 40, type: "standard", angle: 213 },
  { id: "std11", name: "Sector K", price: 50, seats: 40, type: "standard", angle: 236 },
  { id: "std12", name: "Sector L", price: 50, seats: 40, type: "standard", angle: 258 },
  { id: "std13", name: "Sector M", price: 50, seats: 40, type: "standard", angle: 281 },
  { id: "std14", name: "Sector N", price: 50, seats: 40, type: "standard", angle: 303 },
  { id: "std15", name: "Sector O", price: 50, seats: 40, type: "standard", angle: 326 },
  { id: "std16", name: "Sector P", price: 50, seats: 40, type: "standard", angle: 348 },
];

const occupiedSeats = ["vip1-5", "vip2-3", "prem1-12", "std1-25", "std3-8"];

function CircusDetail() {
  const { id } = useParams();
  const { addToBasket, buyNow, getOccupiedSeats } = useBasket();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    
    (async () => {
      try {
        const data = await fetchProductById(id);
        if (!active) return;
        setProduct(data);
        
        // Fetch similar products from same category
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";
        const res = await fetch(`${API_BASE}/api/ProductGetAll`);
        if (res.ok) {
          const all = await res.json();
          const similar = all
            .filter(p => p.categoryName === data.categoryName && p.id !== data.id)
            .slice(0, 2)
            .map(p => ({
              id: p.id,
              title: p.name || "Unknown",
              image: buildAssetUrl(p.image) || ""
            }));
          setSimilarProducts(similar);
        }
      } catch (err) {
        console.log("Error loading similar products:", err);
      } finally {
        active && setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const show = product
    ? {
        ...shows[0],
        id: product.id,
        title: product.name || shows[0].title,
        teams: product.personName || shows[0].teams,
        desc: product.description || shows[0].desc,
        league: [product.categoryName, product.subCategoryName].filter(Boolean).join(", ") || shows[0].league,
        stadium: product.address || shows[0].stadium,
        date: formatDate(product.startDate) || shows[0].date,
        time: product.startTime || shows[0].time,
        age: product.ageRestriction ? `${product.ageRestriction}+` : shows[0].age,
        image: buildAssetUrl(product.image) || shows[0].image,
      }
    : shows[0];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  const showKey = `circus-${show.id}-${show.date}-${show.time}`;
  const occupiedFromOrders = getOccupiedSeats(showKey);
  const occupiedSeatSet = new Set([...occupiedSeats, ...occupiedFromOrders]);

  const toggleSeat = (seatId) => {
    if (occupiedSeatSet.has(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((sum, seat) => {
      const sectionId = seat.split("-")[0];
      const section = circusSections.find((s) => s.id === sectionId);
      return sum + (section?.price || 0);
    }, 0);
  };

  const getSectionPosition = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return {
      left: `calc(50% + ${Math.cos(rad) * radius}px)`,
      top: `calc(50% + ${Math.sin(rad) * radius}px)`,
    };
  };

  const buildBasketItem = () => ({
    eventType: "circus",
    productId: show.id,
    title: show.title,
    quantity: selectedSeats.length,
    seats: selectedSeats,
    showKey,
    eventDate: show.date,
    eventTime: show.time,
    language: show.language,
    location: show.stadium,
    total: getTotalPrice(),
  });

  const handleAddToBasket = () => {
    if (!selectedSeats.length) return;
    addToBasket(buildBasketItem());
    setActionMessage("Selection added to basket.");
  };

  const handleBuyNow = async () => {
    if (!selectedSeats.length) return;
    try {
      await buyNow(buildBasketItem());
      setSelectedSeats([]);
      setActionMessage("Tickets purchased successfully.");
    } catch (error) {
      setActionMessage(error.message || "Failed to purchase tickets.");
    }
  };

  if (loading && !product) {
    return <div className="not-found"><h2>Loading...</h2></div>;
  }

  return (
    <div className="circus-page">
      {/* ===== BANNER ===== */}
      <div className="blog-page">
        <section className="blog-banner">
          <div className="banner-overlay" />
          <div className="container">
            <div className="banner-content">
              <h1 className="banner-title">{show.title}</h1>

              <nav className="breadcrumb-nav">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Circus</Link>
                  </li>
                  <li className="breadcrumb-item active">{show.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
        <ScrollingTicker />
      </div>

      {/* ===== MAIN INFO ===== */}
      <div className="circus-content">
        <img className="poster" src={show.image} alt={show.title} />
        <div className="info-box">
          <div className="header-tags">
            <span className="genre-tag">{show.league}</span>
            <span className="rating-tag">⭐ {show.rating}</span>
            <span className="duration-tag">⏱ {show.duration}</span>
          </div>

          <h2 className="artist-name">{show.teams}</h2>
          <p className="concert-desc">{show.desc}</p>

          <div className="info-cards">
            <div className="info-card">
              <span className="info-label">Stadium</span>
              <span className="info-value">{show.stadium}</span>
            </div>
            <div className="info-card">
              <span className="info-label">Date & Time</span>
              <span className="info-value">
                {show.date} • {show.time}
              </span>
            </div>
            <div className="info-card">
              <span className="info-label">Age</span>
              <span className="info-value">{show.age}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SEATING ===== */}
      <div className="circus-wrapper">
  <h3 className="section-title">Choose Your Seats</h3>

  {/* ===== SEAT MODAL ===== */}
  {activeSection && (
    <div className="seat-selection-modal">
      <div className="modal-content">
        <button
          className="close-modal"
          onClick={() => setActiveSection(null)}
        >
          ✕
        </button>

        {(() => {
          const section = circusSections.find(
            (s) => s.id === activeSection
          );

          return (
            <>
              <h3 className="modal-title">
                🎟 {section.name} — ${section.price} per seat
              </h3>

              <div className="seats-grid">
                {Array.from({ length: section.seats }).map((_, i) => {
                  const seatId = `${section.id}-${i + 1}`;
                  const occupied = occupiedSeatSet.has(seatId);
                  const selected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      className={`modal-seat ${
                        occupied ? "occupied" : ""
                      } ${selected ? "selected" : ""}`}
                      onClick={() => toggleSeat(seatId)}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  )}

  {/* ===== LEGEND ===== */}
  <div className="legend">
    <div className="legend-item">
      <span className="legend-color available" /> Available
    </div>
    <div className="legend-item">
      <span className="legend-color selected" /> Selected
    </div>
    <div className="legend-item">
      <span className="legend-color occupied" /> Occupied
    </div>
  </div>

  {/* ===== CIRCUS ARENA ===== */}
  <div className="circus-container">
    <div className="circus-arena">
      <div className="arena-text">🎪 Circus Arena</div>
    </div>

    {circusSections.map((section) => {
      const radius =
        section.type === "vip"
          ? 170
          : section.type === "premium"
          ? 240
          : 310;

      const position = getSectionPosition(section.angle, radius);

      return (
        <div
          key={section.id}
          className={`circus-section ${section.type} ${
            activeSection === section.id ? "active" : ""
          }`}
          style={position}
          onClick={() =>
            setActiveSection(
              activeSection === section.id ? null : section.id
            )
          }
        >
          <div className="section-name">{section.name}</div>
          <div className="section-price">${section.price}</div>
        </div>
      );
    })}
  </div>
</div>


      {/* ===== BOTTOM BAR ===== */}
      <div className="bottom-bar">
        <span className="seat-info">{actionMessage || `${selectedSeats.length} seat(s) selected`}</span>
        <div className="booking-actions">
          <span className="total-price">${getTotalPrice()}</span>
          <button disabled={!selectedSeats.length} onClick={handleAddToBasket}>Add to Basket</button>
          <button disabled={!selectedSeats.length} onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default CircusDetail;