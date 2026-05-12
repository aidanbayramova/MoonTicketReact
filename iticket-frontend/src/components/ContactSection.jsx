import React, { useEffect, useState } from "react";
import "./ContactSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";
const METRICS_EVENT = "moonTicket:metrics-updated";

export default function ContactSection() {
  const [contactData, setContactData] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  const [messageForm, setMessageForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [subscribeEmail, setSubscribeEmail] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/SettingGetAll`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setContactData(data[0]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const onMessageFieldChange = (e) => {
    const { name, value } = e.target;
    setMessageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setMessageStatus("");
    setSendingMessage(true);

    try {
      const res = await fetch(`${API_BASE}/api/ContactMessageCreate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageForm),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setMessageStatus("Message sent. We will reply to your email soon.");
      setMessageForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      setMessageStatus("Message could not be sent. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSubscribe = async () => {
    if (!subscribeEmail.trim()) {
      setSubscribeStatus("Please enter email first.");
      return;
    }

    setSubscribeStatus("");
    setSubscribing(true);

    try {
      const res = await fetch(`${API_BASE}/api/SubscriberSubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail }),
      });

      if (!res.ok) throw new Error("Subscribe failed");
      setSubscribeStatus("You are subscribed successfully.");
      window.dispatchEvent(new CustomEvent(METRICS_EVENT));
    } catch {
      setSubscribeStatus("Subscribe failed. Try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!subscribeEmail.trim()) {
      setSubscribeStatus("Please enter email first.");
      return;
    }

    setSubscribeStatus("");
    setSubscribing(true);

    try {
      const res = await fetch(`${API_BASE}/api/SubscriberUnsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail }),
      });

      if (!res.ok) throw new Error("Unsubscribe failed");
      setSubscribeStatus("You are unsubscribed successfully.");
      window.dispatchEvent(new CustomEvent(METRICS_EVENT));
    } catch {
      setSubscribeStatus("Unsubscribe failed or email was not found.");
    } finally {
      setSubscribing(false);
    }
  };

  if (!contactData) {
    return <p>Loading contact info...</p>;
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-grid">

        <div className="contact-left">
        <h2>Get in touch with us</h2>
          <p>
            Whether you have questions, need support, or want to discuss a coffee shop,
            feel free to reach out.
          </p>
          <div className="info-card">
            <FontAwesomeIcon icon={faPhone} className="info-icon" />
            <div className="info-text">
              <h3>{contactData.contactTitleOne}</h3>
              <p>{contactData.number}</p>
            </div>
          </div>

          <div className="info-card">
            <FontAwesomeIcon icon={faEnvelope} className="info-icon" />
            <div className="info-text">
              <h3>{contactData.contactTitleTwo}</h3>
              <p>{contactData.email}</p>
            </div>
          </div>

          <div className="subscribe-card">
            <h3>Join MoonTicket Insider</h3>
            <p>
              Get new events, pre-sale drops, and special offers directly to your inbox.
            </p>

            <div className="subscribe-input-wrap">
              <input
                type="email"
                placeholder="Your email address"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
              />
            </div>

            <div className="subscribe-actions">
              <button type="button" className="btn-subscribe" onClick={handleSubscribe} disabled={subscribing}>
                {subscribing ? "Please wait..." : "Subscribe"}
              </button>
              <button type="button" className="btn-unsubscribe" onClick={handleUnsubscribe} disabled={subscribing}>
                Unsubscribe
              </button>
            </div>

            {subscribeStatus && <p className="form-status">{subscribeStatus}</p>}
          </div>

        </div>

        <div className="contact-right">
          <h3>Send a Message</h3>
          <p>
            Unlock your potential with expert guidance! Schedule a free consultation
            toward personal and business success.
          </p>

          <form className="contact-form" onSubmit={handleMessageSubmit}>
            <div className="form-row">
              <input type="text" name="firstName" placeholder="First Name" value={messageForm.firstName} onChange={onMessageFieldChange} required />
              <input type="text" name="lastName" placeholder="Last Name" value={messageForm.lastName} onChange={onMessageFieldChange} required />
            </div>
            <div className="form-row">
              <input type="email" name="email" placeholder="E-mail Address" value={messageForm.email} onChange={onMessageFieldChange} required />
              <input type="text" name="phone" placeholder="Phone Number" value={messageForm.phone} onChange={onMessageFieldChange} />
            </div>
            <textarea name="message" placeholder="Message" rows="5" value={messageForm.message} onChange={onMessageFieldChange} required></textarea>
            <button type="submit" className="btn-submit" disabled={sendingMessage}>
              {sendingMessage ? "Sending..." : "Submit Message"}
            </button>
            {messageStatus && <p className="form-status">{messageStatus}</p>}
          </form>
        </div>

      </div>
    </section>
  );
}
