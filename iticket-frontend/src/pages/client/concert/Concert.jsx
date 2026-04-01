import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Concert.css";
import ScrollingTicker from "../../../components/ScrollingTicker";
import { buildAssetUrl, fetchProducts, formatDate, filterProductsByCategory } from "../../../api/products";


const fallbackConcerts = [
  { id: 1, title: "Dua Lipa Concert", date: "2025-09-20", location: "London, Wembley", price: "80-300 EUR", category: "Pop", img: "src/assets/images/c2.jpg" },
  { id: 2, title: "Shakira World Tour", date: "2025-10-05", location: "Berlin, Mercedes-Benz", price: "70-250 EUR", category: "Rock", img: "src/assets/images/c3.jpg" },
  { id: 3, title: "Billie Eilish Concert", date: "2025-11-12", location: "Paris, Accor Arena", price: "60-220 EUR", category: "Pop", img: "src/assets/images/c1.jpg" },
];

const placeholderImg = "src/assets/images/hello.jpg";

const mapProductToCard = (product) => {
  const category = product.subCategoryName || product.categoryName || "Concert";
  return {
    id: product.id,
    title: product.name,
    date: formatDate(product.startDate) || "",
    location: product.address || "",
    price: product.personName || (product.ageRestriction ? `${product.ageRestriction}+` : ""),
    category,
    img: buildAssetUrl(product.image) || placeholderImg,
  };
};

export default function Concert() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterOptions, setFilterOptions] = useState(() => ["All", ...new Set(fallbackConcerts.map((c) => c.category).filter(Boolean))]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [bannerImg, setBannerImg] = useState(null);
  const [concerts, setConcerts] = useState(fallbackConcerts);

  const filteredConcerts = concerts.filter(
    (concert) =>
      (filter === "All" || concert.category === filter) &&
      concert.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then((list) => {
        if (!active || !list.length) return;
        const allowed = ["concert", "music", "live"];
        const filtered = filterProductsByCategory(list, allowed);
        const source = filtered.length ? filtered : list;
        const mapped = source.map(mapProductToCard).filter((p) => p.img || p.title);
        if (mapped.length) {
          setConcerts(mapped);
          const nextFilters = ["All", ...new Set(mapped.map((item) => item.category).filter(Boolean))];
          setFilterOptions(nextFilters);
          if (!nextFilters.includes(filter)) setFilter("All");
        }
      })
      .catch(() => {});

    // Fetch banner image from API
    fetch("http://localhost:5149/api/SettingGetAll")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBannerImg(data[0].bannerImg); // assuming bannerImg is the field for concert banner
        }
      })
      .catch((err) => console.error(err));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="concertt-page">
      {/* Banner */}
      <section
        className="concertt-banner"
        style={{
          background: bannerImg
            ? `url('${bannerImg}') center center / cover no-repeat`
            : "url('../assets/images/hello.jpg') center center / cover no-repeat"
        }}
      >
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Concert</h1>
            <nav className="breadcrumb-navv">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Concert</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker />

      {/* Search & Filter */}
      <section className="concerts-section">
        <div className="concerts-controls">
          <input
            type="text"
            placeholder="Search concerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            {filterOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Concert Grid */}
        <div className="concerts-grid">
          {filteredConcerts.length === 0 ? (
            <div className="not-found">
              <h2>Not Found</h2>
              <p>We couldn’t find any concerts matching your search.</p>
            </div>
          ) : (
            filteredConcerts.map((concert, i) => (
              <div
                className={`concert-card ${hoveredCard === i ? "hovered" : ""}`}
                key={concert.id}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link to={`/event/concertdetail/${concert.id}`} className="concert-link">
                  <div className="concert-card-inner">
                    <div className="concert-card-image-container">
                      <img src={concert.img} alt={concert.title} className="concert-card-image" />
                      <div className="concert-card-gradient" />
                      <span className="concert-category">{concert.category}</span>

                      <div className="concert-card-overlay-contentt">
                        <h3 className="concert-card-title">{concert.title}</h3>
                        <div className="concert-card-meta">
                          <span>{concert.date}</span> • <span>{concert.location}</span>
                        </div>
                        <p className="price">{concert.price}</p>
                      </div>

                      <Link to={`/event/concertdetail/${concert.id}`} className="info-btn" style={{ color: "red" }}>
                        <Info size={12} /> Info
                      </Link>
                    </div>
                  </div>
                </Link>
                {hoveredCard === i && <div className="concert-card-glow" />}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
