import { useEffect, useMemo, useState } from "react";
import { profileApi, toAbsoluteImage } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";
import { useBasket } from "../../../context/BasketContext";
import "./Profile.css";

const fallbackAvatar = "https://ui-avatars.com/api/?name=Moon+Ticket&background=7f1d1d&color=fff";

const groupTicketsByEvent = (list) => {
  const map = new Map();

  list.forEach((ticket) => {
    const key = `${ticket.productId}-${ticket.eventDate}`;
    const current = map.get(key);
    const qty = Number(ticket.quantity || 0);

    if (!current) {
      map.set(key, {
        key,
        productId: ticket.productId,
        eventName: ticket.eventName,
        image: ticket.image,
        eventDate: ticket.eventDate,
        isPast: ticket.isPast,
        totalQuantity: qty,
        entries: [ticket],
      });
      return;
    }

    current.totalQuantity += qty;
    current.entries.push(ticket);
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );
};

export default function Profile() {
  const { token, user, setAuthSession, auth, logout } = useAuth();
  const { items, removeFromBasket, clearBasket, checkoutBasket } = useBasket();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [refundReason, setRefundReason] = useState({});
  const [refundQty, setRefundQty] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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
        setMessage(error.message || "Failed to load profile data.");
      }
    };
    load();
  }, [token]);

  const upcoming = useMemo(() => tickets.filter((x) => !x.isPast), [tickets]);
  const past = useMemo(() => tickets.filter((x) => x.isPast), [tickets]);
  const groupedUpcoming = useMemo(() => groupTicketsByEvent(upcoming), [upcoming]);
  const groupedPast = useMemo(() => groupTicketsByEvent(past), [past]);
  const basketTotal = useMemo(
    () => items.reduce((sum, x) => sum + Number(x.total || 0), 0),
    [items]
  );
  const basketTickets = useMemo(
    () => items.reduce((sum, x) => sum + Number(x.quantity || 0), 0),
    [items]
  );
  const displayName = profile?.fullName || user?.fullName || "Moon Ticket Member";
  const avatarSrc = toAbsoluteImage(profile?.profileImage) || fallbackAvatar;

  const wowStats = useMemo(() => {
    const totalBought = tickets.reduce((sum, t) => sum + Number(t.quantity || 0), 0);
    return {
      totalBought,
      activeReservations: items.length,
      upcomingCount: groupedUpcoming.length,
      loyaltyTier: totalBought >= 20 ? "Legend" : totalBought >= 10 ? "Pro" : "Starter",
    };
  }, [tickets, items, groupedUpcoming]);

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
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message || "Failed to update profile.");
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
      setMessage("Profile picture updated.");
    } catch (error) {
      setMessage(error.message || "Failed to upload photo.");
    }
  };

  const sendRefund = async (groupedTicket) => {
    try {
      const requested = Number(refundQty[groupedTicket.key] || 1);
      const totalQuantity = Number(groupedTicket.totalQuantity || 0);

      if (!Number.isFinite(requested) || requested < 1) {
        setMessage("Refund quantity must be at least 1.");
        return;
      }

      if (requested > totalQuantity) {
        setMessage(`You can refund maximum ${totalQuantity} ticket(s) for this event.`);
        return;
      }

      const entries = [...groupedTicket.entries]
        .sort((a, b) => Number(b.quantity || 0) - Number(a.quantity || 0));

      let remaining = requested;
      for (const entry of entries) {
        if (remaining <= 0) break;
        const available = Number(entry.quantity || 0);
        if (available <= 0) continue;

        const take = Math.min(remaining, available);
        await profileApi.refund(token, {
          ticketPurchaseId: entry.id,
          quantity: take,
          reason: refundReason[groupedTicket.key] || "No reason provided",
        });
        remaining -= take;
      }

      if (remaining > 0) {
        throw new Error("Not enough refundable ticket quantity found.");
      }

      setRefundReason((prev) => ({ ...prev, [groupedTicket.key]: "" }));
      setRefundQty((prev) => ({ ...prev, [groupedTicket.key]: 1 }));

      setMessage("Refund request submitted successfully.");
      const myTickets = await profileApi.tickets(token);
      setTickets(myTickets);
    } catch (error) {
      setMessage(error.message || "Failed to submit refund request.");
    }
  };

  const handleBasketCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const summary = await checkoutBasket();
      setMessage(`${summary.tickets} ticket(s) purchased successfully. Refreshing profile...`);
      const myTickets = await profileApi.tickets(token);
      setTickets(myTickets);
    } catch (error) {
      setMessage(error.message || "Checkout failed. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!profile) {
    return <div className="profile-page"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div>
          <p className="profile-kicker">Personal Control Center</p>
          <h1>{displayName}</h1>
          <p>
            Manage your account, reservations, and ticket history all in one premium dashboard.
          </p>
        </div>

        <div className="profile-hero-card">
          <span>Membership Level</span>
          <strong>{wowStats.loyaltyTier}</strong>
          <small>{wowStats.totalBought} total ticket purchases</small>
        </div>
      </section>

      {message && <p className="profile-message">{message}</p>}

      <section className="profile-stats-grid">
        <article className="profile-stat-card">
          <span>Tickets bought</span>
          <strong>{wowStats.totalBought}</strong>
        </article>
        <article className="profile-stat-card">
          <span>Active reservations</span>
          <strong>{wowStats.activeReservations}</strong>
        </article>
        <article className="profile-stat-card">
          <span>Upcoming events</span>
          <strong>{wowStats.upcomingCount}</strong>
        </article>
        <article className="profile-stat-card">
          <span>Basket total</span>
          <strong>${basketTotal.toFixed(2)}</strong>
        </article>
      </section>

      <section className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            <img
              src={avatarSrc}
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-avatar-glow" />
          </div>
          <label className="profile-upload">
            <span>Change Photo</span>
            <input type="file" accept="image/*" onChange={handlePhoto} />
          </label>

          <div className="profile-role-chip">
            Role: {(profile.roles && profile.roles[0]) || user?.roles?.[0] || "member"}
          </div>

          <div className="profile-mini-info">
            <div>
              <span>Email</span>
              <strong>{profile.email || "-"}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{profile.phone || "-"}</strong>
            </div>
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
            <button type="submit" className="profile-primary-btn">Save Profile</button>
          </form>

          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>

        <div className="tickets-card">
          <div className="section-head">
            <div>
              <p className="section-kicker">Overview</p>
              <h2>My Ticket DNA</h2>
            </div>
          </div>

          <div className="profile-wow-grid">
            <div className="profile-wow-item">
              <strong>{wowStats.totalBought}</strong>
              <span>Total Tickets Bought</span>
            </div>
            <div className="profile-wow-item">
              <strong>{wowStats.activeReservations}</strong>
              <span>Active Reservations</span>
            </div>
            <div className="profile-wow-item">
              <strong>{wowStats.upcomingCount}</strong>
              <span>Upcoming Events</span>
            </div>
            <div className="profile-wow-item">
              <strong>{wowStats.loyaltyTier}</strong>
              <span>Loyalty Tier</span>
            </div>
          </div>

          <div className="section-head section-head-spaced">
            <div>
              <p className="section-kicker">Wallet</p>
              <h2>Basket Reservations</h2>
            </div>
          </div>
          {items.length === 0 ? (
            <div className="empty-panel">
              <p>No reserved tickets in basket.</p>
            </div>
          ) : (
            <div className="ticket-list">
              {items.map((item) => (
                <div className="ticket-item" key={item.basketId}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.eventDate || "-"} • {item.eventTime || "-"}</p>
                    <p>Qty: {item.quantity}</p>
                    {!!item.seats?.length && <p>Seats: {item.seats.join(", ")}</p>}
                    <p>Total: ${Number(item.total || 0).toFixed(2)}</p>
                    <button className="ghost-btn" onClick={() => removeFromBasket(item.basketId)}>Remove from basket</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="profile-basket-summary">
            <p>Reserved tickets: {basketTickets}</p>
            <p>Basket total: ${basketTotal.toFixed(2)}</p>
            <div className="profile-basket-actions">
              <button className="ghost-btn" onClick={clearBasket}>Clear Basket</button>
              <button className="profile-primary-btn" onClick={handleBasketCheckout} disabled={checkoutLoading || items.length === 0}>
                {checkoutLoading ? "Processing..." : "Buy Reserved Tickets"}
              </button>
            </div>
            {!profile.emailConfirmed && (
              <p className="profile-note">
                Email not confirmed. Please verify your email before checkout.
              </p>
            )}
          </div>

          <div className="section-head section-head-spaced">
            <div>
              <p className="section-kicker">Agenda</p>
              <h2>Upcoming Events</h2>
            </div>
          </div>
          <div className="ticket-list">
            {groupedUpcoming.length === 0 && <p>No upcoming tickets.</p>}
            {groupedUpcoming.map((ticket) => (
              <div className="ticket-item" key={ticket.key}>
                <img src={toAbsoluteImage(ticket.image)} alt={ticket.eventName} />
                <div>
                  <h3>{ticket.eventName}</h3>
                  <p>{new Date(ticket.eventDate).toLocaleString()}</p>
                  <p>Qty: {ticket.totalQuantity}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <label htmlFor={`refund-qty-${ticket.key}`}>Refund qty</label>
                    <input
                      id={`refund-qty-${ticket.key}`}
                      type="number"
                      min="1"
                      max={ticket.totalQuantity}
                      value={refundQty[ticket.key] || 1}
                      onChange={(e) =>
                        setRefundQty((prev) => ({
                          ...prev,
                          [ticket.key]: e.target.value,
                        }))
                      }
                      style={{ width: 90 }}
                    />
                  </div>
                  <textarea
                    placeholder="Refund reason"
                    value={refundReason[ticket.key] || ""}
                    onChange={(e) =>
                      setRefundReason((prev) => ({ ...prev, [ticket.key]: e.target.value }))
                    }
                  />
                  <button className="ghost-btn" onClick={() => sendRefund(ticket)}>Send refund request</button>
                </div>
              </div>
            ))}
          </div>

          <div className="section-head section-head-spaced">
            <div>
              <p className="section-kicker">History</p>
              <h2>Past Events</h2>
            </div>
          </div>
          <div className="ticket-list">
            {groupedPast.length === 0 && <p>No past tickets.</p>}
            {groupedPast.map((ticket) => (
              <div className="ticket-item" key={ticket.key}>
                <img src={toAbsoluteImage(ticket.image)} alt={ticket.eventName} />
                <div>
                  <h3>{ticket.eventName}</h3>
                  <p>{new Date(ticket.eventDate).toLocaleString()}</p>
                  <p>Qty: {ticket.totalQuantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
