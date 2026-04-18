"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buildAssetUrl, fetchProducts, formatDate, sortProductsByNewest } from "../api/products";
import "./EuropeMap.css";

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const CITY_COORDS = {
  baku: [40.4093, 49.8671],
  ganja: [40.6828, 46.3606],
  sumqayit: [40.5897, 49.6686],
  london: [51.5072, -0.1276],
  paris: [48.8566, 2.3522],
  berlin: [52.52, 13.405],
  rome: [41.9028, 12.4964],
  madrid: [40.4168, -3.7038],
  barcelona: [41.3874, 2.1686],
  vienna: [48.2082, 16.3738],
  prague: [50.0755, 14.4378],
  istanbul: [41.0082, 28.9784],
  moscow: [55.7558, 37.6173],
};

const formatTime = (value) => {
  if (!value) return "";
  const raw = value.toString();
  return raw.length >= 5 ? raw.slice(0, 5) : raw;
};

const getEventRoute = (product) => {
  const text = `${normalize(product.categoryName)} ${normalize(product.subCategoryName)}`;
  if (text.includes("concert") || text.includes("music") || text.includes("live")) {
    return `/event/concertdetail/${product.id}`;
  }
  if (text.includes("theater") || text.includes("theatre") || text.includes("drama") || text.includes("play") || text.includes("musical")) {
    return `/event/theaterdetail/${product.id}`;
  }
  if (text.includes("kid") || text.includes("child") || text.includes("family")) {
    return `/event/kidsdetail/${product.id}`;
  }
  if (text.includes("sport") || text.includes("football") || text.includes("basketball") || text.includes("tennis")) {
    return `/event/sportdetail/${product.id}`;
  }
  if (text.includes("museum") || text.includes("history") || text.includes("exhibit") || text.includes("gallery")) {
    return `/event/museumdetail/${product.id}`;
  }
  if (text.includes("circus") || text.includes("acrobat") || text.includes("clown")) {
    return `/event/circusdetail/${product.id}`;
  }
  if (text.includes("tour") || text.includes("travel") || text.includes("trip") || text.includes("adventure")) {
    return `/event/tourismdetail/${product.id}`;
  }
  if (text.includes("movie") || text.includes("cinema") || text.includes("film")) {
    return `/event/cinema/${product.id}`;
  }
  return "";
};

const geocodeAddress = async (address) => {
  if (!address) return null;
  try {
    const params = new URLSearchParams({
      q: address,
      format: "json",
      limit: "1",
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
    if (!response.ok) return null;
    const result = await response.json();
    if (!Array.isArray(result) || !result[0]) return null;
    const lat = Number(result[0].lat);
    const lng = Number(result[0].lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return [lat, lng];
  } catch {
    return null;
  }
};

const hashToOffset = (text) => {
  const source = normalize(text);
  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }

  const latOffset = ((hash % 1000) / 1000 - 0.5) * 0.4;
  const lngOffset = (((Math.floor(hash / 1000)) % 1000) / 1000 - 0.5) * 0.6;
  return [latOffset, lngOffset];
};

const resolveAddressCoords = async (address) => {
  const text = normalize(address);
  if (!text) return null;

  const cityEntry = Object.entries(CITY_COORDS).find(([city]) => text.includes(city));
  if (cityEntry) {
    const [, base] = cityEntry;
    const [latOffset, lngOffset] = hashToOffset(text);
    return [base[0] + latOffset * 0.3, base[1] + lngOffset * 0.3];
  }

  const geo = await geocodeAddress(address);
  if (geo) return geo;

  // Final fallback: still show a marker near Baku instead of dropping the address.
  const [latOffset, lngOffset] = hashToOffset(text);
  return [40.4093 + latOffset, 49.8671 + lngOffset];
};

export default function EuropeMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerLayer = useRef(null);
  const geocodeCache = useRef(new Map());

  const [addressGroups, setAddressGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [hoverAddress, setHoverAddress] = useState(null);
  const [lockedAddress, setLockedAddress] = useState(null);

  const activeAddress = lockedAddress || hoverAddress;
  const activeGroup = addressGroups.find((group) => group.key === activeAddress) || null;

  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current).setView([50.1109, 8.6821], 4);
    mapInstance.current = map;
    markerLayer.current = L.layerGroup().addTo(map);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { maxZoom: 19 }
    ).addTo(map);

    setTimeout(() => map.invalidateSize(), 300);
  }, []);

  useEffect(() => {
    let active = true;

    const getCoords = async (address) => {
      const key = normalize(address);
      if (!key) return null;
      if (geocodeCache.current.has(key)) return geocodeCache.current.get(key);

      const coords = await resolveAddressCoords(address);
      geocodeCache.current.set(key, coords);
      return coords;
    };

    const loadAddressEvents = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const products = await fetchProducts();
        if (!active) return;

        const withAddress = sortProductsByNewest(products).filter((item) => item.address && item.address.trim());
        const grouped = new Map();

        withAddress.forEach((product) => {
          const key = normalize(product.address);
          const list = grouped.get(key) || {
            key,
            address: product.address.trim(),
            events: [],
            coords: null,
          };

          list.events.push({
            id: product.id,
            title: product.name,
            date: formatDate(product.startDate),
            time: formatTime(product.startTime),
            location: product.address,
            image: buildAssetUrl(product.image),
            detailUrl: getEventRoute(product),
            details: [product.categoryName, product.subCategoryName].filter(Boolean).join(" • ") || "Event",
          });

          grouped.set(key, list);
        });

        const groups = Array.from(grouped.values());
        const withCoords = await Promise.all(
          groups.map(async (group) => ({
            ...group,
            coords: await getCoords(group.address),
          }))
        );

        if (!active) return;

        setAddressGroups(withCoords.filter((group) => Array.isArray(group.coords)));
      } catch (error) {
        if (!active) return;
        setLoadError("Failed to load address data to display on map.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAddressEvents();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const layer = markerLayer.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (!addressGroups.length) return;

    const bounds = [];

    addressGroups.forEach((group) => {
      const marker = L.marker(group.coords, {
        icon: L.divIcon({
          className: "address-marker",
          html: `<div class="marker-dot"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      });

      marker.on("mouseover", () => {
        if (!lockedAddress) setHoverAddress(group.key);
      });

      marker.on("mouseout", () => {
        if (!lockedAddress) setHoverAddress(null);
      });

      marker.on("click", () => {
        setLockedAddress(group.key);
        setHoverAddress(group.key);
        map.flyTo(group.coords, Math.max(map.getZoom(), 6), { duration: 0.6 });
      });

      marker.bindTooltip(group.address, {
        direction: "top",
        offset: [0, -12],
      });

      marker.addTo(layer);
      bounds.push(group.coords);
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 6);
    }
  }, [addressGroups, lockedAddress]);

  const showEmptyState = !loading && !loadError && !activeGroup;

  return (
    <div className="map-wrapper">
      <div ref={mapRef} id="map" />

      <div className="sidebar">
        <h3 className="sidebar-title">
          {activeGroup
            ? `${activeGroup.address} - ${activeGroup.events.length} Event`
            : "Hover over the address marker"}
        </h3>

        <div className="sidebar-scroll">
          {loading && <p className="sidebar-hint">Event address-lari yuklenir...</p>}

          {loadError && <p className="sidebar-hint">{loadError}</p>}

          {activeGroup &&
            activeGroup.events.map((e) => (
              <div
                key={e.id}
                className="event-card"
                onClick={() => e.detailUrl && (window.location.href = e.detailUrl)}
              >
                <img src={e.image || "src/assets/images/hello.jpg"} alt={e.title} className="event-img" />
                <div className="event-info">
                  <h4>{e.title}</h4>
                  <p className="event-meta">
                    {e.location} <br />
                    {e.date || "Date TBD"}{e.time ? ` • ${e.time}` : ""} <br />
                    {e.details}
                  </p>
                </div>
              </div>
            ))}

          {showEmptyState && (
            <p className="sidebar-hint">
              When you hover over the red markers on the map, events for that address will be displayed here.
            </p>
          )}
        </div>

        {lockedAddress && (
          <button
            className="clear-btn"
            onClick={() => {
              setLockedAddress(null);
              setHoverAddress(null);
            }}
          >
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
}
