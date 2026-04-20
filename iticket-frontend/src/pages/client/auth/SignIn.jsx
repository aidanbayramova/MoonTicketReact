import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import PasswordField from "../../../components/auth/PasswordField";
import "./SignUp.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
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
      // Email pattern detect et
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOrUsername);
      
      // Backend-ə göndəriləcək payload
      const payload = isEmail 
        ? { email: formData.emailOrUsername, password: formData.password }
        : { username: formData.emailOrUsername, password: formData.password };
      
      console.log("Login attempt with payload:", payload);
      await login(payload);
      navigate("/profile");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Login olmadı. Zəhmət olmasa yenidən cəhd edin.");
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

              {/* Email or Username */}
              <div className="register-form-group">
                <input
                  type="text"
                  className="register-input"
                  name="emailOrUsername"
                  placeholder="Email yaxud Username"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="register-form-group">
                <PasswordField
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
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
