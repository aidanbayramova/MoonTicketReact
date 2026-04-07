import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ContactAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

export default function ReplyContactMessageForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadMessage = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/ContactMessageGetAll`);
        const data = await res.json();
        const found = Array.isArray(data) ? data.find((x) => String(x.id) === String(id)) : null;
        setMessage(found || null);
        setReply(found?.adminReply || "");
      } catch {
        setMessage(null);
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      setStatus("Reply is required.");
      return;
    }

    setStatus("");
    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/api/ContactMessageReply/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to send reply");
      }

      setStatus("Reply sent and saved successfully.");
    } catch (error) {
      setStatus(error.message || "Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="contact-admin-loading">Loading...</div>;
  if (!message) return <div className="contact-admin-loading">Message not found.</div>;

  return (
    <div className="contact-admin-form-page">
      <h2 className="contact-admin-title">Reply Contact Message</h2>

      <div className="contact-admin-message-box">
        <p><strong>From:</strong> {message.firstName} {message.lastName}</p>
        <p><strong>Email:</strong> {message.email}</p>
        <p><strong>Phone:</strong> {message.phone || "-"}</p>
        <p><strong>Message:</strong> {message.message}</p>
      </div>

      <form className="contact-admin-form" onSubmit={onSubmit}>
        <textarea
          rows="8"
          placeholder="Write your reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <div className="contact-admin-form-buttons">
          <button type="submit" className="contact-admin-primary-btn" disabled={sending}>
            {sending ? "Sending..." : "Send Reply"}
          </button>
          <button
            type="button"
            className="contact-admin-secondary-btn"
            onClick={() => navigate("/admin/contact/messages")}
          >
            Back
          </button>
        </div>

        {status && <p className="contact-admin-status">{status}</p>}
      </form>
    </div>
  );
}
