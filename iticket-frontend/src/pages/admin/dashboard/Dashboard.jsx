import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dropdown açıq/bağlıq state-ləri
  const [productsOpen, setProductsOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);

  const productsRef = useRef(null);
  const newsRef = useRef(null);

  // Çöldə klik edəndə dropdown bağlanması
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
      if (newsRef.current && !newsRef.current.contains(e.target)) {
        setNewsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2 className="logoo" onClick={() => navigate("/")}>
          <span className="moon">Moon</span>
          <span className="ticket">Ticket</span>
        </h2>

        <nav className="admin-menu">
          <NavLink to="/admin/dashboard" end className="menu-btn">
            Dashboard
          </NavLink>

          <NavLink to="/admin/slider/sliderIndex" className="menu-btn">
            Sliders
          </NavLink>

          <NavLink to="/admin/setting/settingIndex" className="menu-btn">
            Settings
          </NavLink>

          {/* NEWS DROPDOWN */}
          <div className="dropdown" ref={newsRef}>
            <div className="menu-btn news-btn">
              <span
                className="news-link"
                onClick={(e) => {
                  e.stopPropagation();
                  setNewsOpen((prev) => !prev);
                }}
                style={{ cursor: "pointer", color: "white" }}
              >
                News
              </span>
              <span
                className={`menu-icon ${newsOpen ? "rotate" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setNewsOpen((prev) => !prev);
                }}
              >
                ☰
              </span>
            </div>
            {newsOpen && (
              <div className="dropdown-content">
                <NavLink
                  to="/admin/news/newsIndex"
                  className="dropdown-item"
                >
                  All News
                </NavLink>
                <NavLink
                  to="/admin/newsauthor/newsAuthorIndex"
                  className="dropdown-item"
                >
                  News Authors
                </NavLink>
              </div>
            )}
          </div>

          {/* PRODUCTS DROPDOWN */}
          <div className="dropdown" ref={productsRef}>
            <div className="menu-btn products-btn">
              <NavLink
                to="/admin/product/productIndex"
                className="products-link"
                style={{ color: "white" }}
              >
                Products
              </NavLink>
              <span
                className={`menu-icon ${productsOpen ? "rotate" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setProductsOpen((prev) => !prev);
                }}
              >
                ☰
              </span>
            </div>
            {productsOpen && (
              <div className="dropdown-content">
                <NavLink
                  to="/admin/category/categoryIndex"
                  className="dropdown-item"
                >
                  Category
                </NavLink>
                <NavLink
                  to="/admin/person/PersonIndex"
                  className="dropdown-item"
                >
                  Persons
                </NavLink>
                <NavLink
                  to="/admin/language/languageIndex"
                  className="dropdown-item"
                >
                  Languages
                </NavLink>
                <NavLink
                  to="/admin/subcategory/SubCategoryIndex"
                  className="dropdown-item"
                >
                  SubCategories
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/admin/statistics" className="menu-btn">
            Statistics
          </NavLink>

          <NavLink to="/admin/contact/messages" className="menu-btn">
            Contact Messages
          </NavLink>

          <NavLink to="/admin/subscriber/index" className="menu-btn">
            Subscribers
          </NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;