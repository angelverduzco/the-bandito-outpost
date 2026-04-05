import "./DiscographyPage.css";
import { useEffect } from "react";
import DiscographySection from "../../components/DiscographySection/DiscographySection";
import { ALBUMS, LIVE_ALBUMS, EXTENDED_PLAYS, SINGLES } from "../../data";
import bannerImg from "../../assets/discography-hero.png";

export function DiscographyPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const SECTIONS = [
    { section: "Albums", elements: ALBUMS },
    { section: "Live Albums", elements: LIVE_ALBUMS },
    { section: "Extended Plays", elements: EXTENDED_PLAYS },
    { section: "Singles", elements: SINGLES },
  ];

  return (
    <main className="discography-page">
      <section
        className="discography-hero"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <div className="discography-hero-overlay">
          <h1 className="discography-hero-title">Discography</h1>
          <p className="discography-hero-subtitle">
            Explore the complete musical journey of Twenty One Pilots.
          </p>
        </div>
      </section>
      {SECTIONS.map(({ section, elements }, index) => (
        <DiscographySection key={index} section={section} elements={elements} />
      ))}
    </main>
  );
}
