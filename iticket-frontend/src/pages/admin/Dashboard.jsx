import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

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

          {/* Settings Dropdown */}
          <div className="dropdown" >
            <button
              className="menu-btn"
              style={{
                background: "linear-gradient(135deg, rgba(77, 8, 8, 0.9), rgba(44,3,3,0.9))",width:"187px",height:"50px",marginLeft:"10px"
              }}
              onClick={() => setSettingsOpen(prev => !prev)}
            >
              Products
            </button>
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
              </div>
            )}
          </div>

          <NavLink to="/admin/statistics" className="menu-btn">
            Statistics
          </NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-header"></div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;