import React, { useState, useEffect } from "react";
import "./ScrollingTicker.css";

export default function ScrollingTitle() {
  const [websiteName, setWebsiteName] = useState("• Loading...");

  useEffect(() => {
    fetch("https://localhost:7204/api/SettingGetAll")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setWebsiteName("• " + data[0].websiteName); 
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  return (
    <div className="scrolling-title-container">
      <div className="scroll-gradient">
        <div className="scroll-wrapper">
          {Array(30).fill(websiteName).map((t, i) => (
            <span key={i}>{t}</span>
          ))}
          {Array(30).fill(websiteName).map((t, i) => (
            <span key={i + 100}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
