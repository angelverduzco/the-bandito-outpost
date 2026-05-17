import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import "./ConcertCard.css";

export default function ConcertCard({ concert }) {
  // Clean dates like "JUN. 19 - 21, 2026" or "OCT. 20, 2025"
  // Split month/day/year to make a premium date block if possible
  const dateParts = concert.date.split(" ");
  const month = dateParts[0] || "";
  const rest = dateParts.slice(1).join(" ") || "";

  return (
    <div className="concert-card">
      <div className="concert-card-header">
        <div className="concert-date-badge">
          <span className="date-badge-month">{month}</span>
          <span className="date-badge-day">{rest.replace(",", "")}</span>
        </div>
        <div className="concert-venue-tag">
          <FontAwesomeIcon className="concert-venue-icon" icon={faMusic} />
          LIVE SHOW
        </div>
      </div>

      <div className="concert-card-body">
        <h3 className="concert-venue-name">{concert.venue}</h3>
        <p className="concert-location">
          <FontAwesomeIcon
            className="concert-location-icon"
            icon={faLocationDot}
          />
          {concert.location}
        </p>
      </div>

      <a
        className="concert-card-tickets-btn"
        href={concert.tickets}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>GET TICKETS</span>
      </a>
    </div>
  );
}
