import React, { useState } from "react"
import "./HeroSection.css"

export default function HeroSection({
  backgroundImage = "src/assets/images/hello.jpg",
  videoSrc = "src/assets/videos/Dua.mp4",
}) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <>
      <section
        className="hero"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="hero__overlay" />

        <div className="hero__content">
          <h1 className="hover-zoom hero__title">
            Power in Sound <span className="accentt">Quality</span> on Stage
          </h1>
          <p className="hero__subtitle" style={{ fontWeight: 100 }}>
            Experience the most unforgettable nights with your favorite artists
          </p>
          <div className="hover-zoom hero__play">
            <button
              className="hover-zoom play-btn"
              aria-label="Konsert videosunu izlə"
              onClick={() => setIsVideoOpen(true)}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z"></path>
              </svg>
              <span className="play-btn__pulse"></span>
              <span className="play-btn__pulse play-btn__pulse--2"></span>
            </button>
            <p className="hero__play-label" style={{ fontWeight: 100 }}>
              Feel the Night’s Rhythm
            </p>
          </div>
        </div>
      </section>

      {isVideoOpen && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__dialog">
            <button
              className="modal__close"
              aria-label="Videonu bağla"
              onClick={() => setIsVideoOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.3z"></path>
              </svg>
            </button>

            <video
              className="modal__video"
              src={videoSrc}
              controls
              autoPlay
              poster={backgroundImage}
            >
              Brauzeriniz video formatını dəstəkləmir.
            </video>
          </div>
        </div>
      )}
    </>
  )
}
