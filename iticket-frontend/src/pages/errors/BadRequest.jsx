import { useNavigate } from "react-router-dom";
import "./ErrorPages.css";

export default function BadRequest() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-code">400</div>
        <h1>Yanlış Sorğu</h1>
        <p>Sorğunuz işlənə bilmədi</p>
        <button className="error-btn" onClick={() => navigate("/")}>
          Ana Səhifəyə Qayıt
        </button>
      </div>
    </div>
  );
}
