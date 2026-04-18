import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../../api/auth";
import "./SignUp.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await authApi.forgotPassword(email);
      setMessage(response.message || "Reset link sent to your email.");
    } catch (error) {
      setMessage(error.message || "Password reset request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main">
      <section className="register">
        <div className="register-container">
          <div className="register-content">
            <form className="register-form" onSubmit={handleSubmit}>
              <h2 className="register-title">Forgot Password</h2>
              {message && <p className="auth-message">{message}</p>}
              <div className="register-form-group">
                <input
                  type="email"
                  className="register-input"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="register-form-group">
                <input
                  type="submit"
                  className="register-submit"
                  value={loading ? "Sending..." : "Send reset link"}
                  disabled={loading}
                />
              </div>
              <p className="auth-inline-link">
                <Link to="/signin">Back to login</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
