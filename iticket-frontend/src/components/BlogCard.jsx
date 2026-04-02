import React, { useEffect, useState } from "react";
import "./BlogCard.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

const toImageUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const mapNewsItem = (item = {}) => ({
  id: item.id,
  title: item.title || item.Title || "Untitled",
  excerpt: item.desc || item.Desc || "",
  location: item.location || item.Location || "",
  img: toImageUrl(item.image || item.Image || ""),
  author: item.newsAuthorFullName || item.NewsAuthorFullName || "Unknown",
});

export default function Blog() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/NewsGetAll`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setPosts(list.map(mapNewsItem));
      })
      .catch(() => {
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const visiblePosts = posts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, posts.length));
  };

  return (
    <section className="blog-section" aria-labelledby="blog-heading">
      <div className="container">
        <h2 id="blog-heading" className="section-title">Upcoming & Past Events</h2>

        {loading && <p className="no-posts">Loading news...</p>}

        <div className="posts-grid">
          {!loading && visiblePosts.length > 0 ? (
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
                  <span className="category-badge">{post.author}</span>
                </div>

                <div className="post-body">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <span className="post-author">{post.location}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            !loading && <p className="no-posts">No posts available.</p>
          )}
        </div>

        {!loading && visiblePosts.length > 0 && visibleCount < posts.length && (
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
