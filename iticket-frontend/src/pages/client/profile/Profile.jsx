import { useEffect, useMemo, useState } from "react";
import { profileApi, toAbsoluteImage } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";
import "./Profile.css";

const fallbackAvatar = "https://ui-avatars.com/api/?name=Moon+Ticket&background=7f1d1d&color=fff";

export default function Profile() {
  const { token, user, setAuthSession, auth, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [refundReason, setRefundReason] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [me, myTickets] = await Promise.all([
          profileApi.me(token),
          profileApi.tickets(token)
        ]);
        setProfile(me);
        setTickets(myTickets);
      } catch (error) {
        setMessage(error.message || "Profil məlumatları alınmadı.");
      }
    };
    load();
  }, [token]);

  const upcoming = useMemo(() => tickets.filter((x) => !x.isPast), [tickets]);
  const past = useMemo(() => tickets.filter((x) => x.isPast), [tickets]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await profileApi.update(token, {
        fullName: profile.fullName,
        phone: profile.phone,
        birthDate: profile.birthDate
      });

      setAuthSession({
        ...auth,
        user: {
          ...user,
          fullName: profile.fullName,
          phone: profile.phone,
          birthDate: profile.birthDate,
          profileImage: profile.profileImage
        }
      });
      setMessage("Profil yeniləndi.");
    } catch (error) {
      setMessage(error.message || "Profil yenilənmədi.");
    }
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await profileApi.uploadPhoto(token, file);
      setProfile((prev) => ({ ...prev, profileImage: data.profileImage }));
      setAuthSession({
        ...auth,
        user: { ...user, profileImage: data.profileImage }
      });
      setMessage("Profil şəkli yeniləndi.");
    } catch (error) {
      setMessage(error.message || "Şəkil yüklənmədi.");
    }
  };

  const sendRefund = async (ticketId) => {
    try {
      await profileApi.refund(token, {
        ticketPurchaseId: ticketId,
        reason: refundReason[ticketId] || "Səbəb qeyd edilməyib"
      });
      setMessage("Qaytarma sorğusu göndərildi.");
    } catch (error) {
      setMessage(error.message || "Qaytarma sorğusu göndərilmədi.");
    }
  };

  if (!profile) {
    return <div className="profile-page"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-page">
      {/* <section className="profile-hero">
        <h1>My Profile</h1>
        <p>Hesabını idarə et, biletlərini yoxla və qaytarma sorğusu göndər.</p>
      </section> */}

      {message && <p className="profile-message">{message}</p>}

      <section className="profile-grid">
        <div className="profile-card">
          <img
            src={toAbsoluteImage(profile.profileImage) || fallbackAvatar}
            alt="Profile"
            className="profile-avatar"
          />
          <label className="profile-upload">
            Change Photo
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>

          <div className="profile-role-chip">
            Role: {(profile.roles && profile.roles[0]) || user?.roles?.[0] || "member"}
          </div>

          <form onSubmit={handleUpdate} className="profile-form">
            <input
              type="text"
              value={profile.fullName || ""}
              onChange={(e) => setProfile((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Full Name"
            />
            <input
              type="email"
              value={profile.email || ""}
              readOnly
            />
            <input
              type="tel"
              value={profile.phone || ""}
              onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone"
            />
            <input
              type="date"
              value={(profile.birthDate || "").split("T")[0]}
              onChange={(e) => setProfile((prev) => ({ ...prev, birthDate: e.target.value }))}
            />
            <button type="submit">Save Profile</button>
          </form>

          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>

        <div className="tickets-card">
          <h2>Upcoming Events</h2>
          <div className="ticket-list">
            {upcoming.length === 0 && <p>No upcoming tickets.</p>}
            {upcoming.map((ticket) => (
              <div className="ticket-item" key={ticket.id}>
                <img src={toAbsoluteImage(ticket.image)} alt={ticket.eventName} />
                <div>
                  <h3>{ticket.eventName}</h3>
                  <p>{new Date(ticket.eventDate).toLocaleString()}</p>
                  <p>Qty: {ticket.quantity}</p>
                  <textarea
                    placeholder="Refund reason"
                    value={refundReason[ticket.id] || ""}
                    onChange={(e) =>
                      setRefundReason((prev) => ({ ...prev, [ticket.id]: e.target.value }))
                    }
                  />
                  <button onClick={() => sendRefund(ticket.id)}>Send refund request</button>
                </div>
              </div>
            ))}
          </div>

          <h2>Past Events</h2>
          <div className="ticket-list">
            {past.length === 0 && <p>No past tickets.</p>}
            {past.map((ticket) => (
              <div className="ticket-item" key={ticket.id}>
                <img src={toAbsoluteImage(ticket.image)} alt={ticket.eventName} />
                <div>
                  <h3>{ticket.eventName}</h3>
                  <p>{new Date(ticket.eventDate).toLocaleString()}</p>
                  <p>Qty: {ticket.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
