import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Çöldə klik edəndə bağlanmaq demekdi buu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSettingsOpen(false);
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

          {/* PRODUCTS DROPDOWN */}
          <div className="dropdown" ref={dropdownRef}>
            <div className="menu-btn products-btn" >
              <NavLink
                to="/admin/product/productIndex"
                className="products-link"style={{color:"white ",}}
              >
                Products
              </NavLink>

              <span
                className={`menu-icon ${settingsOpen ? "rotate" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSettingsOpen((prev) => !prev);
                }}
              >
                ☰
              </span>
            </div>

            {settingsOpen && (
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
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;