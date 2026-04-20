import { useNavigate } from "react-router-dom";
import "./ErrorPages.css";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-code">401</div>
        <h1>İcazəsiz Giriş</h1>
        <p>Bu səhifəyə gitmək üçün sizin icazəniz yoxdur</p>
        <button className="error-btn" onClick={() => navigate("/")}>
          Ana Səhifəyə Qayıt
        </button>
      </div>
    </div>
  );
}
