import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Tourism.css";
import ScrollingTicker from "../components/ScrollingTicker";
import TourismImg from "../assets/images/italy.jpg"; // turizm şəkli

const tourismData = [
  { id: 1, title: "Nature Hike", date: "2025-09-20", location: "Quba Mountains", price: "50-80 AZN", img: TourismImg, type: "Nature" },
  { id: 2, title: "City Tour", date: "2025-10-05", location: "Baku City", price: "40-70 AZN", img: TourismImg, type: "City" },
  { id: 3, title: "Adventure Trip", date: "2025-11-12", location: "Gabala Adventure Park", price: "60-100 AZN", img: TourismImg, type: "Adventure" },
];

export default function Tourism() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filteredTourism = tourismData.filter(
    (item) =>
      (filter === "All" || item.type === filter) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tourism-page">
      <section className="tourism-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Tourism Tours</h1>
            <nav className="breadcrumb-navv">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Tourism Tours</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker />

      <section className="tourism-section">
        <div className="tourism-controls">
          <input
            type="text"
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Nature">Nature</option>
            <option value="City">City</option>
            <option value="Adventure">Adventure</option>
          </select>
        </div>

        <div className="tourism-grid">
          {filteredTourism.length === 0 ? (
            <div className="not-found">
              <h2>Not Found</h2>
              <p>No tours matching your search.</p>
            </div>
          ) : (
            filteredTourism.map((item, i) => (
              <div
                className={`tourism-card ${hoveredCard === i ? "hovered" : ""}`}
                key={item.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/tourism/${item.id}`} className="tourism-link">
                  <div className="tourism-card-inner">
                    <div className="tourism-card-image-container">
                      <img src={item.img} alt={item.title} className="tourism-card-image" />
                      <div className="tourism-card-gradient" />
                      <span className="tourism-type">{item.type}</span>

                      <div className="tourism-card-overlay-content">
                        <h3 className="tourism-card-title">{item.title}</h3>
                        <div className="tourism-card-meta">
                          <span>{item.date}</span> • <span>{item.location}</span>
                        </div>
                        <p className="price">{item.price}</p>
                      </div>

                        <Link to={`/event/tourismdetail/${item.id}`} className="info-btn" style={{ color: "red" }}>
                                            <Info size={12} /> Info
                                          </Link>
                    </div>
                  </div>
                </Link>
                {hoveredCard === i && <div className="tourism-card-glow" />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
