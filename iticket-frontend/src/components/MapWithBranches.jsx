"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapWithBranches.css";

const branchesData = {
  Paris: [
    { id: 1, name: "Moon Ticket – Champs-Élysées", address: "8 Avenue des Champs-Élysées", lat: 48.869, lng: 2.307, phone: "+33 1 2345 6789", icon: "🗼" },
    { id: 2, name: "Moon Ticket – Le Marais", address: "5 Rue des Francs-Bourgeois", lat: 48.857, lng: 2.362, phone: "+33 1 9876 5432", icon: "🗼" },
  ],
  Berlin: [
    { id: 3, name: "Moon Ticket – Mitte", address: "Friedrichstraße 100", lat: 52.520, lng: 13.388, phone: "+49 30 123456", icon: "🛡️" },
    { id: 4, name: "Moon Ticket – Kreuzberg", address: "Kottbusser Damm 101", lat: 52.498, lng: 13.402, phone: "+49 30 654321", icon: "🛡️" },
  ],
  Rome: [
    { id: 5, name: "Moon Ticket – Trastevere", address: "Piazza di Santa Maria", lat: 41.888, lng: 12.470, phone: "+39 06 1234567", icon: "🏛️" },
  ],
  London: [
    { id: 6, name: "Moon Ticket – Soho", address: "12 Carnaby St", lat: 51.512, lng: -0.136, phone: "+44 20 1234 5678", icon: "🎡" },
  ],
  Madrid: [
    { id: 7, name: "Moon Ticket – Sol", address: "Puerta del Sol 1", lat: 40.416, lng: -3.703, phone: "+34 91 234 5678", icon: "🏰" },
  ],
};

const allBranches = Object.entries(branchesData).flatMap(([city, branches]) =>
  branches.map(branch => ({ ...branch, city }))
);

export default function MapWithBranches() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView([48.8566, 2.3522], 5);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const pinIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    allBranches.forEach(branch => {
      const marker = L.marker([branch.lat, branch.lng], { icon: pinIcon })
        .bindPopup(`
          <div style="font-family: 'Poppins', sans-serif;">
            <h4 style="margin: 0 0 8px; color: #7b1305;">${branch.name}</h4>
            <p style="margin: 4px 0;"><strong>📍 Address:</strong> ${branch.address}</p>
            <p style="margin: 4px 0;"><strong>📞 Phone:</strong> ${branch.phone}</p>
            <p style="margin: 4px 0;">${branch.icon} <strong> City:</strong> ${branch.city}</p>
          </div>
        `)
        .addTo(map);
      
      markersRef.current.push({ marker, branch });
    });

    setTimeout(() => map.invalidateSize(), 500);
  }, []);

  const filteredBranches = allBranches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    if (!mapInstanceRef.current || filteredBranches.length === 0) return;

    if (searchTerm.trim() === "") {
      const bounds = L.latLngBounds(allBranches.map(b => [b.lat, b.lng]));
      mapInstanceRef.current.fitBounds(bounds);
    } else if (filteredBranches.length === 1) {
      const branch = filteredBranches[0];
      mapInstanceRef.current.setView([branch.lat, branch.lng], 14);
      
      const markerData = markersRef.current.find(m => m.branch.id === branch.id);
      if (markerData) {
        markerData.marker.openPopup();
      }
    } else {
      const bounds = L.latLngBounds(filteredBranches.map(b => [b.lat, b.lng]));
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  const goToBranch = (branch) => {
    if (!mapInstanceRef.current) return;
    
    mapInstanceRef.current.setView([branch.lat, branch.lng], 15);
    
    const markerData = markersRef.current.find(m => m.branch.id === branch.id);
    if (markerData) {
      setTimeout(() => {
        markerData.marker.openPopup();
      }, 500);
    }
  };

  return (
    
    <div className="map-wrapper">
      <div ref={mapContainerRef} id="map"></div>

      <div className="sidebar-modern">
        <h3 className="sidebar-title-modern">
          Moon Ticket Branches
        </h3>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search branches, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="search-input-modern"
          />
        </div>

        <div className="branch-list-modern">
          {filteredBranches.length > 0 ? (
            filteredBranches.map(branch => (
              <div key={branch.id} className="branch-card-modern">
                <h4>{branch.name}</h4>
                <p>📍 {branch.address}</p>
                <p>📞 {branch.phone}</p>
                <p>{branch.icon} {branch.city}</p>
                <button className="btnbtn" onClick={() => goToBranch(branch)}>View on Map 🎫</button>
              </div>
            ))
          ) : (
            <p className="no-results-modern">No branches found</p>
          )}
        </div>
      </div>
    </div>
  );
}
