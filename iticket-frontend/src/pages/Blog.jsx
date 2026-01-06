import React from "react";
import { Link } from "react-router-dom";
import "./Blog.css";
import ScrollingTicker from "../components/ScrollingTicker"; 
import BlogCard from "../components/BlogCard"; 


export default function Blog() {
  return (
    <div className="blog-page">
      <section className="blog-banner">
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
