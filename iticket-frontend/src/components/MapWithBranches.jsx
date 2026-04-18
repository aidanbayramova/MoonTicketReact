"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchProducts } from "../api/products";
import "./MapWithBranches.css";

const GEOCODE_CACHE_KEY = "moonTicket.geocodeCache";

const fallbackBranches = [
  { id: 1, name: "Moon Ticket Branch - Baku", address: "Nizami Street, Baku", lat: 40.4093, lng: 49.8671, phone: "+994 12 000 00 00", city: "Baku", icon: "MT" },
  { id: 2, name: "Moon Ticket Branch - Ganjlik", address: "Ganjlik Mall, Baku", lat: 40.4004, lng: 49.8522, phone: "+994 12 111 11 11", city: "Baku", icon: "MT" },
];

const parseCity = (address) => {
  const parts = (address || "").split(",").map((x) => x.trim()).filter(Boolean);
  if (!parts.length) return "Unknown";
  return parts[parts.length - 1];
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(GEOCODE_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeCache = (cache) => {
  localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
};

async function geocodeAddress(address) {
  const cache = readCache();
  if (cache[address]) return cache[address];

  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocode request failed");

  const data = await res.json();
  if (!Array.isArray(data) || !data.length) return null;

  const first = data[0];
  const coords = {
    lat: Number(first.lat),
    lng: Number(first.lon),
  };

  cache[address] = coords;
  writeCache(cache);
  return coords;
}

export default function MapWithBranches() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [branches, setBranches] = useState(fallbackBranches);

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView([40.4093, 49.8671], 6);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 400);
  }, []);

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then(async (products) => {
        if (!active) return;

        const addresses = Array.from(
          new Set(
            (products || [])
              .map((x) => x.address)
              .filter((x) => typeof x === "string" && x.trim())
          )
        );

        if (!addresses.length) {
          setBranches(fallbackBranches);
          return;
        }

        const resolved = [];
        for (let i = 0; i < addresses.length; i += 1) {
          const address = addresses[i];
          try {
            const coords = await geocodeAddress(address);
            if (!coords) continue;
            resolved.push({
              id: i + 1,
              name: `Moon Ticket Event Point ${i + 1}`,
              address,
              lat: coords.lat,
              lng: coords.lng,
              phone: "+994 12 000 00 00",
              city: parseCity(address),
              icon: "MT",
            });
          } catch {
            continue;
          }
        }

        if (!active) return;
        setBranches(resolved.length ? resolved : fallbackBranches);
      })
      .catch(() => {
        if (!active) return;
        setBranches(fallbackBranches);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current = [];

    const pinIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    branches.forEach((branch) => {
      const marker = L.marker([branch.lat, branch.lng], { icon: pinIcon })
        .bindPopup(`
          <div style="font-family: 'Poppins', sans-serif;">
            <h4 style="margin:0 0 8px;color:#7b1305;">${branch.name}</h4>
            <p style="margin:4px 0;"><strong>Address:</strong> ${branch.address}</p>
            <p style="margin:4px 0;"><strong>Phone:</strong> ${branch.phone}</p>
            <p style="margin:4px 0;"><strong>City:</strong> ${branch.city}</p>
          </div>
        `)
        .addTo(map);

      markersRef.current.push({ marker, branch });
    });

    if (branches.length > 0) {
      const bounds = L.latLngBounds(branches.map((b) => [b.lat, b.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [branches]);

  const filteredBranches = useMemo(
    () =>
      branches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.city.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [branches, searchTerm]
  );

  const handleSearch = () => {
    const map = mapInstanceRef.current;
    if (!map || filteredBranches.length === 0) return;

    if (!searchTerm.trim()) {
      const bounds = L.latLngBounds(branches.map((b) => [b.lat, b.lng]));
      map.fitBounds(bounds, { padding: [30, 30] });
      return;
    }

    if (filteredBranches.length === 1) {
      const branch = filteredBranches[0];
      map.setView([branch.lat, branch.lng], 14);
      const markerData = markersRef.current.find((m) => m.branch.id === branch.id);
      if (markerData) markerData.marker.openPopup();
      return;
    }

    const bounds = L.latLngBounds(filteredBranches.map((b) => [b.lat, b.lng]));
    map.fitBounds(bounds, { padding: [30, 30] });
  };

  const goToBranch = (branch) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.setView([branch.lat, branch.lng], 15);
    const markerData = markersRef.current.find((m) => m.branch.id === branch.id);
    if (markerData) {
      setTimeout(() => {
        markerData.marker.openPopup();
      }, 200);
    }
  };

  return (
    <div className="map-wrapper">
      <div ref={mapContainerRef} id="map"></div>

      <div className="sidebar-modern">
        <h3 className="sidebar-title-modern">Moon Ticket Map Search</h3>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by branch or address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="search-input-modern"
          />
        </div>

        <div className="branch-list-modern">
          {filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => (
              <div key={branch.id} className="branch-card-modern">
                <h4>{branch.name}</h4>
                <p>{branch.address}</p>
                {/* <p>{branch.city}</p> */}
                <button className="btnbtn" onClick={() => goToBranch(branch)}>
                  View on Map
                </button>
              </div>
            ))
          ) : (
            <p className="no-results-modern">No locations found</p>
          )}
        </div>
      </div>
    </div>
  );
}
