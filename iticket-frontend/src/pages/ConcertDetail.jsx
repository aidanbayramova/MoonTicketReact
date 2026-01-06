import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ScrollingTicker from "../components/ScrollingTicker";
import Lipa from "../assets/images/c3.jpg";
import "./ConcertDetail.css";

const concerts = [
  {
    id: "1",
    title: "Shakira Live in Concert",
    artist: "Shakira",
    desc: "Experience an unforgettable evening of smooth jazz featuring world-class musicians performing timeless classics and modern compositions.",
    duration: "3 hours",
    rating: "4.8",
    genre: "Pop, Latin Pop, Live Music",
    image: Lipa,
    location: "Paris Concert Hall",
    date: "15 Jan 2025",
    time: "20:00",
    language: "English",
    age: "16+",
  },
];

const relatedConcerts = [
  {
    id: "2",
    title: "Classical Symphony",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400",
  },
  {
    id: "3",
    title: "Rock Festival",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400",
  },
];

// Concert venue layout - standing zones in front, seated sections behind
const venueLayout = [
  { section: 'VIP', rows: 2, seatsPerRow: 8, type: 'vip', isStanding: false },
  { section: 'A', capacity: 50, type: 'standing', isStanding: true },
  { section: 'B', capacity: 50, type: 'standing', isStanding: true },
  { section: 'C', rows: 4, seatsPerRow: 12, type: 'seated', isStanding: false },
  { section: 'D', rows: 5, seatsPerRow: 14, type: 'seated', isStanding: false },
  { section: 'E', rows: 6, seatsPerRow: 16, type: 'seated', isStanding: false },
];

function Concert() {
  const { id } = useParams();
  const concert = concerts.find((c) => c.id === id);

  // Occupied sections/seats
  const occupiedStanding = {
    'A': 23,
    'B': 31
  };

  const occupiedSeats = [
    "VIP-1-2", "VIP-1-5", "VIP-2-3",
    "C-1-4", "C-2-7", "C-3-10",
    "D-1-3", "D-2-8", "D-4-12",
    "E-2-5", "E-3-9", "E-5-14"
  ];

  const [selectedTickets, setSelectedTickets] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const updateStandingTickets = (section, count) => {
    const sectionData = venueLayout.find(s => s.section === section);
    const occupied = occupiedStanding[section] || 0;
    const available = sectionData.capacity - occupied;
    
    const newCount = Math.max(0, Math.min(count, available));
    
    setSelectedTickets(prev => ({
      ...prev,
      [section]: newCount
    }));
  };

  const getSectionPrice = (section) => {
    const sectionData = venueLayout.find(s => s.section === section);
    if (!sectionData) return 0;

    if (sectionData.type === 'vip') return 80;
    if (sectionData.type === 'standing') return 25;
    return 40;
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Standing tickets
    Object.entries(selectedTickets).forEach(([section, count]) => {
      total += getSectionPrice(section) * count;
    });
    
    // Seated tickets
    selectedSeats.forEach(seatId => {
      const section = seatId.split('-')[0];
      total += getSectionPrice(section);
    });
    
    return total;
  };

  const getTotalTickets = () => {
    const standingCount = Object.values(selectedTickets).reduce((a, b) => a + b, 0);
    return standingCount + selectedSeats.length;
  };

  if (!concert) {
    return (
      <div className="not-found">
        <h2>Concert not found</h2>
        <Link to="/event/concerts">← Back</Link>
      </div>
    );
  }

  return (
    <div className="concertdetail-page">
      {/* ===== BANNER ===== */}
      <div className="blog-page">
        <section className="blog-banner">
          <div className="banner-overlay"></div>
          <div className="container">
            <div className="banner-content">
              <h1 className="banner-title">{concert.title}</h1>
              <nav className="breadcrumb-nav">
                <ol className="breadcrumb" style={{marginLeft:"10pc"}}>
                  <li className="breadcrumb-item">
                    <Link to="/">Concerts</Link>
                  </li>
                  <li className="breadcrumb-item active">{concert.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
        <ScrollingTicker />
      </div>

      {/* ===== MAIN CARD ===== */}
      <div className="concertdetail-content">
        <img className="poster" src={concert.image} alt={concert.title} />

        <div className="info-box">
          <div className="concertdetail-header">
            <div className="header-tags">
              <span className="genre-tag">{concert.genre}</span>
              <span className="rating-tag">⭐ {concert.rating}</span>
              <span className="duration-tag">🕐 {concert.duration}</span>
            </div>
          </div>

          <h2 className="artist-name">{concert.artist}</h2>
          <p className="concertdetail-desc">{concert.desc}</p>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Venue</span>
                <span className="info-value">{concert.location}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Date & Time</span>
                <span className="info-value">{concert.date} at {concert.time}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Language</span>
                <span className="info-value">{concert.language}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Age Restriction</span>
                <span className="info-value">{concert.age}</span>
              </div>
            </div>

            <div className="info-card price-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Ticket Prices</span>
                <div className="price-options">
                  <span className="price-item standing">Standing $25</span>
                  <span className="price-item seated">Seated $40</span>
                  <span className="price-item vip">VIP $80</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== VENUE SELECTION ===== */}
      <div className="venue-area">
        <h3 className="section-title">Select Your Tickets</h3>
        
        {/* Legend */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-seat available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-seat occupied"></div>
            <span>Occupied</span>
          </div>
        </div>

        <div className="stage">🎤 STAGE</div>

        {/* Standing Zones */}
        <div className="standing-area">
          <h4 className="area-label">Standing Area</h4>
          <div className="standing-grid">
            {venueLayout.filter(s => s.isStanding).map((section) => {
              const occupied = occupiedStanding[section.section] || 0;
              const available = section.capacity - occupied;
              const selected = selectedTickets[section.section] || 0;
              
              return (
                <div key={section.section} className="standing-zone">
                  <div className="zone-header">
                    <h5 className="zone-name">Zone {section.section}</h5>
                    <span className="zone-price">${getSectionPrice(section.section)}</span>
                  </div>
                  <div className="zone-info">
                    <span>Available: {available - selected}/{section.capacity}</span>
                  </div>
                  <div className="ticket-counter">
                    <button 
                      className="counter-btn"
                      onClick={() => updateStandingTickets(section.section, selected - 1)}
                      disabled={selected === 0}
                    >
                      −
                    </button>
                    <span className="counter-value">{selected}</span>
                    <button 
                      className="counter-btn"
                      onClick={() => updateStandingTickets(section.section, selected + 1)}
                      disabled={selected >= available}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seated Sections */}
        <div className="seated-area">
          <h4 className="area-label">Seated Sections</h4>
          
          {venueLayout.filter(s => !s.isStanding).map((section) => (
            <div key={section.section} className="section-block">
              <div className="section-label">
                Section {section.section} - ${getSectionPrice(section.section)}
              </div>
              
              <div className="concertdetail-hall">
                {Array.from({ length: section.rows }, (_, rowIdx) => (
                  <div key={rowIdx} className="seat-row">
                    <div className="row-label">{rowIdx + 1}</div>
                    
                    <div className="seats-container">
                      {Array.from({ length: section.seatsPerRow }, (_, seatIdx) => {
                        const seatId = `${section.section}-${rowIdx + 1}-${seatIdx + 1}`;
                        const isOccupied = occupiedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);
                        
                        return (
                          <div
                            key={seatId}
                            className={`concertdetail-seat ${section.type} 
                              ${isSelected ? "selected" : ""}
                              ${isOccupied ? "occupied" : ""}
                            `}
                            onClick={() => toggleSeat(seatId)}
                            title={`${section.section}-${rowIdx + 1}-${seatIdx + 1}`}
                          >
                            <div className="seat-icon">
                              {isOccupied ? '✕' : seatIdx + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="row-label">{rowIdx + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== RELATED CONCERTS ===== */}
      <div className="related-section">
        <h3 className="section-title">Related Concerts</h3>
        <div className="related-grid">
          {relatedConcerts.map((rc) => (
            <div key={rc.id} className="related-card">
              <img src={rc.image} alt={rc.title} />
              <p>{rc.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="bottom-bar">
        <div className="booking-info">
          <span className="booking-details">
            {concert.date} • {concert.time} • {concert.language}
          </span>
          <span className="seat-info">
            {getTotalTickets()} Ticket{getTotalTickets() !== 1 ? 's' : ''} 
            {getTotalTickets() > 0 && selectedSeats.length > 0 && ` (${selectedSeats.join(', ')})`}
          </span>
        </div>
        <div className="booking-actions">
          <span className="total-price">Total: ${calculateTotal()}</span>
          <button disabled={getTotalTickets() === 0}>
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Concert;