import { useEffect } from "react";
import "./LorePage.css";
import { LoreHero } from "../../components/Lore/LoreHero/LoreHero";
import { LoreCard } from "../../components/Lore/LoreCard/LoreCard";
import { StoryTimeline } from "../../components/Lore/StoryTimeline/StoryTimeline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReddit } from "@fortawesome/free-brands-svg-icons";

import { allies } from "../../data/lore/allies";
import { villains } from "../../data/lore/villains";
import { locations } from "../../data/lore/locations";
import { concepts } from "../../data/lore/concepts";
import { symbolsAndArtifacts } from "../../data/lore/symbolsAndArtifacts";
import { storyTimeline } from "../../data/lore/storyline";

import banditoImg from "../../assets/lore/allies/banditos.jpg";
import bishopImg from "../../assets/lore/villains/bishop.webp";

export default function LorePage() {
  useEffect(() => {
    const sections = document.querySelectorAll(".lore-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -80px 0px",
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <main className="lore-page">
      <LoreHero />

      <div className="lore-container">
        {/* Story Section */}
        <section className="lore-section" id="story">
          <h2 className="lore-section-title">The Story</h2>
          <StoryTimeline timeline={storyTimeline} />
        </section>

        {/* Characters Section with mixed images */}
        <section className="lore-section" id="characters">
          <h2 className="lore-section-title">Characters</h2>

          <div className="character-sub-section">
            <div className="character-header">
              <img src={banditoImg} alt="Bandito" className="character-img" />
              <div>
                <h3 className="character-sub-title yellow-text">Allies</h3>
                <p className="character-sub-desc">
                  Those who fight the oppressive regime of Dema.
                </p>
              </div>
            </div>
            <div className="lore-grid">
              {allies.map((ally, i) => (
                <LoreCard key={i} item={ally} type="ally" />
              ))}
            </div>
          </div>

          <div className="character-sub-section">
            <div className="character-header reverse">
              <img src={bishopImg} alt="Bishop" className="character-img" />
              <div>
                <h3 className="character-sub-title red-text">The Bishops</h3>
                <p className="character-sub-desc">
                  The rulers of Dema, representing internal fears and
                  insecurities.
                </p>
              </div>
            </div>
            <div className="lore-grid">
              {villains.map((villain, i) => (
                <LoreCard key={i} item={villain} type="villain" />
              ))}
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="lore-section" id="locations">
          <h2 className="lore-section-title">Locations</h2>
          <div className="lore-grid">
            {locations.map((loc, i) => (
              <LoreCard key={i} item={loc} type="location" />
            ))}
          </div>
        </section>

        {/* Concepts & Symbols */}
        <section className="lore-section" id="concepts">
          <h2 className="lore-section-title">Concepts & Religion</h2>
          <div className="lore-grid">
            {concepts.map((concept, i) => (
              <LoreCard key={i} item={concept} type="concept" />
            ))}
          </div>
        </section>

        <section className="lore-section" id="symbols">
          <h2 className="lore-section-title">Symbols & Artifacts</h2>
          <div className="lore-grid">
            {symbolsAndArtifacts.map((symbol, i) => (
              <LoreCard key={i} item={symbol} type="symbol" />
            ))}
          </div>
        </section>

        {/* Source & Credits Section */}
        <section className="lore-section lore-source-section" id="sources">
          <h2 className="lore-section-title">Credits & Sources</h2>
          <div className="lore-source-card">
            <div className="lore-source-icon">
              <FontAwesomeIcon icon={faReddit} size="2x" />
            </div>
            <div className="lore-source-content">
              <h3>Original Lore Compilation</h3>
              <p>
                The storylines, character roles, and historical timeline
                represented on this fan page are adapted from the incredible,
                detailed compilation by <strong>u/gooooooodboah</strong> and the
                Reddit fan community. You can read the original full analysis
                and participate in the discussion here:
              </p>
              <a
                href="https://www.reddit.com/r/twentyonepilots/comments/18nj865/an_updated_and_detailed_explanation_of_the_lore/"
                target="_blank"
                rel="noopener noreferrer"
                className="lore-source-link"
              >
                <span>Read the full Reddit guide</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
