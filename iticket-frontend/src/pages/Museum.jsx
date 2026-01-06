import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Museum.css";
import ScrollingTicker from "../components/ScrollingTicker";
import ArtImg from "../assets/images/Louvre.jpg"; // muzey şəkli

const museumData = [
  { id: 1, title: "Ancient Sculptures", date: "2025-09-20", location: "Baku Museum of History", price: "Free", img: ArtImg, type: "Art" },
  { id: 2, title: "Medieval Artifacts", date: "2025-10-05", location: "Baku Museum of History", price: "5-10 AZN", img: ArtImg, type: "History" },
  { id: 3, title: "Science Exhibit", date: "2025-11-12", location: "Baku Science Museum", price: "10-15 AZN", img: ArtImg, type: "Science" },
];

export default function Museum() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filteredMuseums = museumData.filter(
    (item) =>
      (filter === "All" || item.type === filter) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="museum-page">
      <section className="museum-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Museum</h1>
            <nav className="breadcrumb-navv" style={{ marginLeft: "-2pc" }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Museums</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker />

      <section className="museum-section">
        <div className="museum-controls">
          <input
            type="text"
            placeholder="Search exhibits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Art">Art</option>
            <option value="History">History</option>
            <option value="Science">Science</option>
          </select>
        </div>

        <div className="museum-grid">
          {filteredMuseums.length === 0 ? (
            <div className="not-found">
              <h2>Not Found</h2>
              <p>No exhibits matching your search.</p>
            </div>
          ) : (
            filteredMuseums.map((item, i) => (
              <div
                className={`museum-card ${hoveredCard === i ? "hovered" : ""}`}
                key={item.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/museum/${item.id}`} className="museum-link">
                  <div className="museum-card-inner">
                    <div className="museum-card-image-container">
                      <img src={item.img} alt={item.title} className="museum-card-image" />
                      <div className="museum-card-gradient" />
                      <span className="museum-type">{item.type}</span>

                      <div className="museum-card-overlay-content">
                        <h3 className="museum-card-title">{item.title}</h3>
                        <div className="museum-card-meta">
                          <span>{item.date}</span> • <span>{item.location}</span>
                        </div>
                        <p className="price">{item.price}</p>
                      </div>

                      <Link to={`/event/museumdetail/${item.id}`} className="info-btn" style={{ color: "red" }}>
                        <Info size={12} /> Info
                      </Link>
                    </div>
                  </div>
                </Link>
                {hoveredCard === i && <div className="museum-card-glow" />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
