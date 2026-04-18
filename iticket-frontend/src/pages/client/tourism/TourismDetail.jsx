import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ScrollingTicker from "../../../components/ScrollingTicker";
import { buildAssetUrl, fetchProductById, formatDate } from "../../../api/products";
import { useBasket } from "../../../context/BasketContext";
import "./TourismDetail.css";

const tourismDetail = [
    {
        id: "2",
        title: "The salam",
        desc: "The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
        duration: "175 min",
        rating: "9.2",
        genre: "Crime, Drama",
        location: "Cinema Park – Mall 28",
        time: "10:00-20:00",
        price: 12,
        availableDates: ["2025-12-21", "2025-12-22", "2025-12-24"] // Available dates
    },
];

const relatedtourisms = [
    { id: "3", title: "Scarface"},
    { id: "4", title: "Goodfellas"},
];

function TourismDetail() {
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

    const tourism = product
        ? {
              ...tourismDetail[0],
              id: product.id,
              title: product.name || tourismDetail[0].title,
              desc: product.description || tourismDetail[0].desc,
              genre: [product.categoryName, product.subCategoryName].filter(Boolean).join(", ") || tourismDetail[0].genre,
              location: product.address || tourismDetail[0].location,
              time: product.startTime || tourismDetail[0].time,
              poster: buildAssetUrl(product.image) || tourismDetail[0].poster,
              availableDates: product.startDate ? [new Date(product.startDate).toISOString().split("T")[0]] : tourismDetail[0].availableDates,
          }
        : tourismDetail[0];

    const [ticketCount, setTicketCount] = useState(1);
    const [selectedDate, setSelectedDate] = useState(tourism.availableDates[0]);

    useEffect(() => {
        if (tourism.availableDates?.length) {
            setSelectedDate(tourism.availableDates[0]);
        }
    }, [tourism.availableDates]);

    const calculateTotal = () => tourism.price * ticketCount;

    const buildBasketItem = () => ({
        eventType: "tourism",
        productId: tourism.id,
        title: tourism.title,
        quantity: ticketCount,
        seats: [],
        showKey: `tourism-${tourism.id}-${selectedDate}-${tourism.time}`,
        eventDate: formatDate(new Date(selectedDate)) || selectedDate,
        eventTime: tourism.time,
        location: tourism.location,
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
        <div className="tourism-detail-page">
            <section className="tourism-banner">
                <div className="banner-overlay"></div>
                <div className="container">
                    <div className="banner-content">
                        <h1 className="banner-title">{tourism.title}</h1>
                        <nav className="breadcrumb-navv" style={{ marginLeft: "-2pc" }}>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active">{tourism.title}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            <ScrollingTicker />

            {/* Main Content */}
            <div className="tourism-content-wrapper">
                <div className="tourism-main-content">
                    <img className="tourism-poster" src={tourism.poster} alt={tourism.title} />

                    <div className="tourism-info-section">
                        {/* Header Tags */}
                        <div className="tourism-header-tags">
                            <span className="tourism-tag tourism-genre">{tourism.genre}</span>
                            <span className="tourism-tag tourism-rating">⭐ {tourism.rating}</span>
                            <span className="tourism-tag tourism-duration">🕐 {tourism.duration}</span>
                        </div>

                        <p className="tourism-description">{tourism.desc}</p>

                        {/* Info Cards */}
                        <div className="tourism-info-cards">
                            <div className="tourism-info-card">
                                <div className="tourism-info-content">
                                    <span className="tourism-info-label">Venue</span>
                                    <span className="tourism-info-value">{tourism.location}</span>
                                </div>
                            </div>

                            <div className="tourism-info-card">
                                <div className="tourism-info-content">
                                    <span className="tourism-info-label">Select Date</span>
                                    <div className="tourism-options">
                                        {tourism.availableDates.map((date) => (
                                            <button
                                                key={date}
                                                className={`tourism-option-btn ${selectedDate === date ? "tourism-active" : ""}`}
                                                onClick={() => setSelectedDate(date)}
                                            >
                                                {new Date(date).toLocaleDateString("en-US", {
                                                    day: "2-digit",
                                                    month: "short"
                                                })}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>


                            <div className="tourism-info-card tourism-price-card">
                                <div className="tourism-info-content">
                                    <span className="tourism-info-label">Ticket Price</span>
                                    <span className="tourism-info-value tourism-price-display">
                                        ${tourism.price}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Selection */}
                        <div className="tourism-ticket-section">
                            <h3 className="tourism-section-title">Select Number of Tickets</h3>
                            <div className="tourism-ticket-counter">
                                <label>Number of Tickets:</label>
                                <div className="tourism-counter-controls">
                                    <button
                                        className="tourism-counter-btn"
                                        onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                    >
                                        −
                                    </button>
                                    <span className="tourism-counter-value">{ticketCount}</span>
                                    <button
                                        className="tourism-counter-btn"
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
                <div className="tourism-related-section">
                    <h3 className="tourism-section-title">Similar Attractions</h3>
                    <div className="tourism-related-grid">
                        {similarProducts.length > 0 ? (
                            similarProducts.map((rm) => (
                                <Link key={rm.id} to={`/tourism-detail/${rm.id}`} className="tourism-related-card">
                                    {rm.poster && <img src={rm.poster} alt={rm.title} />}
                                    <p>{rm.title}</p>
                                </Link>
                            ))
                        ) : (
                            <p>No similar attractions available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="tourism-bottom-bar">
                <div className="tourism-booking-info">
                    {actionMessage && <span className="tourism-booking-details">{actionMessage}</span>}
                    <span className="tourism-booking-details">
                        {new Date(selectedDate).toLocaleDateString("en-US")} • {tourism.time}
                    </span>
                    <span className="tourism-ticket-info">
                        {ticketCount} Ticket{ticketCount !== 1 ? "s" : ""}
                    </span>
                </div>
                <div className="tourism-booking-actions">
                    <span className="tourism-total-price">Total: ${calculateTotal()}</span>
                    <button className="tourism-payment-btn" onClick={handleAddToBasket}>Add to Basket</button>
                    <button className="tourism-payment-btn" onClick={handleBuyNow}>Buy Now</button>
                </div>
            </div>
        </div>
    );
}

export default TourismDetail;
