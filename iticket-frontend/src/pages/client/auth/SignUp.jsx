"use client"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css"; 

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    re_password: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="main">
      <section className="register">
        <div className="register-container">
          <div className="register-content">
            <form
              method="POST"
              id="register-form"
              className="register-form"
              onSubmit={handleSubmit}
            >
              <h2 className="register-title">Create account</h2>

              {/* Name */}
              <div className="register-form-group">
                <input
                  type="text"
                  className="register-input"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Username */}
              <div className="register-form-group">
                <input
                  type="text"
                  className="register-input"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="register-form-group">
                <input
                  type="email"
                  className="register-input"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="register-form-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="register-input"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="zmdi zmdi-eye register-field-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                ></span>
              </div>

              {/* Repeat Password */}
              <div className="register-form-group">
                <input
                  type="password"
                  className="register-input"
                  name="re_password"
                  placeholder="Repeat your password"
                  value={formData.re_password}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <div className="register-form-group">
                <input
                  type="submit"
                  className="register-submit"
                  value="Sign up"
                />
              </div>
            </form>

            <p className="register-login-text">
              Have already an account?{" "}
              <Link to="/signin" className="register-login-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
