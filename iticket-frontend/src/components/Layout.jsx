import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBasket } from "../context/BasketContext";
import { fetchProducts } from "../api/products";

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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const removeDiacritics = (value) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const normalizeSearchText = (value) => normalize(removeDiacritics(value));

const levenshteinDistance = (a, b, maxDistance = 2) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;

  let previous = new Array(b.length + 1).fill(0);
  let current = new Array(b.length + 1).fill(0);

  for (let j = 0; j <= b.length; j += 1) previous[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    let rowMin = current[0];

    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost
      );
      rowMin = Math.min(rowMin, current[j]);
    }

    if (rowMin > maxDistance) return maxDistance + 1;

    const temp = previous;
    previous = current;
    current = temp;
  }

  return previous[b.length];
};

const isSubsequence = (query, text) => {
  let queryIndex = 0;
  let textIndex = 0;

  while (queryIndex < query.length && textIndex < text.length) {
    if (query[queryIndex] === text[textIndex]) queryIndex += 1;
    textIndex += 1;
  }

  return queryIndex === query.length;
};

const getSearchScore = (query, title) => {
  if (!query || !title) return -1;

  if (title === query) return 1000;
  if (title.startsWith(query)) return 850 - Math.min(title.length - query.length, 100);
  if (title.includes(query)) return 700;

  const titleWords = title.split(/\s+/).filter(Boolean);
  const queryWords = query.split(/\s+/).filter(Boolean);
  const smallestQueryWord = queryWords.reduce((acc, word) => {
    if (!acc) return word;
    return word.length < acc.length ? word : acc;
  }, "");

  if (smallestQueryWord.length >= 3 && isSubsequence(query, title)) {
    return 560;
  }

  let bestDistance = Number.POSITIVE_INFINITY;
  queryWords.forEach((qWord) => {
    if (qWord.length < 3) return;
    titleWords.forEach((tWord) => {
      const distance = levenshteinDistance(qWord, tWord, 2);
      if (distance < bestDistance) bestDistance = distance;
    });
  });

  if (bestDistance <= 2) {
    return 520 - bestDistance * 60;
  }

  return -1;
};

const getEventRoute = (product) => {
  const text = `${normalize(product?.categoryName)} ${normalize(product?.subCategoryName)}`;
  if (text.includes("concert") || text.includes("music") || text.includes("live")) {
    return `/event/concertdetail/${product.id}`;
  }
  if (text.includes("theater") || text.includes("theatre") || text.includes("drama") || text.includes("play") || text.includes("musical")) {
    return `/event/theaterdetail/${product.id}`;
  }
  if (text.includes("kid") || text.includes("child") || text.includes("family")) {
    return `/event/kidsdetail/${product.id}`;
  }
  if (text.includes("sport") || text.includes("football") || text.includes("basketball") || text.includes("tennis")) {
    return `/event/sportdetail/${product.id}`;
  }
  if (text.includes("museum") || text.includes("history") || text.includes("exhibit") || text.includes("gallery")) {
    return `/event/museumdetail/${product.id}`;
  }
  if (text.includes("circus") || text.includes("acrobat") || text.includes("clown")) {
    return `/event/circusdetail/${product.id}`;
  }
  if (text.includes("tour") || text.includes("travel") || text.includes("trip") || text.includes("adventure")) {
    return `/event/tourismdetail/${product.id}`;
  }
  if (text.includes("movie") || text.includes("cinema") || text.includes("film")) {
    return `/event/cinema/${product.id}`;
  }
  return "";
};

const toAbsoluteUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

function Layout({ children }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useBasket();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openUserPanel, setOpenUserPanel] = useState(false);
  const [setting, setSetting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const location = useLocation();

  const searchResults = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    if (!query) return [];

    return allProducts
      .map((product) => {
        const title = normalizeSearchText(product?.name);
        return {
          product,
          score: getSearchScore(query, title),
        };
      })
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.product);
  }, [allProducts, searchQuery]);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/SliderGetAll`);
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
        const res = await fetch(`${API_BASE}/api/SettingGetById/1`);
        if (!res.ok) throw new Error("Setting load error");
        const data = await res.json();
        setSetting(data);

        const bannerUrl = toAbsoluteUrl(data?.bannerImg);
        if (bannerUrl) {
          document.documentElement.style.setProperty("--global-banner-image", `url('${bannerUrl}')`);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSetting();

    return () => {
      document.documentElement.style.removeProperty("--global-banner-image");
    };
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

  useEffect(() => {
    let isMounted = true;
    setIsSearchLoading(true);

    fetchProducts()
      .then((products) => {
        if (!isMounted) return;
        setAllProducts(Array.isArray(products) ? products : []);
      })
      .catch(() => {
        if (!isMounted) return;
        setAllProducts([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsSearchLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setActiveSearchIndex(-1);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const goToEvent = (product) => {
    const route = getEventRoute(product);
    if (!route) return;

    setSearchQuery(product?.name || "");
    setIsSearchOpen(false);
    setActiveSearchIndex(-1);
    navigate(route);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchResults.length) return;

    const selected =
      activeSearchIndex >= 0 && activeSearchIndex < searchResults.length
        ? searchResults[activeSearchIndex]
        : searchResults[0];

    goToEvent(selected);
  };

  const handleSearchKeyDown = (event) => {
    if (!searchResults.length && event.key !== "Escape") return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsSearchOpen(true);
      setActiveSearchIndex((prev) => (prev + 1) % searchResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsSearchOpen(true);
      setActiveSearchIndex((prev) => {
        if (prev <= 0) return searchResults.length - 1;
        return prev - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      handleSearchSubmit(event);
      return;
    }

    if (event.key === "Escape") {
      setIsSearchOpen(false);
      setActiveSearchIndex(-1);
    }
  };

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
                {/* MOON part */}
                <span className="logo-moon">{setting.websiteName.split(" ")[0]}</span>
                {/* TICKET part */}
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
          <form className="search-container" onSubmit={handleSearchSubmit} ref={searchRef}>
            <input
              type="text"
              className="search"
              placeholder="Search event name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(Boolean(e.target.value.trim()));
                setActiveSearchIndex(-1);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsSearchOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              autoComplete="off"
            />
            <button type="submit" className="search-btn" aria-label="Search events">
              <FontAwesomeIcon icon={faSearch} />
            </button>

            {isSearchOpen && searchQuery.trim() && (
              <div className="search-dropdown" role="listbox">
                {isSearchLoading ? (
                  <div className="search-empty-state">Loading events...</div>
                ) : searchResults.length ? (
                  searchResults.map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      className={`search-result-item ${activeSearchIndex === index ? "active" : ""}`}
                      onClick={() => goToEvent(product)}
                    >
                      <span className="search-result-title">{product.name}</span>
                      <span className="search-result-meta">
                        {[product.categoryName, product.subCategoryName].filter(Boolean).join(" • ") || "Event"}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="search-empty-state">No event found for this name.</div>
                )}
              </div>
            )}
          </form>
          <button className="icon-btn" onClick={() => setOpenUserPanel(true)} title={isAuthenticated ? user?.fullName : "Account"}>
            <FontAwesomeIcon icon={faUser} />
          </button>
          <Link to="/basket" className="icon-btn" title="Basket">
            <FontAwesomeIcon icon={faShoppingCart} />
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
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
          {isAuthenticated ? (
            <>
              <span className="drawer-role">{(user?.roles?.[0] || "member")}</span>
              <Link to="/profile" onClick={() => setOpenUserPanel(false)}>My Profile</Link>
              <span>/</span>
              <button
                type="button"
                className="drawer-logout-btn"
                onClick={() => {
                  logout();
                  setOpenUserPanel(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" onClick={() => setOpenUserPanel(false)}>Register</Link>
              <span>/</span>
              <Link to="/signin" onClick={() => setOpenUserPanel(false)}>Login</Link>
            </>
          )}
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
                // backgroundImage: `url(${slide.image})`
                // If image is relative path:
                backgroundImage: `url(${toAbsoluteUrl(slide.image)})`
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
                  style={{ backgroundImage: `url(${toAbsoluteUrl(slide.image)})`}}
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