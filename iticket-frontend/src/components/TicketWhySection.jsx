import React, { useEffect, useState } from "react";
import { buildAssetUrl, fetchCategories } from "../api/products";
import "./TicketWhySection.css";

const fallbackItems = [
  { title: "Concert", img: "src/assets/images/T1.jpg", video: "src/assets/videos/TTT1.mp4" },
  { title: "Theater", img: "src/assets/images/T2.jpg", video: "src/assets/videos/TT2.mp4" },
  { title: "Kids", img: "src/assets/images/T3.jpg", video: "src/assets/videos/TT3.mp4" },
  { title: "Sports", img: "src/assets/images/T4.jpg", video: "src/assets/videos/TT4.mp4" },
  { title: "Movie", img: "src/assets/images/T5.jpg", video: "src/assets/videos/cinema.mp4" },
  { title: "Museum", img: "src/assets/images/T6.jpg", video: "src/assets/videos/Museum.mp4" },
  { title: "Circus", img: "src/assets/images/T7.jpg", video: "src/assets/videos/Circus.mp4" },
  { title: "Tourism", img: "src/assets/images/T8.jpg", video: "src/assets/videos/TT8.mp4" },
];

const mapCategoryToItem = (category, index) => {
  const fallback = fallbackItems[index % fallbackItems.length] || {};

  return {
    title: category.name || "Untitled",
    desc: "Hover to preview the event",
    img: buildAssetUrl(category.image) || fallback.img || "",
    video: buildAssetUrl(category.video) || fallback.video || "",
  };
};

export default function EventsGallery() {
  const [items, setItems] = useState(fallbackItems);
  const [mutedStates, setMutedStates] = useState(Array(fallbackItems.length).fill(true));

  useEffect(() => {
    let active = true;

    fetchCategories()
      .then((categories) => {
        if (!active || !Array.isArray(categories) || !categories.length) return;

        const mapped = categories
          .map(mapCategoryToItem)
          .filter((item) => item.title && (item.img || item.video));

        if (mapped.length) {
          setItems(mapped);
          setMutedStates(Array(mapped.length).fill(true));
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const handleToggleSound = (index, e) => {
    const videoEl = e.currentTarget;
    videoEl.muted = !videoEl.muted;
    const newStates = [...mutedStates];
    newStates[index] = videoEl.muted;
    setMutedStates(newStates);
  };

  return (
    <section className="events-gallery">
      <div className="events-container">
        <div className="gallery-header">
          <h2 className="gallery-title">Unforgettable Events, Anytime</h2>
          <p className="gallery-desc">
            From concerts to museums, we bring you the best events in one place.
            Enjoy entertainment tailored just for you.
          </p>
        </div>

        <div className="gallery-grid">
          {items.map((item, i) => (
            <div key={`${item.title}-${i}`} className="gallery-card">
              <div
                className="media-box"
                onMouseEnter={(e) => {
                  const videoEl = e.currentTarget.querySelector("video");
                  if (videoEl) videoEl.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  const videoEl = e.currentTarget.querySelector("video");
                  if (videoEl) {
                    videoEl.pause();
                    videoEl.currentTime = 0;
                  }
                }}
              >
                <img src={item.img} alt={item.title} className="media-img" />
                {item.video && (
                  <video
                    src={item.video}
                    className="media-video"
                    loop
                    playsInline
                    muted={mutedStates[i] ?? true}
                    onClick={(e) => handleToggleSound(i, e)}
                  ></video>
                )}

                <div className="media-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <small>Click video to hear sound</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
