import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import ScrollingTicker from "../../../components/ScrollingTicker";
import "./Circus.css";
import { buildAssetUrl, fetchProducts, formatDate, filterProductsByCategory, sortProductsByNewest } from "../../../api/products";

const circusData = [
  { id: 1, title: "Acrobat Show", date: "2025-09-20", location: "Baku Circus Arena", price: "20-40 AZN", type: "Acrobatics", img: "src/assets/images/circus.jpg" },
  { id: 2, title: "Animal Parade", date: "2025-10-05", location: "Baku Circus Arena", price: "15-30 AZN", type: "Animals", img: "src/assets/images/circus.jpg" },
  { id: 3, title: "Clown Comedy", date: "2025-11-12", location: "Baku Circus Arena", price: "10-25 AZN", type: "Clown", img: "src/assets/images/circus.jpg" },
];

const mapProductToCard = (product) => {
  const type = product.subCategoryName || product.categoryName || "Circus";
  return {
    id: product.id,
    title: product.name,
    date: formatDate(product.startDate) || "",
    location: product.address || "",
    price: product.personName || (product.ageRestriction ? `${product.ageRestriction}+` : ""),
    type,
    img: buildAssetUrl(product.image) || circusData[0].img,
  };
};

export default function Circus() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterOptions, setFilterOptions] = useState(() => ["All", ...new Set(circusData.map((c) => c.type).filter(Boolean))]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [circus, setCircus] = useState(circusData);

  const filteredCircus = circus.filter(
    (item) =>
      (filter === "All" || item.type === filter) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => {
        if (!active || !list.length) return;
        const allowed = ["circus", "acrobat", "acrobatics", "animals", "clown", "show"];
        const filtered = filterProductsByCategory(list, allowed);
        const mapped = sortProductsByNewest(filtered).map(mapProductToCard);
        if (mapped.length) {
          setCircus(mapped);
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
    <div className="circus-page">
      <section className="circus-banner">
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Circus</h1>
            <nav className="breadcrumb-navv">
              <ol className="breadcrumb" style={{ marginLeft: "-1pc" }}>
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Circus</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker />

      <section className="circus-sectionn">
        <div className="circus-controls">
          <input
            type="text"
            placeholder="Search shows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="circus-grid">
          {filteredCircus.length === 0 ? (
            <div className="not-found">
              <h2>Not Found</h2>
              <p>No shows matching your search.</p>
            </div>
          ) : (
            filteredCircus.map((item, i) => (
              <div
                className={`circus-card ${hoveredCard === i ? "hovered" : ""}`}
                key={item.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/event/circusdetail/${item.id}`} className="circus-link">
                  <div className="circus-card-inner">
                    <div className="circus-card-image-container">
                      <img src={item.img || circusData[0].img} alt={item.title} className="circus-card-image" />
                      <div className="circus-card-gradient" />
                      <span className="circus-type">{item.type}</span>

                      <div className="circus-card-overlay-contentt">
                        <h3 className="circus-card-title">{item.title}</h3>
                        <div className="circus-card-meta">
                          <span>{item.date}</span> • <span>{item.location}</span>
                        </div>
                        <p className="price">{item.price}</p>
                      </div>
                      <Link to={`/event/circusdetail/${item.id}`} className="info-btn" style={{ color: "red" }}>
                        <Info size={12} /> Info
                      </Link>
                    </div>
                  </div>
                </Link>
                {hoveredCard === i && <div className="circus-card-glow" />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
