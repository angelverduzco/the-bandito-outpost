import { useState, useEffect } from "react";
import { CONCERTS } from "../../data";
import ConcertCard from "../../components/ConcertCard/ConcertCard";
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
        console.warn("Tour dates API fetch failed, falling back to static list:", error);
        setConcerts(CONCERTS);
      } finally {
        setLoading(false);
      }
    }

    fetchTourDates();
  }, []);

  return (
    <main className="tour-page">
      <h1 className="tour-title">The Clancy Tour: Breach</h1>
      
      {loading ? (
        <div className="tour-loading-container">
          <div className="tour-spinner"></div>
          <p>Loading upcoming tour dates...</p>
        </div>
      ) : (
        <section className="tour-dates">
          {concerts.map((concert, index) => (
            <ConcertCard concert={concert} key={concert.date + "-" + index} />
          ))}
        </section>
      )}
    </main>
  );
}
