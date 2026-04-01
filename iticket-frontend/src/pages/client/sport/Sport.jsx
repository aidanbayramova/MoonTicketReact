import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Sport.css";
import ScrollingTicker from "../../../components/ScrollingTicker";
import { buildAssetUrl, fetchProducts, formatDate, filterProductsByCategory } from "../../../api/products";

const sportData = [
  { id: 1, title: "Football Training", date: "2025-09-20", location: "Baku, National Stadium", price: "20-40 AZN", type: "Football", img: "src/assets/images/sport.jpg" },
  { id: 2, title: "Basketball Camp", date: "2025-10-05", location: "Baku, Sports Complex", price: "25-45 AZN", type: "Basketball", img: "src/assets/images/sport.jpg" },
  { id: 3, title: "Tennis Workshop", date: "2025-11-12", location: "Baku, Tennis Club", price: "30-50 AZN", type: "Tennis", img: "src/assets/images/sport.jpg" },
];

const mapProductToCard = (product) => {
  const type = product.subCategoryName || product.categoryName || "Sport";
  return {
    id: product.id,
    title: product.name,
    date: formatDate(product.startDate) || "",
    location: product.address || "",
    price: product.personName || (product.ageRestriction ? `${product.ageRestriction}+` : ""),
    type,
    img: buildAssetUrl(product.image) || sportData[0].img,
  };
};

export default function Sport() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterOptions, setFilterOptions] = useState(() => ["All", ...new Set(sportData.map((s) => s.type).filter(Boolean))]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sports, setSports] = useState(sportData);

  const filteredSport = sports.filter(
    (sport) =>
      (filter === "All" || sport.type === filter) &&
      sport.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => {
        if (!active || !list.length) return;
        const allowed = ["sport", "sports", "football", "basketball", "tennis", "training"];
        const filtered = filterProductsByCategory(list, allowed);
        const source = filtered.length ? filtered : list;
        const mapped = source.map(mapProductToCard);
        if (mapped.length) {
          setSports(mapped);
          const nextFilters = ["All", ...new Set(mapped.map((item) => item.type).filter(Boolean))];
          setFilterOptions(nextFilters);
          if (!nextFilters.includes(filter)) setFilter("All");
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="sport-page">
      <section className="sport-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Sports</h1>
            <nav className="breadcrumb-navv" style={{ marginLeft: "-2pc" }}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Sports</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker />

      <section className="sport-section">
        <div className="sport-controls">
          <input
            type="text"
            placeholder="Search trainings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="sport-grid">
          {filteredSport.length === 0 ? (
            <div className="not-found">
              <h2>Not Found</h2>
              <p>No sports trainings matching your search.</p>
            </div>
          ) : (
            filteredSport.map((sport, i) => (
              <div
                className={`sport-card ${hoveredCard === i ? "hovered" : ""}`}
                key={sport.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/event/sportdetail/${sport.id}`} className="sport-link">
                  <div className="sport-card-inner">
                    <div className="sport-card-image-container">
                      <img src={sport.img || sportData[0].img} alt={sport.title} className="sport-card-image" />
                      <div className="sport-card-gradient" />
                      <span className="sport-type">{sport.type}</span>

                      <div className="sport-card-overlay-content">
                        <h3 className="sport-card-title">{sport.title}</h3>
                        <div className="sport-card-meta">
                          <span>{sport.date}</span> • <span>{sport.location}</span>
                        </div>
                        <p className="price">{sport.price}</p>
                      </div>
                      <Link to={`/event/sportdetail/${sport.id}`} className="info-btn" style={{ color: "red" }}>
                        <Info size={12} /> Info
                      </Link>
                    </div>
                  </div>
                </Link>
                {hoveredCard === i && <div className="sport-card-glow" />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
