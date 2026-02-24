import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blog.css";
import ScrollingTicker from "../components/ScrollingTicker"; 
import BlogCard from "../components/BlogCard"; 

export default function Blog() {
  const [bannerImg, setBannerImg] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7204/api/SettingGetAll")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBannerImg(data[0].bannerImg); 
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="blog-page">
      <section
        className="blog-banner"
        style={{
          background: bannerImg
            ? `url('${bannerImg}') center center / cover no-repeat`
            : "url('../assets/images/hello.jpg') center center / cover no-repeat"
        }}
      >
        <div className="banner-overlay"></div>
        <div className="container">
          <div className="banner-content">
            <h1 className="banner-title">Blog</h1>
            <nav className="breadcrumb-nav">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Blog</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <ScrollingTicker/>
      <BlogCard/>
    </div>
  );
}
