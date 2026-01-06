import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ScrollingTicker from "../components/ScrollingTicker";
import GodfatherPoster from "../assets/images/godfather.jpg";
import "./TheaterDetail.css";


const theaters = [
  {
    id: "2",
    title: "The Godfather",
    desc:
      "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
    duration: "175 min",
    rating: "9.2",
    genre: "Crime, Drama",
    trailer: "https://www.youtube.com/embed/sY1S34973zA",
    poster:
    GodfatherPoster,
    location: "Cinema Park – Mall 28",
    fromDate: "03 Jan 2025",
    toDate: "10 Jan 2025",
    languages: ["English", "Russian", "Turkish"],
    age: "18+",
    price: "$12.00",
  },
];

const relatedTheaters = [
  {
    id: "3",
    title: "Scarface",
    poster:
    GodfatherPoster,
  },
  {
    id: "4",
    title: "Goodfellas",
    poster:
    GodfatherPoster,
  },
];

// Real cinema seating layout
const seatLayout = [
  { row: 'A', seats: 8, type: 'vip' },
  { row: 'B', seats: 10, type: 'vip' },
  { row: 'C', seats: 12, type: 'standard' },
  { row: 'D', seats: 12, type: 'standard' },
  { row: 'E', seats: 14, type: 'standard' },
  { row: 'F', seats: 14, type: 'standard' },
  { row: 'G', seats: 14, type: 'standard' },
  { row: 'H', seats: 12, type: 'standard' },
];

function Theater() {
  const { id } = useParams();
  const theater = theaters.find((m) => m.id === id);

  const days = ["03 Jan", "04 Jan", "05 Jan", "06 Jan", "07 Jan"];
  const times = ["16:30", "18:30", "20:30", "22:30"];

  // Occupied seats (format: "A-3", "B-5")
  const occupiedSeats = [
    "A-2", "A-3", "A-6",
    "B-4", "B-5", "B-8",
    "C-3", "C-7", "C-10",
    "D-2", "D-6", "D-9",
    "E-5", "E-11", "E-13",
    "F-4", "F-8", "F-12",
    "G-6", "G-10",
    "H-3", "H-9"
  ];

  const [selectedDate, setSelectedDate] = useState("07 Jan");
  const [selectedTime, setSelectedTime] = useState("20:30");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedLang, setSelectedLang] = useState("English");
  const [showTrailer, setShowTrailer] = useState(false);

  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const getSeatPrice = (type) => {
    return type === 'vip' ? 15 : 12;
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId.split('-')[0];
      const rowData = seatLayout.find(r => r.row === row);
      return total + getSeatPrice(rowData.type);
    }, 0);
  };

  if (!theater) {
    return (
      <div className="not-found">
        <h2>Theater not found</h2>
        <Link to="/event/theater">← Back</Link>
      </div>
    );
  }

  return (
    <div className="theaterdetail-page">
      {/* ===== BANNER ===== */}
      <div className="blog-page">
        <section className="blog-banner">
          <div className="banner-overlay"></div>
          <div className="container">
            <div className="banner-content">
              <h1 className="banner-title">{theater.title}</h1>
              <nav className="breadcrumb-nav">
                <ol className="breadcrumb" style={{marginLeft:"6pc"}}>
                  <li className="breadcrumb-item">
                    <Link to="/">Theater</Link>
                  </li>
                  <li className="breadcrumb-item active">{theater.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
        <ScrollingTicker />
      </div>

  

      {/* ===== MAIN CARD ===== */}
      <div className="theaterdetail-content">
        <img className="poster" src={theater.poster} alt={theater.title} />

        <div className="info-box">
          <div className="theaterdetail-header">
            <div className="header-tags">
              <span className="genre-tag">{theater.genre}</span>
              <span className="rating-tag">⭐ {theater.rating}</span>
              <span className="duration-tag">🕐 {theater.duration}</span>
            </div>
          </div>

          <p className="theaterdetail-desc">{theater.desc}</p>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Venue</span>
                <span className="info-value">{theater.location}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Dates</span>
                <span className="info-value">{theater.fromDate} – {theater.toDate}</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Age Restriction</span>
                <span className="info-value">{theater.age}</span>
              </div>
            </div>

            <div className="info-card price-card">
              <div className="info-icon"></div>
              <div className="info-content">
                <span className="info-label">Ticket Price</span>
                <div className="price-options">
                  <span className="price-item standard">Standard ${getSeatPrice('standard')}</span>
                  <span className="price-item vip">VIP ${getSeatPrice('vip')}</span>
                </div>
              </div>
            </div>
          </div>

         
          <h3 className="section-titlee">Language</h3>
          <div className="options" style={{marginLeft:"17pc"}}>
            {theater.languages.map((lang) => (
              <button
                key={lang}
                className={selectedLang === lang ? "active" : ""}
                onClick={() => setSelectedLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="booking-section">
            <div>
              <h3 className="section-title3">Select Date</h3>
              <div className="options">
                {days.map((d) => (
                  <button
                    key={d}
                    className={selectedDate === d ? "active" : ""}
                    onClick={() => setSelectedDate(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="section-title2">Select Time</h3>
              <div className="options">
                {times.map((t) => (
                  <button
                    key={t}
                    className={selectedTime === t ? "active" : ""}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SEATS - REAL CINEMA STYLE ===== */}
      <div className="seats-area">
        <h3 className="section-title">Choose Your Seats</h3>
        
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
          <div className="legend-item">
            <div className="legend-seat vip"></div>
            <span>VIP ($15)</span>
          </div>
        </div>

        <div className="screen">🎬 SCREEN</div>

        {/* Cinema Hall */}
        <div className="theaterdetail-hall">
          {seatLayout.map((rowData) => (
            <div key={rowData.row} className="seat-row">
              <div className="row-label">{rowData.row}</div>
              
              <div className="seats-container">
                {Array.from({ length: rowData.seats }, (_, i) => {
                  const seatNumber = i + 1;
                  const seatId = `${rowData.row}-${seatNumber}`;
                  const isOccupied = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  
                  return (
                    <div
                      key={seatId}
                      className={`theaterdetail-seat ${rowData.type} 
                        ${isSelected ? "selected" : ""}
                        ${isOccupied ? "occupied" : ""}
                      `}
                      onClick={() => toggleSeat(seatId)}
                      title={`${rowData.row}${seatNumber} - ${rowData.type === 'vip' ? 'VIP' : 'Standard'}`}
                    >
                      <div className="seat-icon">
                        {isOccupied ? '✕' : seatNumber}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="row-label">{rowData.row}</div>
            </div>
          ))}
        </div>

        {/* Exit indicators */}
        <div className="exit-indicators">
          <div className="exit">← EXIT</div>
          <div className="exit">EXIT →</div>
        </div>
      </div>

      {/* ===== RELATED ===== */}
      <div className="related-section">
        <h3 className="section-title">Related theaters</h3>
        <div className="related-grid">
          {relatedTheaters.map((rm) => (
            <div key={rm.id} className="related-card">
              <img src={rm.poster} alt={rm.title} />
              <p>{rm.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="bottom-bar">
        <div className="booking-info">
          <span className="booking-details">
            {selectedDate} • {selectedTime} • {selectedLang}
          </span>
          <span className="seat-info">
            {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} 
            {selectedSeats.length > 0 && ` (${selectedSeats.join(', ')})`}
          </span>
        </div>
        <div className="booking-actions">
          <span className="total-price">Total: ${calculateTotal()}</span>
          <button disabled={selectedSeats.length === 0}>
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Theater;