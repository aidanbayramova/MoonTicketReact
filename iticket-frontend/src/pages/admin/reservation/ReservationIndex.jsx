import { useState, useEffect } from "react";
import { sortNewestFirst } from "../utils/sortNewestFirst";
import "./ReservationIndex.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5149";

export default function ReservationIndex() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Yetkilendirme gerekli");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/baskets/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(sortNewestFirst(data));
      } else if (response.status === 404) {
        setReservations([]);
      } else {
        setError("Rezervasyonlar yüklənilərkən xəta");
      }
    } catch (err) {
      console.error("Hata:", err);
      setError(err.message || "Bir xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm("Bu rezervasiyanı ləğv etmək istəyirsiniz?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/api/baskets/${reservationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setReservations(
          reservations.filter((r) => r.id !== reservationId)
        );
        alert("Rezervasiya ləğv edildi");
      } else {
        alert("Rezervasiya ləğv edilə biləmdi");
      }
    } catch (err) {
      alert("Xəta: " + err.message);
    }
  };

  if (loading) {
    return <div className="reservation-loading">Yüklənir...</div>;
  }

  if (error) {
    return <div className="reservation-error">{error}</div>;
  }

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <h2>Rezervasiyalar</h2>
        <p className="reservation-count">Cəmi: {reservations.length}</p>
      </div>

      {reservations.length === 0 ? (
        <div className="reservation-empty">
          <p>Hən bir rezervasiya yoxdur</p>
        </div>
      ) : (
        <div className="reservation-table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>İstifadəçi</th>
                <th>Məhsul</th>
                <th>Miqdar</th>
                <th>Qiymət</th>
                <th>Tarix</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.userId || "-"}</td>
                  <td>{reservation.productName || "Məhsul"}</td>
                  <td>{reservation.quantity || 1}</td>
                  <td>{reservation.totalPrice || 0} ₼</td>
                  <td>
                    {reservation.createdAt
                      ? new Date(reservation.createdAt).toLocaleDateString("az-AZ")
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Ləğv Et
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
