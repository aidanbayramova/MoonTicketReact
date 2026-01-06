"use client"
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css"; 

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", formData);
  };

  return (
    <div className="main">
      <section className="register">
        <div className="register-container">
          <div className="register-content">
            <form
              method="POST"
              id="login-form"
              className="register-form"
              onSubmit={handleSubmit}
            >
              <h2 className="register-title">Login</h2>

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
                ></span>
              </div>

              {/* Submit */}
              <div className="register-form-group">
                <input
                  type="submit"
                  className="register-submit"
                  value="Login"
                />
              </div>
            </form>

            <p className="register-login-text">
              Don't have an account?{" "}
              <Link to="/signup" className="register-login-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
