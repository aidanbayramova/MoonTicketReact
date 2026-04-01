import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Tourism.css";
import ScrollingTicker from "../../../components/ScrollingTicker";
import { buildAssetUrl, fetchProducts, formatDate, filterProductsByCategory } from "../../../api/products";

const tourismData = [
  { id: 1, title: "Nature Hike", date: "2025-09-20", location: "Quba Mountains", price: "50-80 AZN", type: "Nature", img: "src/assets/images/tour.jpg" },
  { id: 2, title: "City Tour", date: "2025-10-05", location: "Baku City", price: "40-70 AZN", type: "City", img: "src/assets/images/tour.jpg" },
  { id: 3, title: "Adventure Trip", date: "2025-11-12", location: "Gabala Adventure Park", price: "60-100 AZN", type: "Adventure", img: "src/assets/images/tour.jpg" },
];

const mapProductToCard = (product) => {
  const type = product.subCategoryName || product.categoryName || "Tourism";
  return {
    id: product.id,
    title: product.name,
    date: formatDate(product.startDate) || "",
    location: product.address || "",
    price: product.personName || (product.ageRestriction ? `${product.ageRestriction}+` : ""),
    type,
    img: buildAssetUrl(product.image) || tourismData[0].img,
  };
};

export default function Tourism() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterOptions, setFilterOptions] = useState(() => ["All", ...new Set(tourismData.map((t) => t.type).filter(Boolean))]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [tourism, setTourism] = useState(tourismData);

  const filteredTourism = tourism.filter(
    (item) =>
      (filter === "All" || item.type === filter) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => {
        if (!active || !list.length) return;
        const allowed = ["tourism", "tour", "travel", "trip", "hike", "city", "adventure", "nature"];
        const filtered = filterProductsByCategory(list, allowed);
        const source = filtered.length ? filtered : list;
        const mapped = source.map(mapProductToCard);
        if (mapped.length) {
          setTourism(mapped);
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
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
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
                <Link to={`/event/tourismdetail/${item.id}`} className="tourism-link">
                  <div className="tourism-card-inner">
                    <div className="tourism-card-image-container">
                      <img src={item.img || tourismData[0].img} alt={item.title} className="tourism-card-image" />
                      <div className="tourism-card-gradient" />
                      <span className="tourism-type">{item.type}</span>

                      <div className="tourism-card-overlay-contentt">
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
