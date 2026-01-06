import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

import {
  faSearch,
  faUser,
  faPlay,
  faBookmark,
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

const slides = [
  {
    id: 1,
    title: "Dua Lipa Live Concert",
    subtitle: "MUSIC CONCERT",
    description: "Experience an unforgettable night with Dua Lipa performing her greatest hits live on stage.",
    image: "src/assets/images/Dua.jpg"
  },
  {
    id: 2,
    title: "Romeo & Juliet",
    subtitle: "THEATER DRAMA",
    description: "A timeless Shakespearean masterpiece brought to life with powerful acting and emotional storytelling.",
    image: "src/assets/images/Romeo.jpg"
  },
  {
    id: 3,
    title: "Volleyball Championship",
    subtitle: "SPORTS EVENT",
    description: "Watch top teams battle it out in an intense volleyball match filled with energy and excitement.",
    image: "src/assets/images/Vole.jpg"
  },
];

const movieThumbnails = [
  { id: 1, image: "src/assets/images/Dua.jpg" },
  { id: 2, image: "src/assets/images/Romeo.jpg" },
  { id: 3, image: "src/assets/images/Vole.jpg" },
];

function Layout({ children }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openUserPanel, setOpenUserPanel] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="layout">
      {/* Navbar */}
      <nav className={`navbar streamlab-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-left">
          <Link to="/" className="logo">
            <span className="logo-icon">▶</span>
            <span className="logo-moon">MOON</span>
            <span className="accent">TICKET</span>
          </Link>

          <ul className="nav-links">
            {/* Events Dropdown */}

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
          {/* <button className="subscribe-btn">SUBSCRIBE</button> */}
          {/* <Link to="/contact" className="subscribe-btn " >SUBSCRIBE</Link> */}
          <Link to="/contact">
            <button className="subscribe-btn">SUBSCRIBE</button>
          </Link>

        </div>
      </nav>

      {/* User Panel */}
      <div className={`overlay ${openUserPanel ? "show" : ""}`} onClick={() => setOpenUserPanel(false)}></div>
      <div className={`drawer ${openUserPanel ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpenUserPanel(false)}>✕</button>
        <div className="drawer-links">
          <Link to="/signup" className="drawer-linkk" onClick={() => setOpenUserPanel(false)}>Register</Link>
          <span className="slash">/</span>
          <Link to="/signin" className="drawer-link" onClick={() => setOpenUserPanel(false)}>Login</Link>
        </div>
      </div>

      {/* Hero Slider */}
      {location.pathname === "/" && (
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <div className="hover-zoom hero-text">
                  <span className="hero-category">{slide.subtitle}</span>
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-description">{slide.description}</p>
                  <div className="hero-actions">
                    <button className="play-btnn"><FontAwesomeIcon icon={faTicketAlt} />BUY TICKET</button>
                    <button className="watchlater-btn"><FontAwesomeIcon icon={faInfoCircle} /> MORE INFO</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="thumbnails-carousel">
            <button className="carousel-btn prev" onClick={prevSlide}><FontAwesomeIcon icon={faChevronLeft} /></button>
            <div className="thumbnails-container">
              {movieThumbnails.map((movie, index) => (
                <div
                  key={movie.id}
                  className={`thumbnail ${index === currentSlide ? "active" : ""}`}
                  style={{ backgroundImage: `url(${movie.image})` }}
                  onClick={() => setCurrentSlide(index)}
                ></div>
              ))}
            </div>
            <button className="carousel-btn next" onClick={nextSlide}><FontAwesomeIcon icon={faChevronRight} /></button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">▶</span> MOON<span className="accent">TICKET</span>
            </div>
            <p className="footer-description">Discover and book the best events with MoonTicket.</p>
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
          <p>© 2025 MoonTicket — Owned and developed by Aydan. All rights reserved.</p>
        </div>
        <button className="scroll-top-btn" onClick={scrollToTop}><FontAwesomeIcon icon={faChevronUp} /></button>
      </footer>
    </div>
  );
}

export default Layout;
