import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ScrollingTicker from "../../../components/ScrollingTicker"; 
import { buildAssetUrl, fetchProductById, formatDate } from "../../../api/products";
import { useBasket } from "../../../context/BasketContext";
import "./MuseumDetail.css";

const museumDetail = [
    {
        id: "2",
        title: "The salam",
        desc: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
        duration: "175 min",
        rating: "9.2",
        location: "Cinema Park – Mall 28",
        fromDate: "03 Jan 2025",
        time: "10:00-20:00",
        language: "English",
        price: 12,
    },
];

const relatedMuseums = [
    { id: "3", title: "Scarface"},
    { id: "4", title: "Goodfellas"},
];

function MuseumDetail() {
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

    const museum = product
        ? {
              ...museumDetail[0],
              id: product.id,
              title: product.name || museumDetail[0].title,
              desc: product.description || museumDetail[0].desc,
              genre: [product.categoryName, product.subCategoryName].filter(Boolean).join(", ") || museumDetail[0].genre,
              location: product.address || museumDetail[0].location,
              fromDate: formatDate(product.startDate) || museumDetail[0].fromDate,
              time: product.startTime || museumDetail[0].time,
              language: (product.languages || []).join(", ") || museumDetail[0].language,
              poster: buildAssetUrl(product.image) || museumDetail[0].poster,
          }
        : museumDetail[0];

    const [ticketCount, setTicketCount] = useState(1);

    const calculateTotal = () => {
        return museum.price * ticketCount;
    };

    const buildBasketItem = () => ({
        eventType: "museum",
        productId: museum.id,
        title: museum.title,
        quantity: ticketCount,
        seats: [],
        showKey: `museum-${museum.id}-${museum.fromDate}-${museum.time}`,
        eventDate: museum.fromDate,
        eventTime: museum.time,
        language: museum.language,
        location: museum.location,
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
        <div className="museum-detail-page">
            <section className="museum-banner">
                <div className="banner-overlay"></div>
                <div className="container">
                    <div className="banner-content">
                        <h1 className="banner-title">{museum.title}</h1>
                        <nav className="breadcrumb-navv" style={{ marginLeft: "-2pc" }}>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active">{museum.title}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <ScrollingTicker />

            {/* Main Content */}
            <div className="museum-content-wrapper">
                <div className="museum-main-content">
                    <img className="museum-poster" src={museum.poster} alt={museum.title} />

                    <div className="museum-info-section">
                        {/* Header Tags */}
                        <div className="museum-header-tags">
                            <span className="museum-tag museum-genre">{museum.genre}</span>
                            <span className="museum-tag museum-rating">⭐ {museum.rating}</span>
                            <span className="museum-tag museum-duration">🕐 {museum.duration}</span>
                        </div>

                        <p className="museum-description">{museum.desc}</p>

                        {/* Info Cards */}
                        <div className="museum-info-cards">
                            <div className="museum-info-card">
                                <div className="museum-info-content">
                                    <span className="museum-info-label">Venue</span>
                                    <span className="museum-info-value">{museum.location}</span>
                                </div>
                            </div>

                            <div className="museum-info-card">
                                <div className="museum-info-content">
                                    <span className="museum-info-label">Date & Time</span>
                                    <span className="museum-info-value">
                                        Mon – Sat 
                                        <br />• {museum.time}
                                        <br />
                                        <small className="museum-note">
                                            Closed on Sundays and public holidays
                                        </small>
                                    </span>
                                </div>
                            </div>

                            <div className="museum-info-card museum-price-card">
                                <div className="museum-info-content">
                                    <span className="museum-info-label">Ticket Price</span>
                                    <span className="museum-info-value museum-price-display">
                                        ${museum.price}
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* Ticket Selection */}
                        <div className="museum-ticket-section">
                            <h3 className="museum-section-title">Select Number of Tickets</h3>
                            <div className="museum-ticket-counter">
                                <label>Number of Tickets:</label>
                                <div className="museum-counter-controls">
                                    <button
                                        className="museum-counter-btn"
                                        onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                    >
                                        −
                                    </button>
                                    <span className="museum-counter-value">{ticketCount}</span>
                                    <button
                                        className="museum-counter-btn"
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
                <div className="museum-related-section">
                    <h3 className="museum-section-title">Similar Museums</h3>
                    <div className="museum-related-grid">
                        {similarProducts.length > 0 ? (
                            similarProducts.map((rm) => (
                                <Link key={rm.id} to={`/museum-detail/${rm.id}`} className="museum-related-card">
                                    {rm.poster && <img src={rm.poster} alt={rm.title} />}
                                    <p>{rm.title}</p>
                                </Link>
                            ))
                        ) : (
                            <p>No similar museums available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="museum-bottom-bar">
                <div className="museum-booking-info">
                    {actionMessage && <span className="museum-booking-details">{actionMessage}</span>}
                    <span className="museum-booking-details">
                        {museum.fromDate} • {museum.time} • {museum.language}
                    </span>
                    <span className="museum-ticket-info">
                        {ticketCount} Ticket{ticketCount !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="museum-booking-actions">
                    <span className="museum-total-price">Total: ${calculateTotal()}</span>
                    <button className="museum-payment-btn" onClick={handleAddToBasket}>Add to Basket</button>
                    <button className="museum-payment-btn" onClick={handleBuyNow}>Buy Now</button>
                </div>
            </div>
        </div>
    );
}

export default MuseumDetail;
