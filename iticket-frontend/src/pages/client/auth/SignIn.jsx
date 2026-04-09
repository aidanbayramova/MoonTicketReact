import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./SignUp.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await login(formData);
      navigate("/profile");
    } catch (error) {
      setMessage(error.message || "Login uğursuz oldu.");
    } finally {
      setLoading(false);
    }
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
              {message && <p className="auth-message">{message}</p>}

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
                  value={loading ? "Loading..." : "Login"}
                  disabled={loading}
                />
              </div>

              <p className="auth-inline-link">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
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
