import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactAdmin.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

export default function ContactMessageIndex() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ContactMessageGetAll`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="contact-admin-container">
      <h2 className="contact-admin-title">Contact Messages</h2>

      <table className="contact-admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {messages.length === 0 ? (
            <tr>
              <td colSpan="6">No contact message found</td>
            </tr>
          ) : (
            messages.map((m) => (
              <tr key={m.id}>
                <td>{`${m.firstName} ${m.lastName}`}</td>
                <td>{m.email}</td>
                <td>{m.phone || "-"}</td>
                <td>{m.message}</td>
                <td>{m.isReplied ? "Replied" : "Waiting"}</td>
                <td>
                  <button
                    className="contact-admin-primary-btn"
                    onClick={() => navigate(`/admin/contact/reply/${m.id}`)}
                  >
                    {m.isReplied ? "View / Edit Reply" : "Reply"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
