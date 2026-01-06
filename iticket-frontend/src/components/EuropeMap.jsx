"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./EuropeMap.css";

const eventsData = {
  Paris: [
    {
      id: 1,
      title: "Conce`=rt",
      date: "2025-09-15",
      time: "20:00",
      location: "Paris Arena",
      image: "src/assets/images/Wimbledon Final.jpg",
      detailUrl: "/events/1",
      details: "Singer: Dua Lipa",
    },
    {
      id: 2,
      title: "Museum",
      date: "2025-09-18",
      time: "10:00",
      location: "Louvre",
      image: "src/assets/images/Wimbledon Final.jpg",
      detailUrl: "/events/2",
      details: "Mona Lisa Exhibition",
    },
  ],

  Rome: [
    {
      id: 1,
      title: "Opera",
      date: "2025-09-20",
      time: "19:00",
      location: "Teatro dell'Opera",
      image: "src/assets/images/Wimbledon Final.jpg",
      detailUrl: "/events/3",
      details: "La Traviata",
    },
  ],

  Berlin: [
    {
      id: 1,
      title: "Concert",
      date: "2025-09-14",
      time: "20:00",
      location: "Mercedes-Benz Arena",
      image: "../assets/images/berlinconcert.jpg",
      detailUrl: "/events/4",
      details: "Ed Sheeran",
    },
    {
      id: 2,
      title: "Theater",
      date: "2025-09-17",
      time: "19:00",
      location: "Deutsches Theater",
      image: "../assets/images/theaterberlin.jpg",
      detailUrl: "/events/5",
      details: "Faust",
    },
  ],
};

export default function EuropeMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const [hoverCity, setHoverCity] = useState(null);
  const [lockedCity, setLockedCity] = useState(null);

  const activeCity = lockedCity || hoverCity;

  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current).setView([48.8566, 2.3522], 4);
    mapInstance.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    const cities = [
      { name: "Paris", coords: [48.8566, 2.3522] },
      { name: "Rome", coords: [41.9028, 12.4964] },
      { name: "Berlin", coords: [52.52, 13.405] },
    ];

    cities.forEach((city) => {
      const marker = L.marker(city.coords, {
        icon: L.divIcon({
          className: "custom-marker",
          html: "<div></div>",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map);

      marker.on("mouseover", () => {
        if (!lockedCity) setHoverCity(city.name);
        const el = marker.getElement();
        if (el) el.classList.add("marker-hover");
      });

      marker.on("mouseout", () => {
        if (!lockedCity) setHoverCity(null);
        const el = marker.getElement();
        if (el) el.classList.remove("marker-hover");
      });

      marker.on("click", () => {
        setLockedCity(city.name);
        setHoverCity(city.name);
      });
    });

    setTimeout(() => map.invalidateSize(), 300);
  }, [lockedCity]);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} id="map" />

      <div className="sidebar">
        <h3 className="sidebar-title">
          {activeCity
            ? `Explore ${activeCity} Events`
            : "Hover over a city"}
        </h3>

        <div className="sidebar-scroll">
          {activeCity &&
            eventsData[activeCity]?.map((e) => (
              <div
                key={e.id}
                className="event-card"
                onClick={() => (window.location.href = e.detailUrl)}
              >
                <img src={e.image} alt={e.title} className="event-img" />
                <div className="event-info">
                  <h4>{e.title}</h4>
                  <p className="event-meta">
                    {e.location} <br />
                    {e.date} • {e.time} <br />
                    {e.details}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {lockedCity && (
          <button
            className="clear-btn"
            onClick={() => setLockedCity(null)}
          >
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
}
