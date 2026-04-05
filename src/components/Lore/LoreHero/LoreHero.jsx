import "./LoreHero.css";
import demaImg from "../../../assets/lore/dema.jpg";

export function LoreHero() {
  return (
    <section
      className="lore-hero"
      style={{ backgroundImage: `url(${demaImg})` }}
    >
      <div className="lore-hero-overlay">
        <h1 className="lore-hero-title">The Lore of Twenty One Pilots</h1>
        <p className="lore-hero-subtitle">
          Explore the dystopian city of Dema, the wild lands of Trench, and the
          continuous battle between the Banditos and the Bishops.
        </p>
      </div>
    </section>
  );
}
