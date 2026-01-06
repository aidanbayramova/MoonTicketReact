import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Kids.css";
import ScrollingTicker from "../components/ScrollingTicker";
import KidsClassImg from "../assets/images/T3.jpg"; // uşaqlar üçün masterclass şəkli

const kidsData = [
  { id: 1, title: "Painting Masterclass", date: "2025-09-20", location: "Baku, Art Center", price: "30-50 AZN", img: KidsClassImg, type: "Art" },
  { id: 2, title: "Music Masterclass", date: "2025-10-05", location: "Baku, Music School", price: "40-60 AZN", img: KidsClassImg, type: "Music" },
  { id: 3, title: "Dance Masterclass", date: "2025-11-12", location: "Baku, Dance Studio", price: "35-55 AZN", img: KidsClassImg, type: "Dance" },
];

export default function Kids() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filteredKids = kidsData.filter(
    (kid) =>
      (filter === "All" || kid.type === filter) &&
      kid.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="kidss-page">
      <section className="kidss-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">FunForKids</h1>
            <nav className="breadcrumb-navv">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">FunForKids</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker />

      <section className="kids-section">
        <div className="kids-controls">
          <input
            type="text"
            placeholder="Search masterclasses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Art">Art</option>
            <option value="Music">Music</option>
            <option value="Dance">Dance</option>
          </select>
        </div>

        <div className="kids-grid">
          {filteredKids.length === 0 ? (
            <div className="not-found">
              <h2>Not Found</h2>
              <p>No masterclasses matching your search.</p>
            </div>
          ) : (
            filteredKids.map((kid, i) => (
              <div
                className={`kids-card ${hoveredCard === i ? "hovered" : ""}`}
                key={kid.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/kids/${kid.id}`} className="kids-link">
                  <div className="kids-card-inner">
                    <div className="kids-card-image-container">
                      <img src={kid.img} alt={kid.title} className="kids-card-image" />
                      <div className="kids-card-gradient" />
                      <span className="kids-type">{kid.type}</span>

                      <div className="kids-card-overlay-content">
                        <h3 className="kids-card-title">{kid.title}</h3>
                        <div className="kids-card-meta">
                          <span>{kid.date}</span> • <span>{kid.location}</span>
                        </div>
                        <p className="price">{kid.price}</p>
                      </div>

                      <Link to={`/event/kidsdetail/${kid.id}`} className="info-btn" style={{ color: "red" }}>
                        <Info size={12} /> Info
                      </Link>
                    </div>
                  </div>
                </Link>
                {hoveredCard === i && <div className="kids-card-glow" />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
