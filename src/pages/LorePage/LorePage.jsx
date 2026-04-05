import "./LorePage.css";
import { LoreHero } from "../../components/Lore/LoreHero/LoreHero";
import { LoreCard } from "../../components/Lore/LoreCard/LoreCard";
import { StoryTimeline } from "../../components/Lore/StoryTimeline/StoryTimeline";

import { allies } from "../../data/lore/allies";
import { villains } from "../../data/lore/villains";
import { locations } from "../../data/lore/locations";
import { concepts } from "../../data/lore/concepts";
import { events } from "../../data/lore/events";
import { symbolsAndArtifacts } from "../../data/lore/symbolsAndArtifacts";
import { storyTimeline } from "../../data/lore/storyline";

import banditoImg from "../../assets/lore/banditos.jpg";
import bishopImg from "../../assets/lore/bishop.webp";

export default function LorePage() {
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

        <section className="lore-section" id="events">
          <h2 className="lore-section-title">Notable Events</h2>
          <div className="lore-grid">
            {events.map((ev, i) => (
              <LoreCard key={i} item={ev} type="event" />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
