import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../../../api/auth";
import "./SignUp.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await authApi.resetPassword({ email, token, newPassword });
      setMessage(response.message || "Şifrə yeniləndi.");
    } catch (error) {
      setMessage(error.message || "Şifrə yenilənmədi.");
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
              <h2 className="register-title">Reset Password</h2>
              {message && <p className="auth-message">{message}</p>}
              <div className="register-form-group">
                <input type="email" className="register-input" value={email} readOnly />
              </div>
              <div className="register-form-group">
                <input
                  type="password"
                  className="register-input"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="register-form-group">
                <input
                  type="submit"
                  className="register-submit"
                  value={loading ? "Updating..." : "Update password"}
                  disabled={loading}
                />
              </div>
              <p className="auth-inline-link">
                <Link to="/signin">Go to login</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
