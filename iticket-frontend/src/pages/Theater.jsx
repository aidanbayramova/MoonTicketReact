import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Theater.css";
import ScrollingTicker from "../components/ScrollingTicker";
import TheCrucible from "../assets/images/The Crucible.jpg";
import Shakespeare from "../assets/images/Royal Shakespeare.jpg";
import National from "../assets/images/National Theatre.jpg";




const theatersData = [
  { id: 1, title: "Hamlet", date: "2025-09-20", location: "London, Globe Theater", ticketPrice: "50-150 GBP", img: TheCrucible, genre: "Drama" },
  { id: 2, title: "Royal Shakespeare", date: "2025-10-05", location: "New York, Broadway", ticketPrice: "70-200 USD", img: Shakespeare, genre: "Musical" },
  { id: 3, title: "National Theatre", date: "2025-11-12", location: "Paris, Palais Garnier", ticketPrice: "60-180 EUR", img: National, genre: "Musical" },
];

export default function Theater() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filteredTheaters = theatersData.filter(
    (theater) =>
      (filter === "All" || theater.genre === filter) &&
      theater.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="theater-page">
      <section className="theaterdetail-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Theater</h1>
            <nav className="breadcrumb-navv" style={{ marginLeft: "-1pc" }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Theater</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker />

      <section className="theaters-section">
        <div className="theaters-controls">
          <input
            type="text"
            placeholder="Search plays..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Drama">Drama</option>
            <option value="Musical">Musical</option>
            <option value="Comedy">Comedy</option>
          </select>
        </div>

        <div className="theaters-grid">
          {filteredTheaters.length === 0 ? (
            <div className="not-found">
              <h2>Not Found</h2>
              <p>No plays matching your search.</p>
            </div>
          ) : (
            filteredTheaters.map((theater, i) => (
              <div
                className={`theater-card ${hoveredCard === i ? "hovered" : ""}`}
                key={theater.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/theater/${theater.id}`} className="theater-link">
                  <div className="theater-card-inner">
                    <div className="theater-card-image-container">
                      <img src={theater.img} alt={theater.title} className="theater-card-image" />
                      <div className="theater-card-gradient" />
                      <span className="theater-genre">{theater.genre}</span>

                      <div className="theater-card-overlay-contentt">
                        <h3 className="theater-card-title">{theater.title}</h3>
                        <div className="theater-card-meta">
                          <span>{theater.date}</span> • <span>{theater.location}</span>
                        </div>
                        <p className="ticket-price">{theater.ticketPrice}</p>
                      </div>

                      <Link to={`/event/theaterdetail/${theater.id}`} className="info-btn" style={{ color: "red" }}>
                        <Info size={12} /> Info
                      </Link>
                    </div>
                  </div>
                </Link>
                {hoveredCard === i && <div className="theater-card-glow" />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
