import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ScrollingTicker from "../../../components/ScrollingTicker"; 
import { buildAssetUrl, fetchProductById, formatDate } from "../../../api/products";
import { useBasket } from "../../../context/BasketContext";
import "./TheaterDetail.css";


const fallbackTheater = {
  id: "2",
  title: "The Godfather",
  desc:
    "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
  duration: "175 min",
  rating: "9.2",
  genre: "Crime, Drama",
  location: "Cinema Park – Mall 28",
  fromDate: "03 Jan 2025",
  toDate: "10 Jan 2025",
  languages: ["English", "Russian", "Turkish"],
  age: "18+",
  poster: "src/assets/images/theater.jpg",
};

const relatedTheaters = [
  {
    id: "3",
    title: "Scarface",
  },
  {
    id: "4",
    title: "Goodfellas",
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
              poster: buildAssetUrl(p.image) || ""
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

  const theater = product
    ? {
        ...fallbackTheater,
        id: product.id,
        title: product.name || fallbackTheater.title,
        desc: product.description || fallbackTheater.desc,
        genre: [product.categoryName, product.subCategoryName].filter(Boolean).join(", ") || fallbackTheater.genre,
        location: product.address || fallbackTheater.location,
        fromDate: formatDate(product.startDate) || fallbackTheater.fromDate,
        toDate: formatDate(product.endDate) || fallbackTheater.toDate,
        languages: product.languages?.length ? product.languages : fallbackTheater.languages,
        age: product.ageRestriction ? `${product.ageRestriction}+` : fallbackTheater.age,
        poster: buildAssetUrl(product.image) || fallbackTheater.poster,
      }
    : fallbackTheater;

  const days = ["03 Jan", "04 Jan", "05 Jan", "06 Jan", "07 Jan"];
  const times = ["16:30", "18:30", "20:30", "22:30"];

  // Occupied seats (format: "A-3", "B-5")
  const staticOccupiedSeats = [
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
  const showKey = `theater-${theater.id}-${selectedDate}-${selectedTime}-${selectedLang}`;
  const occupiedFromOrders = getOccupiedSeats(showKey);
  const occupiedSeats = Array.from(new Set([...staticOccupiedSeats, ...occupiedFromOrders]));

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

  const buildBasketItem = () => ({
    eventType: "theater",
    productId: theater.id,
    title: theater.title,
    quantity: selectedSeats.length,
    seats: selectedSeats,
    showKey,
    eventDate: selectedDate,
    eventTime: selectedTime,
    language: selectedLang,
    location: theater.location,
    total: calculateTotal(),
  });

  const handleAddToBasket = () => {
    if (!selectedSeats.length) return;
    addToBasket(buildBasketItem());
    setActionMessage("Selected seats added to basket.");
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
        <h3 className="section-title">Similar Theaters</h3>
        <div className="related-grid">
          {similarProducts.length > 0 ? (
            similarProducts.map((rm) => (
              <Link key={rm.id} to={`/event/theater/${rm.id}`} className="related-card">
                {rm.poster && <img src={rm.poster} alt={rm.title} />}
                <p>{rm.title}</p>
              </Link>
            ))
          ) : (
            <p>No similar theaters available.</p>
          )}
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="bottom-bar">
        <div className="booking-info">
          {actionMessage && <span className="booking-details">{actionMessage}</span>}
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
          <button disabled={selectedSeats.length === 0} onClick={handleAddToBasket}>Add to Basket</button>
          <button disabled={selectedSeats.length === 0} onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default Theater;