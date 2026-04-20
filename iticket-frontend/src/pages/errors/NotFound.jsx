import { useNavigate } from "react-router-dom";
import "./ErrorPages.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-code">404</div>
        <h1>Səhifə Tapılmadı</h1>
        <p>Axtardığınız səhifə mövcud deyil</p>
        <button className="error-btn" onClick={() => navigate("/")}>
          Ana Səhifəyə Qayıt
        </button>
      </div>
    </div>
  );
}
