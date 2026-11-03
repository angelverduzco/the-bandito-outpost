import { useEffect } from "react";
import { GAMES } from "../../data/games";
import { GameCard } from "../../components/GameCard/GameCard";
import gamesHeroImg from "../../assets/discography-hero.png";
import "./GamesPage.css";

export function GamesPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  return (
    <main className="games-page">
      <section
        className="games-hero"
        style={{ backgroundImage: `url(${gamesHeroImg})` }}
      >
        <div className="games-hero-overlay">
          <h1 className="games-hero-title">Games</h1>
          <p className="games-hero-subtitle">
            Test your knowledge of Twenty One Pilots with quizzes and challenges
            made for the Clique.
          </p>
        </div>
      </section>

      <div className="games-content">
        <h2 className="games-section-title">Choose Your Challenge</h2>
        <div className="games-section-divider"></div>

        <section className="games-grid">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </section>
      </div>
    </main>
  );
}
