import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Movie.css";
import ScrollingTicker from "../components/ScrollingTicker";
import ActionImg from "../assets/images/salam.jpg";

const movieData = [
  { id: 1, title: "Avengers: Endgame", date: "2025-09-20", location: "Cinema Baku", price: "10-20 AZN", img: ActionImg, type: "Action" },
  { id: 2, title: "The Godfather", date: "2025-10-05", location: "Cinema Baku", price: "12-25 AZN", img: ActionImg, type: "Drama" },
  { id: 3, title: "The Mask", date: "2025-11-12", location: "Cinema Baku", price: "8-15 AZN", img: ActionImg, type: "Comedy" },
];

export default function Movie() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filteredMovies = movieData.filter(
    (movie) =>
      (filter === "All" || movie.type === filter) &&
      movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="movie-page">
      <section className="movie-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Movie Night</h1>
            <nav className="breadcrumb-navv" style={{ marginLeft: "0pc" }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Movie Night</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker />

      <section className="movie-section">
        <div className="movie-controls">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
          </select>
        </div>

        <div className="movie-grid">
          {filteredMovies.length === 0 ? (
            <div className="not-found">
              <h2>Not Found</h2>
              <p>No movies matching your search.</p>
            </div>
          ) : (
            filteredMovies.map((movie, i) => (
              <div
                className={`movie-card ${hoveredCard === i ? "hovered" : ""}`}
                key={movie.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/movie/${movie.id}`} className="movie-link">
                  <div className="movie-card-inner">
                    <div className="movie-card-image-container">
                      <img src={movie.img} alt={movie.title} className="movie-card-image" />
                      <div className="movie-card-gradient" />
                      <span className="movie-type">{movie.type}</span>

                      <div className="movie-card-overlay-content">
                        <h3 className="movie-card-title">{movie.title}</h3>
                        <div className="movie-card-meta">
                          <span>{movie.date}</span> • <span>{movie.location}</span>
                        </div>
                        <p className="price">{movie.price}</p>
                      </div>

                      <Link to={`/event/cinema/${movie.id}`} className="info-btn" style={{color:"red"}}>
                        <Info size={12} /> Info
                      </Link>


                    </div>
                  </div>
                </Link>
                {hoveredCard === i && <div className="movie-card-glow" />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
