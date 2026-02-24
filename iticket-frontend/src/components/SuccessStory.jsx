import React, { useEffect, useState } from "react";
import "./SuccessStory.css";

const statsData = [
  { number: 300, label: "Daily Visitors" },
  { number: 50, label: "Delicious Creations" },
  { number: 220, label: "Memorable Events" },
  { number: 700, label: "Happy Customers" },
];

const SuccessStory = () => {
  const [counts, setCounts] = useState(statsData.map(() => 0));

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
  }, []);

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
