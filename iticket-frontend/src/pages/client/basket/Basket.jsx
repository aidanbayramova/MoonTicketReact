import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBasket } from "../../../context/BasketContext";
import { useAuth } from "../../../context/AuthContext";
import { profileApi } from "../../../api/auth";
import "./Basket.css";

const initialCard = {
  cardholder: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

const maskCard = (value) => value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const maskExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export default function Basket() {
  const { items, removeFromBasket, clearBasket, checkoutBasket } = useBasket();
  const { isAuthenticated, token } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [card, setCard] = useState(initialCard);

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

    if (!isAuthenticated) {
      setMessage("Please log in to checkout.");
      return;
    }

    try {
      setLoading(true);
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
      const errorMessage = error.message || "Stripe checkout acilmadi.";
      if (errorMessage.toLowerCase().includes("stripe acarlari konfiqurasiya olunmayib")) {
        setMessage("Stripe key-lar henuz set edilmeyib. Demo Stripe modal acildi.");
        setShowPayment(true);
      } else {
        setMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const completeFakeStripePayment = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !card.cardholder.trim() ||
      card.cardNumber.replace(/\D/g, "").length < 16 ||
      card.expiry.length < 5 ||
      card.cvc.replace(/\D/g, "").length < 3
    ) {
      setMessage("Kart melumatlarini tam daxil edin.");
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const summary = await checkoutBasket();
      setMessage(`${summary.items} order(s) and ${summary.tickets} ticket(s) purchased successfully. Fake Stripe payment approved.`);
      setShowPayment(false);
      setCard(initialCard);
    } catch (error) {
      setMessage(error.message || "Payment failed. Please try again.");
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
                <button onClick={() => setShowPayment(true)} className="danger" type="button">
                  Demo Stripe (Fake)
                </button>
              </div>

              {!isAuthenticated && (
                <p className="basket-login-hint">
                  Buy tickets by <Link to="/signin">logging in</Link> first.
                </p>
              )}
            </>
          )}

          {showPayment && (
            <div className="stripe-modal-overlay" onClick={() => setShowPayment(false)}>
              <div className="stripe-modal" onClick={(e) => e.stopPropagation()}>
                <p className="basket-kicker">Demo payment</p>
                <h2>Stripe Checkout (Demo)</h2>
                <p>This is a demo payment, for testing only.</p>
                <form onSubmit={completeFakeStripePayment} className="stripe-form">
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={card.cardholder}
                    onChange={(e) => setCard((prev) => ({ ...prev, cardholder: e.target.value }))}
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={card.cardNumber}
                    onChange={(e) => setCard((prev) => ({ ...prev, cardNumber: maskCard(e.target.value) }))}
                  />
                  <div className="stripe-row">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => setCard((prev) => ({ ...prev, expiry: maskExpiry(e.target.value) }))}
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      value={card.cvc}
                      onChange={(e) => setCard((prev) => ({ ...prev, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                    />
                  </div>

                  <div className="stripe-summary">
                    <span>Total:</span>
                    <strong>${total.toFixed(2)}</strong>
                  </div>

                  <div className="stripe-actions">
                    <button type="button" className="danger" onClick={() => setShowPayment(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={loading}>
                      {loading ? "Authorizing..." : "Confirm Payment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
