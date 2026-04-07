import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Museum.css";
import ScrollingTicker from "../../../components/ScrollingTicker"; 
import { buildAssetUrl, fetchProducts, formatDate, filterProductsByCategory, sortProductsByNewest } from "../../../api/products";

const museumData = [
  { id: 1, title: "Ancient Sculptures", date: "2025-09-20", location: "Baku Museum of History", price: "Free", type: "Art", img: "src/assets/images/museum.jpg" },
  { id: 2, title: "Medieval Artifacts", date: "2025-10-05", location: "Baku Museum of History", price: "5-10 AZN", type: "History", img: "src/assets/images/museum.jpg" },
  { id: 3, title: "Science Exhibit", date: "2025-11-12", location: "Baku Science Museum", price: "10-15 AZN", type: "Science", img: "src/assets/images/museum.jpg" },
];

const mapProductToCard = (product) => {
  const type = product.subCategoryName || product.categoryName || "Museum";
  return {
    id: product.id,
    title: product.name,
    date: formatDate(product.startDate) || "",
    location: product.address || "",
    price: product.personName || (product.ageRestriction ? `${product.ageRestriction}+` : ""),
    type,
    img: buildAssetUrl(product.image) || museumData[0].img,
  };
};

export default function Museum() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterOptions, setFilterOptions] = useState(() => ["All", ...new Set(museumData.map((m) => m.type).filter(Boolean))]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [museums, setMuseums] = useState(museumData);

  const filteredMuseums = museums.filter(
    (item) =>
      (filter === "All" || item.type === filter) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => {
        if (!active || !list.length) return;
        const allowed = ["museum", "history", "art", "science", "exhibit", "gallery"];
        const filtered = filterProductsByCategory(list, allowed);
        const mapped = sortProductsByNewest(filtered).map(mapProductToCard);
        if (mapped.length) {
          setMuseums(mapped);
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
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
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
                <Link to={`/event/museumdetail/${item.id}`} className="museum-link">
                  <div className="museum-card-inner">
                    <div className="museum-card-image-container">
                      <img src={item.img || museumData[0].img} alt={item.title} className="museum-card-image" />
                      <div className="museum-card-gradient" />
                      <span className="museum-type">{item.type}</span>

                      <div className="museum-card-overlay-contentt">
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
