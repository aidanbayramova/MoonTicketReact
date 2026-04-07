import React, { useEffect, useState } from "react";
import "../contact/ContactAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

export default function SubscriberIndex() {
  const [subscribers, setSubscribers] = useState([]);
  const [status, setStatus] = useState("");

  const fetchSubscribers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/SubscriberGetAll`);
      const data = await res.json();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch {
      setSubscribers([]);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const activate = async (email) => {
    setStatus("");
    try {
      const res = await fetch(`${API_BASE}/api/SubscriberSubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus(`Subscriber activated: ${email}`);
      fetchSubscribers();
    } catch {
      setStatus("Failed to activate subscriber.");
    }
  };

  const deactivate = async (email) => {
    setStatus("");
    try {
      const res = await fetch(`${API_BASE}/api/SubscriberUnsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus(`Subscriber deactivated: ${email}`);
      fetchSubscribers();
    } catch {
      setStatus("Failed to deactivate subscriber.");
    }
  };

  return (
    <div className="contact-admin-container">
      <h2 className="contact-admin-title">Subscribers</h2>

      {status && <p className="contact-admin-status">{status}</p>}

      <table className="contact-admin-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Subscribed At</th>
            <th>Unsubscribed At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {subscribers.length === 0 ? (
            <tr>
              <td colSpan="5">No subscriber found</td>
            </tr>
          ) : (
            subscribers.map((s) => (
              <tr key={s.id}>
                <td>{s.email}</td>
                <td>{s.isActive ? "Active" : "Inactive"}</td>
                <td>{s.createdDate ? new Date(s.createdDate).toLocaleString() : "-"}</td>
                <td>{s.unsubscribedAt ? new Date(s.unsubscribedAt).toLocaleString() : "-"}</td>
                <td>
                  {s.isActive ? (
                    <button className="contact-admin-secondary-btn" onClick={() => deactivate(s.email)}>
                      Unsubscribe
                    </button>
                  ) : (
                    <button className="contact-admin-primary-btn" onClick={() => activate(s.email)}>
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
