import { useState, useEffect } from "react";
import { CONCERTS } from "../../data";
import ConcertCard from "../../components/ConcertCard/ConcertCard";
import concertHeroImg from "../../assets/concert.webp";
import "./TourPage.css";

export default function TourPage() {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTourDates() {
      try {
        const response = await fetch("/api/tour");
        if (!response.ok) {
          throw new Error("Failed to fetch tour dates from Vercel function");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setConcerts(data);
        } else {
          setConcerts(CONCERTS);
        }
      } catch (error) {
        console.warn(
          "Tour dates API fetch failed, falling back to static list:",
          error,
        );
        setConcerts(CONCERTS);
      } finally {
        setLoading(false);
      }
    }

    fetchTourDates();
  }, []);

  return (
    <main className="tour-page">
      <div className="tour-hero">
        <div className="tour-hero-overlay"></div>
        <img
          src={concertHeroImg}
          alt="Twenty One Pilots Live Concert"
          className="tour-hero-img"
        />
        <div className="tour-hero-content">
          <h1 className="tour-hero-title">TOURING DATES</h1>
          <p className="tour-hero-desc">
            Experience the tour that everyone is talking about live on stage.
          </p>
        </div>
      </div>

      <div className="tour-content-container">
        <h2 className="tour-section-title">UPCOMING SHOWS</h2>
        <div className="tour-section-divider"></div>

        {loading ? (
          <div className="tour-loading-container">
            <div className="tour-spinner"></div>
            <p>Loading upcoming tour dates...</p>
          </div>
        ) : (
          <section className="tour-grid">
            {concerts.map((concert, index) => (
              <ConcertCard concert={concert} key={concert.date + "-" + index} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
