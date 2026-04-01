import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Theater.css";
import ScrollingTicker from "../../../components/ScrollingTicker";
import { buildAssetUrl, fetchProducts, formatDate, filterProductsByCategory } from "../../../api/products";




const theatersData = [
  { id: 1, title: "Hamlet", date: "2025-09-20", location: "London, Globe Theater", ticketPrice: "50-150 GBP", genre: "Drama", img: "src/assets/images/theater.jpg" },
  { id: 2, title: "Royal Shakespeare", date: "2025-10-05", location: "New York, Broadway", ticketPrice: "70-200 USD", genre: "Musical", img: "src/assets/images/theater.jpg" },
  { id: 3, title: "National Theatre", date: "2025-11-12", location: "Paris, Palais Garnier", ticketPrice: "60-180 EUR", genre: "Musical", img: "src/assets/images/theater.jpg" },
];

const mapProductToCard = (product) => {
  const genre = product.subCategoryName || product.categoryName || "Theater";
  return {
    id: product.id,
    title: product.name,
    date: formatDate(product.startDate) || "",
    location: product.address || "",
    ticketPrice: product.personName || (product.ageRestriction ? `${product.ageRestriction}+` : ""),
    genre,
    img: buildAssetUrl(product.image) || theatersData[0].img,
  };
};

export default function Theater() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterOptions, setFilterOptions] = useState(() => ["All", ...new Set(theatersData.map((t) => t.genre).filter(Boolean))]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [theaters, setTheaters] = useState(theatersData);

  const filteredTheaters = theaters.filter(
    (theater) =>
      (filter === "All" || theater.genre === filter) &&
      theater.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => {
        if (!active || !list.length) return;
        const allowed = ["theater", "theatre", "drama", "play", "musical", "comedy"];
        const filtered = filterProductsByCategory(list, allowed);
        const source = filtered.length ? filtered : list;
        const mapped = source.map(mapProductToCard);
        if (mapped.length) {
          setTheaters(mapped);
          const nextFilters = ["All", ...new Set(mapped.map((item) => item.genre).filter(Boolean))];
          setFilterOptions(nextFilters);
          if (!nextFilters.includes(filter)) setFilter("All");
        }
      })
      .catch(() => { });
    return () => {
      active = false;
    };
  }, []);

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
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
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
                <Link to={`/event/theaterdetail/${theater.id}`} className="theater-link">
                  <div className="theater-card-inner">
                    <div className="theater-card-image-container">
                      <img src={theater.img || theatersData[0].img} alt={theater.title} className="theater-card-image" />
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
