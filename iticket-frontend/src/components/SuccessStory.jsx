import React, { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "../api/products";
import "./SuccessStory.css";

const METRICS_KEY = "moonTicket.metrics";

const defaultStats = [
  { number: 10000, label: "Tickets Sold" },
  { number: 250, label: "Events Hosted" },
  { number: 50, label: "Trusted Partners" },
  { number: 8000, label: "Happy Customers" },
];

const SuccessStory = () => {
  const [statsData, setStatsData] = useState(defaultStats);
  const [counts, setCounts] = useState(defaultStats.map(() => 0));

  useEffect(() => {
    let active = true;

    Promise.all([fetchProducts(), fetchCategories()])
      .then(([products, categories]) => {
        if (!active) return;

        const metricsRaw = localStorage.getItem(METRICS_KEY);
        const metrics = metricsRaw
          ? JSON.parse(metricsRaw)
          : { orders: 0, ticketsSold: 0 };

        const ticketsSold = Math.max(10000, 10000 + (Number(metrics.ticketsSold) || 0));
        const eventsHosted = Math.max(250, (products?.length || 0) + 200);
        const trustedPartners = Math.max(50, (categories?.length || 0) * 5);
        const happyCustomers = Math.max(8000, 8000 + (Number(metrics.orders) || 0));

        setStatsData([
          { number: ticketsSold, label: "Tickets Sold" },
          { number: eventsHosted, label: "Events Hosted" },
          { number: trustedPartners, label: "Trusted Partners" },
          { number: happyCustomers, label: "Happy Customers" },
        ]);
      })
      .catch(() => {
        if (!active) return;
        setStatsData(defaultStats);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const duration = 9000; 
    const frameRate = 20;  
    const totalFrames = Math.round((duration / 1000) * frameRate);

    const counters = statsData.map((stat) => {
      const increment = stat.number / totalFrames;
      return { current: 0, increment, target: stat.number };
    });

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setCounts((prevCounts) =>
        prevCounts.map((count, i) => {
          const newCount = Math.min(
            counters[i].current + counters[i].increment,
            counters[i].target
          );
          counters[i].current = newCount;
          return Math.floor(newCount);
        })
      );

      if (frame >= totalFrames) clearInterval(interval);
    }, duration / totalFrames);

    return () => clearInterval(interval);
  }, [statsData]);

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
