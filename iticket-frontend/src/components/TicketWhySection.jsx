import React, { useState } from "react";
import "./TicketWhySection.css";

const eventItems = [
  { title: "Concert", img: "src/assets/images/T1.jpg", video: "src/assets/videos/TTT1.mp4" },
  { title: "Theater", img: "src/assets/images/T2.jpg", video: "src/assets/videos/TT2.mp4" },
  { title: "Kids", img: "src/assets/images/T3.jpg", video: "src/assets/videos/TT3.mp4" },
  { title: "Sports", img: "src/assets/images/T4.jpg", video: "src/assets/videos/TT4.mp4" },
  { title: "Movie", img: "src/assets/images/T5.jpg", video: "src/assets/videos/cinema.mp4" },
  { title: "Museum", img: "src/assets/images/T6.jpg", video: "src/assets/videos/Museum.mp4" },
  { title: "Circus", img: "src/assets/images/T7.jpg", video: "src/assets/videos/Circus.mp4" },
  { title: "Tourism", img: "src/assets/images/T8.jpg", video: "src/assets/videos/TT8.mp4" },
];

export default function EventsGallery() {
  const [mutedStates, setMutedStates] = useState(Array(eventItems.length).fill(true));

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
          {eventItems.map((item, i) => (
            <div key={i} className="gallery-card">
              <div
                className="media-box"
                onMouseEnter={(e) => e.currentTarget.querySelector("video").play()}
                onMouseLeave={(e) => {
                  const videoEl = e.currentTarget.querySelector("video");
                  videoEl.pause();
                  videoEl.currentTime = 0;
                }}
              >
                <img src={item.img} alt={item.title} className="media-img" />
                <video
                  src={item.video}
                  className="media-video"
                  loop
                  playsInline
                  muted={mutedStates[i]}
                  onClick={(e) => handleToggleSound(i, e)}
                ></video>

                <div className="media-overlay">
                  <h3>{item.title}</h3>
                  <p>Hover to preview the event</p>
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
