import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBasket } from "../../../context/BasketContext";
import { useAuth } from "../../../context/AuthContext";
import { profileApi } from "../../../api/auth";
import "./Basket.css";

export default function Basket() {
  const { items, removeFromBasket, clearBasket } = useBasket();
  const { isAuthenticated, token, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.total || 0), 0),
    [items]
  );

  const totalTickets = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [items]
  );

  const handleCheckout = async () => {
    setMessage("");
    if (!items.length) {
      setMessage("Basket is empty.");
      return;
    }

    if (!isAuthenticated || !token) {
      setMessage("Please log in to checkout.");
      return;
    }

    try {
      setLoading(true);
      await profileApi.me(token);

      const payload = {
        items: items.map((x) => ({
          productId: Number(x.productId),
          title: x.title,
          total: Number(x.total || 0),
          quantity: Number(x.quantity || 1),
        })),
      };

      const stripeSession = await profileApi.createStripeCheckoutSession(token, payload);
      if (!stripeSession?.url) {
        throw new Error("Stripe checkout URL alinmadi.");
      }

      window.location.href = stripeSession.url;
    } catch (error) {
      if (error?.status === 401) {
        logout();
        setMessage("Session expired. Please log in again and retry checkout.");
        return;
      }

      const errorMessage = error.message || "Stripe checkout acilmadi.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basket-page">
      <div className="basket-shell">
        <section className="basket-hero">
          <div>
            <p className="basket-kicker">Secure Checkout</p>
            <h1>My Basket</h1>
            <p>
              Your selected tickets are collected here. Manage total amount and checkout flow in one premium panel.
            </p>
          </div>

          <div className="basket-hero-card">
            <span>Current Total</span>
            <strong>${total.toFixed(2)}</strong>
            <small>{totalTickets} tickets in basket</small>
          </div>
        </section>

        <section className="basket-stats-grid">
          <article className="basket-stat-card">
            <span>Items</span>
            <strong>{items.length}</strong>
          </article>
          <article className="basket-stat-card">
            <span>Tickets</span>
            <strong>{totalTickets}</strong>
          </article>
          <article className="basket-stat-card">
            <span>Grand total</span>
            <strong>${total.toFixed(2)}</strong>
          </article>
        </section>

        <div className="basket-container">
          {message && <p className="basket-message">{message}</p>}

          {items.length === 0 ? (
            <div className="basket-empty">
              <p>Basket is empty.</p>
              <p>No tickets selected. Start adding event tickets to proceed.</p>
              <Link to="/event/concert">Eventlere bax</Link>
            </div>
          ) : (
            <>
              <div className="basket-list">
                {items.map((item) => (
                  <div className="basket-item" key={item.basketId}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>Type: {item.eventType}</p>
                      <p>
                        Date/Time: {item.eventDate || "-"} {item.eventTime || ""}
                      </p>
                      <p>Qty: {item.quantity}</p>
                      {!!item.seats?.length && <p>Seats: {item.seats.join(", ")}</p>}
                      <p>Total: ${Number(item.total || 0).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromBasket(item.basketId)}>Remove</button>
                  </div>
                ))}
              </div>

              <div className="basket-summary">
                <p>Items: {items.length}</p>
                <p>Tickets: {totalTickets}</p>
                <p>Grand Total: ${total.toFixed(2)}</p>
              </div>

              <div className="basket-actions">
                <button onClick={clearBasket} className="danger">Clear Basket</button>
                <button onClick={handleCheckout} disabled={loading}>
                  {loading ? "Redirecting..." : "Pay with Stripe"}
                </button>
              </div>

              {!isAuthenticated && (
                <p className="basket-login-hint">
                  Buy tickets by <Link to="/signin">logging in</Link> first.
                </p>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
