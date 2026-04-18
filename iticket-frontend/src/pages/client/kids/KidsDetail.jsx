import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ScrollingTicker from "../../../components/ScrollingTicker"; 
import { buildAssetUrl, fetchProductById, formatDate } from "../../../api/products";
import { useBasket } from "../../../context/BasketContext";
import "./KidsDetail.css";

const kidsTheaters = [
  {
    id: "2",
    title: "The salam",
    desc: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
    duration: "175 min",
    rating: "9.2",
    genre: "Crime, Drama",
    location: "Cinema Park – Mall 28",
    fromDate: "03 Jan 2025",
    time: "16:30",
    language: "English",
    age: "18+",
    price: 12,
  },
];

const relatedTheaters = [
  { id: "3", title: "Scarface"},
  { id: "4", title: "Goodfellas"},
];

function KidsTheaterDetail() {
  const { id } = useParams();
  const { addToBasket, buyNow } = useBasket();
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
        ...kidsTheaters[0],
        id: product.id,
        title: product.name || kidsTheaters[0].title,
        desc: product.description || kidsTheaters[0].desc,
        genre: [product.categoryName, product.subCategoryName].filter(Boolean).join(", ") || kidsTheaters[0].genre,
        location: product.address || kidsTheaters[0].location,
        fromDate: formatDate(product.startDate) || kidsTheaters[0].fromDate,
        time: product.startTime || kidsTheaters[0].time,
        language: (product.languages || []).join(", ") || kidsTheaters[0].language,
        age: product.ageRestriction ? `${product.ageRestriction}+` : kidsTheaters[0].age,
        poster: buildAssetUrl(product.image) || kidsTheaters[0].poster,
      }
    : kidsTheaters[0];
  
  const [ticketCount, setTicketCount] = useState(1);

  const calculateTotal = () => {
    return theater.price * ticketCount;
  };

  const buildBasketItem = () => ({
    eventType: "kids",
    productId: theater.id,
    title: theater.title,
    quantity: ticketCount,
    seats: [],
    showKey: `kids-${theater.id}-${theater.fromDate}-${theater.time}`,
    eventDate: theater.fromDate,
    eventTime: theater.time,
    language: theater.language,
    location: theater.location,
    total: calculateTotal(),
  });

  const handleAddToBasket = () => {
    addToBasket(buildBasketItem());
    setActionMessage("Ticket added to basket.");
  };

  const handleBuyNow = async () => {
    try {
      await buyNow(buildBasketItem());
      setActionMessage("Ticket purchased successfully.");
    } catch (error) {
      setActionMessage(error.message || "Failed to purchase ticket.");
    }
  };

  if (loading && !product) {
    return <div className="not-found"><h2>Loading...</h2></div>;
  }

  return (
    <div className="kids-detail-page">
      <div className="blog-page">
        <section className="blog-banner">
          <div className="banner-overlay"></div>
          <div className="container">
            <div className="banner-content">
              <h1 className="banner-title">{theater.title}</h1>
              <nav className="breadcrumb-nav">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Kids</Link>
                  </li>
                  <li className="breadcrumb-item active">{theater.title}</li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
        <ScrollingTicker />
      </div>

      {/* Main Content */}
      <div className="kids-content-wrapper">
        <div className="kids-main-content">
          <img className="kids-poster" src={theater.poster} alt={theater.title} />

          <div className="kids-info-section">
            {/* Header Tags */}
            <div className="kids-header-tags">
              <span className="kids-tag kids-genre">{theater.genre}</span>
              <span className="kids-tag kids-rating">⭐ {theater.rating}</span>
              <span className="kids-tag kids-duration">🕐 {theater.duration}</span>
            </div>

            <p className="kids-description">{theater.desc}</p>

            {/* Info Cards */}
            <div className="kids-info-cards">
              <div className="kids-info-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Venue</span>
                  <span className="kids-info-value">{theater.location}</span>
                </div>
              </div>

              <div className="kids-info-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Date & Time</span>
                  <span className="kids-info-value">{theater.fromDate} • {theater.time}</span>
                </div>
              </div>

              <div className="kids-info-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Language</span>
                  <span className="kids-info-value">{theater.language}</span>
                </div>
              </div>

              <div className="kids-info-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Age Restriction</span>
                  <span className="kids-info-value">{theater.age}</span>
                </div>
              </div>

              <div className="kids-info-card kids-price-card">
                <div className="kids-info-content">
                  <span className="kids-info-label">Ticket Price</span>
                  <span className="kids-info-value kids-price-display">${theater.price}</span>
                </div>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="kids-ticket-section">
              <h3 className="kids-section-title">Select Number of Tickets</h3>
              <div className="kids-ticket-counter">
                <label>Number of Tickets:</label>
                <div className="kids-counter-controls">
                  <button 
                    className="kids-counter-btn"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  >
                    −
                  </button>
                  <span className="kids-counter-value">{ticketCount}</span>
                  <button 
                    className="kids-counter-btn"
                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Section */}
        <div className="kids-related-section">
          <h3 className="kids-section-title">Similar Kids Shows</h3>
          <div className="kids-related-grid">
            {similarProducts.length > 0 ? (
              similarProducts.map((rm) => (
                <Link key={rm.id} to={`/kids-detail/${rm.id}`} className="kids-related-card">
                  {rm.poster && <img src={rm.poster} alt={rm.title} />}
                  <p>{rm.title}</p>
                </Link>
              ))
            ) : (
              <p>No similar kids shows available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="kids-bottom-bar">
        <div className="kids-booking-info">
          {actionMessage && <span className="kids-booking-details">{actionMessage}</span>}
          <span className="kids-booking-details">
            {theater.fromDate} • {theater.time} • {theater.language}
          </span>
          <span className="kids-ticket-info">
            {ticketCount} Ticket{ticketCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="kids-booking-actions">
          <span className="kids-total-price">Total: ${calculateTotal()}</span>
          <button className="kids-payment-btn" onClick={handleAddToBasket}>Add to Basket</button>
          <button className="kids-payment-btn" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default KidsTheaterDetail;
