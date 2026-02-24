import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import "./Concert.css";
import ScrollingTicker from "../components/ScrollingTicker";
import c3Img from "../assets/images/c3.jpg";
import Lipa from "../assets/images/c2.jpg";
import Billie from "../assets/images/c1.jpg";
import Dragon from "../assets/images/c4.jpg";
import EdSheeran from "../assets/images/Ed Sheeran.jpg";
import Adele from "../assets/images/Adele.jpg";
import ZaraLarsson from "../assets/images/Zara Larsson.jpg";
import ABBA from "../assets/images/ABBA.jpg";
import Coldplay from "../assets/images/Coldplay.jpg";

const concertsData = [
  { id: 1, title: "Dua Lipa Concert", date: "2025-09-20", location: "London, Wembley ", price: "80-300 EUR", img: Lipa, category: "Pop" },
  { id: 2, title: "Shakira World Tour", date: "2025-10-05", location: "Berlin, Mercedes-Benz ", price: "70-250 EUR", img: c3Img, category: "Rock" },
  { id: 3, title: "Billie Eilish Concert", date: "2025-11-12", location: "Paris, Accor Arena", price: "60-220 EUR", img: Billie, category: "Pop" },
  { id: 4, title: "Ed Sheeran Live", date: "2025-12-01", location: "Madrid, Santiago  ", price: "75-280 EUR", img: EdSheeran, category: "Pop" },
  { id: 5, title: "ABBA Concert", date: "2025-09-20", location: "London, Wembley ", price: "80-300 EUR", img: ABBA, category: "Jazz" },
  { id: 6, title: "Adele Tour", date: "2025-10-05", location: "Berlin, Mercedes-Benz ", price: "70-250 EUR", img: Adele, category: "Rock" },
  { id: 7, title: "Zara Larsson Concert", date: "2025-11-12", location: "Paris, Accor Arena", price: "60-220 EUR", img: ZaraLarsson, category: "Pop" },
  { id: 8, title: "Coldplay Live", date: "2025-12-01", location: "Madrid, Santiago  ", price: "75-280 EUR", img: Coldplay, category: "Jazz" },
];

export default function Concert() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [bannerImg, setBannerImg] = useState(null);

  const filteredConcerts = concertsData.filter(
    (concert) =>
      (filter === "All" || concert.category === filter) &&
      concert.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    // Fetch banner image from API
    fetch("https://localhost:7204/api/SettingGetAll")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBannerImg(data[0].bannerImg); // assuming bannerImg is the field for concert banner
        }
      })
      .catch((err) => console.error(err));
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
            <option value="All">All</option>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Jazz">Jazz</option>
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
                <Link to={`/concert/${concert.id}`} className="concert-link">
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
