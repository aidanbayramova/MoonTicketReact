import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isProductSectionActive = useMemo(() => {
    return (
      location.pathname.startsWith("/admin/product") ||
      location.pathname.startsWith("/admin/category") ||
      location.pathname.startsWith("/admin/language") ||
      location.pathname.startsWith("/admin/subcategory") ||
      location.pathname.startsWith("/admin/person")
    );
  }, [location.pathname]);

  const [productsOpen, setProductsOpen] = useState(isProductSectionActive);

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

          <div className={`menu-group ${isProductSectionActive ? "active" : ""}`}>
            <button
              type="button"
              className="menu-btn menu-group-toggle"
              onClick={() => setProductsOpen((prev) => !prev)}
            >
              <span>Products</span>
              <span className={`menu-group-arrow ${productsOpen ? "open" : ""}`}>▾</span>
            </button>

            {productsOpen && (
              <div className="menu-submenu">
                <NavLink to="/admin/product/productIndex" className="submenu-btn">
                  Product List
                </NavLink>
                <NavLink to="/admin/category/categoryIndex" className="submenu-btn">
                  Categories
                </NavLink>
                <NavLink to="/admin/language/languageIndex" className="submenu-btn">
                  Languages
                </NavLink>
                <NavLink to="/admin/subcategory/subCategoryIndex" className="submenu-btn">
                  SubCategories
                </NavLink>
                <NavLink to="/admin/person/personIndex" className="submenu-btn">
                  Persons
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/admin/news/newsIndex" className="menu-btn">
            News
          </NavLink>

          <NavLink to="/admin/newsauthor/newsAuthorIndex" className="menu-btn">
            News Authors
          </NavLink>

          <NavLink to="/admin/slider/sliderIndex" className="menu-btn">
            Sliders
          </NavLink>

          <NavLink to="/admin/setting/settingIndex" className="menu-btn">
            Settings
          </NavLink>

          <NavLink to="/admin/contact/messages" className="menu-btn">
            Contact Messages
          </NavLink>

          <NavLink to="/admin/subscriber/index" className="menu-btn">
            Subscribers
          </NavLink>

          <NavLink to="/admin/refund/index" className="menu-btn">
            Refund Requests
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