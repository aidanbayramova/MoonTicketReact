import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, ToastContainer } from "../../../components/admin/Toast";
import { AdminButton } from "../../../components/admin/AdminButton";
import "./DashboardHome.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const DashboardHome = () => {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalNews: 0,
    totalSubscribers: 0,
    totalMessages: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, newsRes, subscribersRes, messagesRes] =
          await Promise.all([
            fetch(`${API_BASE}/api/ProductGetAll`),
            fetch(`${API_BASE}/api/CategoryGetAll`),
            fetch(`${API_BASE}/api/NewsGetAll`),
            fetch(`${API_BASE}/api/SubscriberGetAll`),
            fetch(`${API_BASE}/api/ContactMessageGetAll`),
          ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const newsData = await newsRes.json();
        const subscribersData = await subscribersRes.json();
        const messagesData = await messagesRes.json();

        setStats({
          totalProducts: Array.isArray(productsData) ? productsData.length : 0,
          totalCategories: Array.isArray(categoriesData) ? categoriesData.length : 0,
          totalNews: Array.isArray(newsData) ? newsData.length : 0,
          totalSubscribers: Array.isArray(subscribersData) ? subscribersData.length : 0,
          totalMessages: Array.isArray(messagesData) ? messagesData.length : 0,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        showToast("Failed to load statistics", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon, label, value, color, action }) => (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{loading ? "-" : value}</div>
      {action && (
        <AdminButton
          variant="secondary"
          size="sm"
          onClick={action}
          style={{ marginTop: "12px" }}
        >
          View All
        </AdminButton>
      )}
    </div>
  );

  return (
    <div className="dashboard-home">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <div className="dashboard-header">
        <div>
          <h1>Welcome to Admin Panel</h1>
          <p className="subtitle">
            Manage your content, products, and more from here
          </p>
        </div>
        <div className="header-actions">
          <AdminButton
            variant="primary"
            onClick={() => navigate("/admin/product/createProductForm")}
          >
            + New Product
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={() => navigate("/admin/category/createCategoryForm")}
          >
            + New Category
          </AdminButton>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="📊"
          label="Total Products"
          value={stats.totalProducts}
          color="blue"
          action={() => navigate("/admin/product/productIndex")}
        />
        <StatCard
          icon="🏷️"
          label="Total Categories"
          value={stats.totalCategories}
          color="purple"
          action={() => navigate("/admin/category/categoryIndex")}
        />
        <StatCard
          icon="📰"
          label="Total News"
          value={stats.totalNews}
          color="green"
          action={() => navigate("/admin/news/newsIndex")}
        />
        <StatCard
          icon="👥"
          label="Total Subscribers"
          value={stats.totalSubscribers}
          color="orange"
          action={() => navigate("/admin/subscriber/index")}
        />
        <StatCard
          icon="💬"
          label="Contact Messages"
          value={stats.totalMessages}
          color="red"
          action={() => navigate("/admin/contact/messages")}
        />
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <div className="action-item">
            <h3>📦 Products</h3>
            <p>Manage all products and their details</p>
            <AdminButton
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => navigate("/admin/product/productIndex")}
            >
              Go to Products
            </AdminButton>
          </div>

          <div className="action-item">
            <h3>🎬 Sliders</h3>
            <p>Edit homepage sliders and banners</p>
            <AdminButton
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => navigate("/admin/slider/sliderIndex")}
            >
              Go to Sliders
            </AdminButton>
          </div>

          <div className="action-item">
            <h3>⚙️ Settings</h3>
            <p>Configure site settings and preferences</p>
            <AdminButton
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => navigate("/admin/setting/settingIndex")}
            >
              Go to Settings
            </AdminButton>
          </div>

          <div className="action-item">
            <h3>📧 Contact Messages</h3>
            <p>View and respond to user messages</p>
            <AdminButton
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => navigate("/admin/contact/messages")}
            >
              View Messages
            </AdminButton>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <div className="info-box">
          <h3>💡 Tips & Tricks</h3>
          <ul>
            <li>Use Create buttons to quickly add new content</li>
            <li>Delete actions require confirmation for safety</li>
            <li>All changes are saved immediately</li>
            <li>Check Statistics for detailed analytics</li>
          </ul>
        </div>

        <div className="info-box">
          <h3>🚀 Recent Updates</h3>
          <ul>
            <li>Improved admin panel design</li>
            <li>Better notification system</li>
            <li>Unified button styles</li>
            <li>Enhanced delete confirmations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
