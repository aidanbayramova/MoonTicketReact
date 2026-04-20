import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dropdown open/close states
  const [productsOpen, setProductsOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);

  const productsRef = useRef(null);
  const newsRef = useRef(null);

  // Close dropdown when clicking outside
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

          <NavLink to="/admin/reservation/index" className="menu-btn">
            Reservations
          </NavLink>

          {/* NEWS DROPDOWN - ONLY DETAIL & EDIT */}
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
                  to="/admin/news/detailNews/1"
                  className="dropdown-item"
                >
                  View News
                </NavLink>
                <NavLink
                  to="/admin/newsauthor/detailNewsAuthor/1"
                  className="dropdown-item"
                >
                  View Authors
                </NavLink>
              </div>
            )}
          </div>

          {/* PRODUCTS DROPDOWN - ONLY DETAIL & EDIT */}
          <div className="dropdown" ref={productsRef}>
            <div className="menu-btn products-btn">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setProductsOpen((prev) => !prev);
                }}
                style={{ cursor: "pointer", color: "white" }}
              >
                Products
              </span>
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
                  to="/admin/product/detailProduct/1"
                  className="dropdown-item"
                >
                  View Product
                </NavLink>
                <NavLink
                  to="/admin/setting/settingDetail/1"
                  className="dropdown-item"
                >
                  Settings
                </NavLink>
              </div>
            )}
          </div>

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