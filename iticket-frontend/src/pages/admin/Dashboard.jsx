import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

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

          <NavLink to="/admin/tickets" className="menu-btn">
            Experience
          </NavLink>

          <NavLink to="/admin/statistics" className="menu-btn">
            Statistics
          </NavLink>

          <NavLink to="/admin/settings" className="menu-btn">
            Settings
          </NavLink>
        </nav>
      </aside>

    
      <main className="admin-main">
        <div className="admin-header">
         

          
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
