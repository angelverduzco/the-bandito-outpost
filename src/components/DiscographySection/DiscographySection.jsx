import { useRef } from "react";
import "./DiscographySection.css";
import { AlbumCard } from "../AlbumCard/AlbumCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function DiscographySection({ section, elements }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <section className="discography-section">
      <div className="discography-section-header">
        <h2 className="discography-section-title">{section}</h2>
        <div className="discography-section-controls">
          <button
            className="carousel-btn"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button
            className="carousel-btn"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>

      <div className="discography-carousel-container" ref={scrollRef}>
        {elements.map((element) => (
          <div key={element.id} className="carousel-item">
            <AlbumCard
              album={element}
              route={section.toLowerCase().replace(/\s+/g, "-")}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
