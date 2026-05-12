import React, { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api/products";
import "./SuccessStory.css";

const METRICS_KEY = "moonTicket.metrics";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";
const METRICS_EVENT = "moonTicket:metrics-updated";

const defaultStats = [
  { number: 0, label: "Tickets Sold" },
  { number: 0, label: "Events Hosted" },
  { number: 0, label: "Trusted Partners" },
  { number: 0, label: "Happy Customers" },
];

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const fetchCount = async (endpoint, { activeOnly = false } = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) return 0;

    const data = await res.json();
    if (!Array.isArray(data)) return 0;
    if (!activeOnly) return data.length;

    return data.filter((item) => item?.isActive ?? item?.IsActive).length;
  } catch {
    return 0;
  }
};

const SuccessStory = () => {
  const [statsData, setStatsData] = useState(defaultStats);
  const [counts, setCounts] = useState(defaultStats.map(() => 0));

  const targets = useMemo(() => statsData.map((x) => toNumber(x.number)), [statsData]);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      const [products, partnersCount, subscribersCount] = await Promise.all([
        fetchProducts({ force: true }),
        fetchCount("/api/PersonGetAll"),
        fetchCount("/api/SubscriberGetAll", { activeOnly: true }),
      ]);

      const metricsRaw = localStorage.getItem(METRICS_KEY);
      const metrics = metricsRaw
        ? JSON.parse(metricsRaw)
        : { orders: 0, ticketsSold: 0, totalRevenue: 0 };

      if (!active) return;

      setStatsData([
        { number: toNumber(metrics.ticketsSold), label: "Tickets Sold" },
        { number: toNumber(products?.length), label: "Events Hosted" },
        { number: toNumber(partnersCount), label: "Trusted Partners" },
        { number: toNumber(subscribersCount), label: "Happy Customers" },
      ]);
    };

    loadStats();
    const pollId = window.setInterval(loadStats, 15000);

    const onMetricsUpdated = () => loadStats();
    window.addEventListener(METRICS_EVENT, onMetricsUpdated);

    return () => {
      active = false;
      window.clearInterval(pollId);
      window.removeEventListener(METRICS_EVENT, onMetricsUpdated);
    };
  }, []);

  useEffect(() => {
    const duration = 700;
    const frameRate = 30;
    const totalFrames = Math.max(1, Math.round((duration / 1000) * frameRate));

    const starts = [...counts];
    let frame = 0;

    const interval = setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / totalFrames);

      setCounts(
        starts.map((start, i) => Math.round(start + (targets[i] - start) * progress))
      );

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, duration / totalFrames);

    return () => clearInterval(interval);
  }, [targets]);

  return (
    <section className="success-story">
      <div className="overlay"></div>
      <div className="container">
        <h2 className="title">Our Success Story</h2>
        <p className="subtitle"></p>
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3 className="stat-number">{counts[index]}+</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStory;
