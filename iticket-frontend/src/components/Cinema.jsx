import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Cinema.css";

// Demo filmlər
const movies = [
  {
    id: "1",
    title: "ASSASSIN'S CREED",
    desc: "Through Abstergo, a company that creates a revolutionary technology that unlocks his genetic memories, Callum Lynch discovers he is a descendant of the secret Assassins society.",
    duration: "115 min",
    rating: "8.9",
  },
  {
    id: "2",
    title: "The Godfather",
    desc: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    duration: "175 min",
    rating: "9.2",
  },
];

function Cinema() {
  const { id } = useParams();

  // Seçilmiş film
  const movie = movies.find((m) => m.id === id);

  const [selectedDate, setSelectedDate] = useState("5");
  const [selectedTime, setSelectedTime] = useState("20:30");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const days = ["3", "4", "5", "6", "7"];
  const times = ["16:30", "18:30", "20:30", "22:30"];
  const seats = Array.from({ length: 40 }, (_, i) => i + 1);

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  if (!movie) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Movie not found</h2>
        <Link to="/event/cinema">← Back to list</Link>
      </div>
    );
  }

  return (
    <div className="cinema">
      <div className="left">
        <div className="movie-info">
          <h2>{movie.title}</h2>
          <p>{movie.desc}</p>
          <p>
            Duration: {movie.duration} | Rating: {movie.rating}
          </p>
        </div>
      </div>

      <div className="right">
        <div className="section">
          <h3>Select Date</h3>
          <div className="options">
            {days.map((day) => (
              <button
                key={day}
                className={selectedDate === day ? "active" : ""}
                onClick={() => setSelectedDate(day)}
              >
                {day} Jan
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Select Time</h3>
          <div className="options">
            {times.map((t) => (
              <button
                key={t}
                className={selectedTime === t ? "active" : ""}
                onClick={() => setSelectedTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="section">==
          <h3>Select Seats</h3>
          <div className="seats">
            {seats.map((seat) => (
              <div
                key={seat}
                className={`seat ${
                  selectedSeats.includes(seat) ? "selected" : ""
                }`}
                onClick={() => toggleSeat(seat)}
              ></div>
            ))}
          </div>
        </div>

        <button className="cart-btn">
          Add to Cart ({selectedSeats.length} seats)
        </button>
        <br />
        <Link to="/event/cinema">← Back to list</Link>
      </div>
    </div>
  );
}

export default Cinema;
