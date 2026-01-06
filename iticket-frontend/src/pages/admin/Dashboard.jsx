import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="logoo" onClick={() => navigate("/")}>
          <span className="moon">Moon</span>
          <span className="ticket">Ticket</span>
        </h2>

        <nav className="admin-menu">
          <button className="active">Dashboard</button>
          <button>Events</button>
          <button>Tickets</button>
          <button>Statistics</button>
          <button>Settings</button>
        </nav>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Welcome back</h1>
            <p className="subtitle">MoonTicket Admin Dashboard</p>
          </div>
          <button className="create-btn">+ Create Event</button>
        </div>

        <div className="info-cards">
          <div className="info-card highlight">
            <h3>Total Tickets Sold</h3>
            <span className="big-number">12,480</span>
            <p>This month</p>
          </div>

          <div className="info-card">
            <h3>Weekly Sales</h3>
            <div className="chart-placeholder"></div>
          </div>

          <div className="info-card">
            <h3>Monthly Growth</h3>
            <div className="progress-circle">+28%</div>
          </div>
        </div>

        <div className="tasks-section">
          <div className="task-card">
            <h4>Concert approval</h4>
            <span>Today</span>
          </div>

          <div className="task-card">
            <h4>Update pricing</h4>
            <span>Tomorrow</span>
          </div>

          <div className="task-card add-task">+ Add new task</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
