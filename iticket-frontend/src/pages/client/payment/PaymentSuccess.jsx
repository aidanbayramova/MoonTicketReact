import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBasket } from "../../../context/BasketContext";
import "./PaymentStatus.css";

export default function PaymentSuccess() {
  const { checkoutBasket } = useBasket();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Stripe payment confirmed. Tickets are being issued...");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id") || "";

    checkoutBasket(sessionId)
      .then((summary) => {
        if (!active) return;
        setStatus("success");
        setMessage(`${summary.tickets} ticket successfully added to your profile.`);
      })
      .catch((error) => {
        if (!active) return;
        setStatus("error");
        setMessage(error.message || "Payment succeeded but ticket issuing failed.");
      });

    return () => {
      active = false;
    };
  }, [checkoutBasket]);

  return (
    <div className="payment-status-page">
      <div className="payment-status-card">
        <h1>{status === "success" ? "Payment Successful" : status === "error" ? "Payment Status Error" : "Processing"}</h1>
        <p>{message}</p>
        <div className="payment-status-actions">
          <Link to="/profile">Go to Profile</Link>
          <Link to="/event/concert">Explore Events</Link>
        </div>
      </div>
    </div>
  );
}
