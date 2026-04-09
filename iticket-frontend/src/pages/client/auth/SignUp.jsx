import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../../api/auth";
import "./SignUp.css";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    rePassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.rePassword) {
      setMessage("Şifrələr uyğun deyil.");
      return;
    }

    if (calculateAge(formData.birthDate) < 18) {
      setMessage("18 yaşdan aşağı qeydiyyat mümkün deyil.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const payload = {
        fullName: formData.fullName,
        userName: formData.username,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        password: formData.password
      };
      const response = await authApi.register(payload);
      setMessage(response.message || "Qeydiyyat tamamlandı. Emailini təsdiqlə.");
    } catch (error) {
      setMessage(error.message || "Qeydiyyat uğursuz oldu.");
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
              id="register-form"
              className="register-form"
              onSubmit={handleSubmit}
            >
              <h2 className="register-title">Create account</h2>
              {message && <p className="auth-message">{message}</p>}

              {/* Name */}
              <div className="register-form-group">
                <input
                  type="text"
                  className="register-input"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
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

              <div className="register-form-group">
                <input
                  type="tel"
                  className="register-input"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="register-form-group">
                <input
                  type="date"
                  className="register-input"
                  name="birthDate"
                  value={formData.birthDate}
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
                  name="rePassword"
                  placeholder="Repeat your password"
                  value={formData.rePassword}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <div className="register-form-group">
                <input
                  type="submit"
                  className="register-submit"
                  value={loading ? "Sending..." : "Sign up"}
                  disabled={loading}
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
