import { useRef } from "react";
import "./AlbumsSection.css";
import { AlbumCard } from "../AlbumCard/AlbumCard";
import ButtonLink from "../Button/ButtonLink";
import { ALBUMS } from "../../data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function AlbumsSection() {
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
    <section className="albums-section">
      <div className="albums-section-header">
        <h2 className="albums-section-title">Discography</h2>
        <div className="albums-section-controls">
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

      <div className="albums-carousel-container" ref={scrollRef}>
        {ALBUMS.map((album) => (
          <div key={album.id} className="carousel-item">
            <AlbumCard album={album} route={"albums"} />
          </div>
        ))}
      </div>

      <div className="albums-section-footer">
        <ButtonLink to={"/discography"}>View all</ButtonLink>
      </div>
    </section>
  );
}
