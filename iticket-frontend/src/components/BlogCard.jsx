import React, { useState } from "react";
import "./BlogCard.css";

const SAMPLE_POSTS = [
  {
    id: 1,
    title: "Tomorrowland 2025 — Belgium",
    excerpt: "The world’s biggest electronic music festival bringing together thousands of fans for unforgettable sets.",
    category: "Concert",
    date: "2025-07-18",
    img: "src/assets/images/tomorrowland.jpg",
    author: "Admin",
  },
  {
    id: 2,
    title: "West End Theater Season — London",
    excerpt: "A season of Broadway-style productions and new premieres on London’s famous stages.",
    category: "Theater",
    date: "2025-09-05",
    img: "src/assets/images/west-end.jpg",
    author: "Jony",
  },
  {
    id: 3,
    title: "Disneyland Kids Festival — Paris",
    excerpt: "Parades, character shows and family-friendly attractions perfect for children and parents alike.",
    category: "Kids",
    date: "2025-08-12",
    img: "src/assets/images/disneyland-kids.jpg",
    author: "Sara",
  },
  {
    id: 4,
    title: "UEFA Champions League Final — Berlin",
    excerpt: "Europe’s biggest club football final — a night of elite competition and electric stadium atmosphere.",
    category: "Sports",
    date: "2025-06-01",
    img: "src/assets/images/champions-final.jpg",
    author: "Oly",
  },
  {
    id: 5,
    title: "Cannes Film Festival Highlights — France",
    excerpt: "Premieres, red carpets and award-winning films showcased at the world-famous Cannes Film Festival.",
    category: "Movie",
    date: "2025-05-14",
    img: "src/assets/images/cannes.jpg",
    author: "Raven",
  },
  {
    id: 6,
    title: "Louvre Night Opening — Paris",
    excerpt: "Exclusive evening opening with guided tours of new exhibits and special performances.",
    category: "Museum",
    date: "2025-10-02",
    img: "src/assets/images/louvre-night.jpg",
    author: "Ruby",
  },
  {
    id: 7,
    title: "Big Top Spectacular — Cirque du Soleil Tour",
    excerpt: "A breathtaking circus show combining acrobatics, music and immersive stagecraft for all ages.",
    category: "Circus",
    date: "2025-11-20",
    img: "src/assets/images/cirque.jpg",
    author: "Sarina",
  },
  {
    id: 8,
    title: "Barcelona Music & City Break — Festival Package",
    excerpt: "Combine a weekend festival pass with guided city tours to explore Barcelona’s culture and nightlife.",
    category: "Tourism",
    date: "2025-07-25",
    img: "src/assets/images/barcelona-tour.jpg",
    author: "Radu",
  },
  {
    id: 9,
    title: "Venice Film Week — Independent Cinema",
    excerpt: "Showcasing indie films and emerging directors with screenings across historic venues.",
    category: "Movie",
    date: "2025-09-22",
    img: "src/assets/images/venice-filmweek.jpg",
    author: "Amina",
  },
];

export default function Blog() {
  const [visibleCount, setVisibleCount] = useState(3);

  const visiblePosts = SAMPLE_POSTS.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, SAMPLE_POSTS.length));
  };

  return (
    <section className="blog-section" aria-labelledby="blog-heading">
      <div className="container">
        <h2 id="blog-heading" className="section-title">Upcoming & Past Events</h2>

        <div className="posts-grid">
          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-thumb" aria-hidden="true">
                  <img
                    src={post.img}
                    alt={post.title}
                    onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                  />
                  <div className="thumb-overlay">
                    <span className="read-more">Read</span>
                  </div>
                  <span className="category-badge">{post.category}</span>
                </div>

                <div className="post-body">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString()}
                    </time>
                    <span className="post-author">By {post.author}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="no-posts">No posts available.</p>
          )}
        </div>

        {visiblePosts.length > 0 && visibleCount < SAMPLE_POSTS.length && (
          <div className="loadmore-wrap">
            <button className="loadmore-btn" onClick={handleLoadMore}>
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
