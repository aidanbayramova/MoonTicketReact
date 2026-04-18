import { Link } from "react-router-dom";
import "./PaymentStatus.css";

export default function PaymentCancel() {
  return (
    <div className="payment-status-page">
      <div className="payment-status-card">
        <h1>Payment Cancelled</h1>
        <p>Your payment was cancelled. Basket items are still saved.</p>
        <div className="payment-status-actions">
          <Link to="/basket">Back to Basket</Link>
          <Link to="/event/concert">Continue Browsing</Link>
        </div>
      </div>
    </div>
  );
}
