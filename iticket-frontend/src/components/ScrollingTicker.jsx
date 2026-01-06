import React from "react";
import "./ScrollingTicker.css";

export default function ScrollingTitle() {
  const text = "• MoonTicket";

  return (
    <div className="scrolling-title-container">
      <div className="scroll-gradient">
        <div className="scroll-wrapper">
          {Array(30).fill(text).map((t, i) => (
            <span key={i}>{t}</span>
          ))}
          {Array(30).fill(text).map((t, i) => (
            <span key={i + 100}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
