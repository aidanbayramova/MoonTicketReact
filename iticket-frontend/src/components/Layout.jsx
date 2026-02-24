import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

import {
  faSearch,
  faUser,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faTicketAlt,
  faInfoCircle,
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons";

import {
  faFacebook,
  faInstagram,
  faSkype,
} from "@fortawesome/free-brands-svg-icons";

import "./Layout.css";

function Layout({ children }) {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openUserPanel, setOpenUserPanel] = useState(false);
  const [setting, setSetting] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch("https://localhost:7204/api/SliderGetAll");
        let data = await res.json();

        if (!Array.isArray(data)) data = [];

        data.sort((a, b) => b.id - a.id);
        const last3 = data.slice(0, 3);

        setSlides(last3);
      } catch (err) {
        console.error("Slider load error:", err);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch("https://localhost:7204/api/SettingGetById/1");
        if (!res.ok) throw new Error("Setting load error");
        const data = await res.json();
        setSetting(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSetting();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="layout">
      {/* ================= NAVBAR ================= */}
      <nav className={`navbar streamlab-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-left">
          <Link to="/" className="logo">
            <span className="logo-icon">▶</span>
            {setting?.websiteName ? (
              <>
                {/* MOON hissəsi */}
                <span className="logo-moon">{setting.websiteName.split(" ")[0]}</span>
                {/* TICKET hissəsi */}
                <span className="accent">{setting.websiteName.split(" ")[1] ?? ""}</span>
              </>
            ) : (
              <>
                <span className="logo-moon">MOON</span>
                <span className="accent">TICKET</span>
              </>
            )}
          </Link>

          <ul className="nav-links">
            <li><Link to="/" className="active">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li className="dropdown">
              <a
                href="#"
                className="dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  const dropdown = e.currentTarget.nextElementSibling;
                  dropdown.classList.toggle("show");
                }}
              >
                Events <span className="dropdown-arrow">▾</span>
              </a>
              <div className="dropdown-menu-animated">
                <Link to="/event/concert" className="dropdown-item">Concert</Link>
                <Link to="/event/theater" className="dropdown-item">Theater</Link>
                <Link to="/event/kids" className="dropdown-item">Kids</Link>
                <Link to="/event/sport" className="dropdown-item">Sports</Link>
                <Link to="/event/movie" className="dropdown-item">Movie</Link>
                <Link to="/event/museum" className="dropdown-item">Museum</Link>
                <Link to="/event/circus" className="dropdown-item">Circus</Link>
                <Link to="/event/tourism" className="dropdown-item">Tourism</Link>
              </div>
            </li>
          </ul>
        </div>

        <div className="nav-right">
          <div className="search-container">
            <input type="text" className="search" placeholder="Search ..." />
            <button className="search-btn"><FontAwesomeIcon icon={faSearch} /></button>
          </div>
          <button className="icon-btn" onClick={() => setOpenUserPanel(true)}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <button className="icon-btn">
            <FontAwesomeIcon icon={faShoppingCart} />
          </button>
          <Link to="/contact">
            <button className="subscribe-btn">SUBSCRIBE</button>
          </Link>
        </div>
      </nav>

      {/* ================= USER PANEL ================= */}
      <div
        className={`overlay ${openUserPanel ? "show" : ""}`}
        onClick={() => setOpenUserPanel(false)}
      ></div>

      <div className={`drawer ${openUserPanel ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpenUserPanel(false)}>✕</button>
        <div className="drawer-links">
          <Link to="/signup" onClick={() => setOpenUserPanel(false)}>Register</Link>
          <span>/</span>
          <Link to="/signin" onClick={() => setOpenUserPanel(false)}>Login</Link>
        </div>
      </div>

      {/* ================= HERO SLIDER ================= */}
      {location.pathname === "/" && slides.length > 0 && (
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{
                backgroundImage: `url(${slide.image})`
                // əgər image relative-dirsə:
                // backgroundImage: `url(https://localhost:7204/${slide.image})`
              }}
            >
              <div className="hero-overlay"></div>

              <div className="hero-content">
                <div className="hero-text hover-zoom">
                  <span className="hero-category">{slide.subTitle}</span>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-description">{slide.desc}</p>

                  <div className="hero-actions">
                    <button className="play-btnn">
                      <FontAwesomeIcon icon={faTicketAlt} /> BUY TICKET
                    </button>
                    <button className="watchlater-btn">
                      <FontAwesomeIcon icon={faInfoCircle} /> MORE INFO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="thumbnails-carousel">
            <button className="carousel-btn prev" onClick={prevSlide}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div className="thumbnails-container">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`thumbnail ${index === currentSlide ? "active" : ""}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                  onClick={() => setCurrentSlide(index)}
                ></div>
              ))}
            </div>

            <button className="carousel-btn next" onClick={nextSlide}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">▶</span>{" "}
              {setting?.websiteName ? (
                <>
                  <span className="logo-moon">{setting.websiteName.split(" ")[0]}</span>{" "}
                  <span className="accent">{setting.websiteName.split(" ")[1] ?? "TICKET"}</span>
                </>
              ) : (
                <>
                  <span className="logo-moon">MOON</span>{" "}
                  <span className="accent">TICKET</span>
                </>
              )}

            </div>
            <p className="footer-description">{setting?.footerDesc ?? "Discover and book the best events with MoonTicket."}</p>
            <div className="social-icons">
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faSkype} /></a>
            </div>
          </div>

          <div className="common">
            <div className="footer-section">
              <h3>Main</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div className="footer-sectionn">
              <h3>Events</h3><br />
              <ul className="footer-linkss">
                <li><Link to="/event/concert">Concert</Link></li>
                <li><Link to="/event/theater">Theater</Link></li>
                <li><Link to="/event/kids">Kids</Link></li>
                <li><Link to="/event/sports">Sports</Link></li>
                <li><Link to="/event/movie">Movie</Link></li>
                <li><Link to="/event/museum">Museum</Link></li>
                <li><Link to="/event/circus">Circus</Link></li>
                <li><Link to="/event/tourism">Tourism</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Support</h3>
              <ul className="footer-links">
                <li><Link to="#">Subscribe</Link></li>
                <li><Link to="#">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 {setting?.websiteName ?? "MoonTicket"} — Owned and developed by Aydan. All rights reserved.</p>
        </div>
        <button className="scroll-top-btn" onClick={scrollToTop}><FontAwesomeIcon icon={faChevronUp} /></button>
      </footer>
    </div>
  );
}

export default Layout;