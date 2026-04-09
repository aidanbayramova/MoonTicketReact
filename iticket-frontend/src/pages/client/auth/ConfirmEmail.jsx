import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";
import "./SignUp.css";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const { setAuthSession } = useAuth();
  const [searchParams] = useSearchParams();
  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [message, setMessage] = useState("Email təsdiqlənir...");

  useEffect(() => {
    const run = async () => {
      try {
        const response = await authApi.confirmEmail(email, token);
        setAuthSession(response);
        setMessage("Email təsdiqləndi. Avtomatik login edildi.");
        setTimeout(() => navigate("/profile"), 1200);
      } catch (error) {
        setMessage(error.message || "Email təsdiqi alınmadı.");
      }
    };

    if (!email || !token) {
      setMessage("Email təsdiqi üçün link tam deyil.");
      return;
    }

    run();
  }, [email, token, navigate, setAuthSession]);

  return (
    <div className="main">
      <section className="register">
        <div className="register-container">
          <div className="register-content">
            <div className="register-form">
              <h2 className="register-title">Email Confirmation</h2>
              <p className="auth-message">{message}</p>
              <p className="auth-inline-link">
                <Link to="/signin">Login page</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
