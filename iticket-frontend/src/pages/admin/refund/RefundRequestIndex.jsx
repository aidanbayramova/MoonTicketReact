import { useEffect, useMemo, useState } from "react";
import { profileApi } from "../../../api/auth";
import { useAuth } from "../../../context/AuthContext";
import "./RefundAdmin.css";

export default function RefundRequestIndex() {
  const { token } = useAuth();
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [adminNotes, setAdminNotes] = useState({});

  const canProcess = useMemo(() => statusFilter === "Pending", [statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setStatusMessage("");
      const data = await profileApi.adminRefundRequests(token, statusFilter);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setStatusMessage(error.message || "Failed to load refund requests.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token, statusFilter]);

  const approve = async (id) => {
    try {
      setStatusMessage("");
      const res = await profileApi.approveRefundRequest(token, id, { note: adminNotes[id] || "" });
      setStatusMessage(res?.message || "Refund approved.");
      await loadData();
    } catch (error) {
      setStatusMessage(error.message || "Failed to approve refund.");
    }
  };

  const reject = async (id) => {
    try {
      setStatusMessage("");
      const res = await profileApi.rejectRefundRequest(token, id, { note: adminNotes[id] || "" });
      setStatusMessage(res?.message || "Refund rejected.");
      await loadData();
    } catch (error) {
      setStatusMessage(error.message || "Failed to reject refund.");
    }
  };

  if (loading) return <div className="refund-loading">Loading refund requests...</div>;

  const badgeClass = (status) => {
    if (status === "Approved") return "refund-badge approved";
    if (status === "Rejected") return "refund-badge rejected";
    return "refund-badge pending";
  };

  return (
    <div className="refund-admin-wrapper">
      <h2 className="refund-admin-title">Refund Requests</h2>

      <div className="refund-filter-row">
        <label htmlFor="refund-status-filter">Status</label>
        <select
          id="refund-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {statusMessage && <p className="refund-status-msg">{statusMessage}</p>}

      <div className="refund-scroll-shell">
        <table className="refund-table">
          <colgroup>
            <col className="col-user" />
            <col className="col-email" />
            <col className="col-event" />
            <col className="col-date" />
            <col className="col-qty" />
            <col className="col-reason" />
            <col className="col-status" />
            <col className="col-note" />
            <col className="col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Event</th>
              <th>Event Date</th>
              <th>Qty</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" className="refund-empty-cell">
                  No refund request found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="truncate">{item.user?.fullName || "-"}</td>
                  <td className="truncate">{item.user?.email || "-"}</td>
                  <td className="truncate">{item.ticket?.eventName || "-"}</td>
                  <td>
                    {item.ticket?.eventDate
                      ? new Date(item.ticket.eventDate).toLocaleString()
                      : "-"}
                  </td>
                  <td style={{ textAlign: "center" }}>{item.requestedQuantity || 1}</td>
                  <td className="truncate">{item.reason || "-"}</td>
                  <td>
                    <span className={badgeClass(item.status)}>{item.status}</span>
                  </td>
                  <td>
                    {canProcess ? (
                      <input
                        type="text"
                        className="refund-note-input"
                        value={adminNotes[item.id] || ""}
                        placeholder="Add note..."
                        onChange={(e) =>
                          setAdminNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                      />
                    ) : (
                      <span style={{ color: "#aaa" }}>{item.adminNote || "-"}</span>
                    )}
                  </td>
                  <td>
                    {canProcess ? (
                      <div className="refund-action-btns">
                        <button className="refund-btn-approve" onClick={() => approve(item.id)}>
                          Approve
                        </button>
                        <button className="refund-btn-reject" onClick={() => reject(item.id)}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#555" }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}