import { useEffect } from "react";
import { useParams } from "react-router";
import { GAMES } from "../../data/games";
import ButtonLink from "../../components/Button/ButtonLink";
import { SongGuesser } from "../../components/Games/SongGuesser/SongGuesser";
import { BracketFight } from "../../components/Games/BracketFight/BracketFight";
import "./GamePage.css";

const GAME_COMPONENTS = {
  "discography-master": SongGuesser,
  "bracket-fight": BracketFight,
};

export function GamePage() {
  const { gameId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const game = GAMES.find((item) => item.id === gameId);

  if (!game) {
    return (
      <main className="game-page">
        <div className="game-content-container">
          <section className="game-coming-soon">
            <h1 className="game-coming-soon-title">Game not found</h1>
            <p className="game-coming-soon-text">
              That game does not exist yet. Head back to the games page to see
              what is available.
            </p>
            <ButtonLink to="/games">Back to games</ButtonLink>
          </section>
        </div>
      </main>
    );
  }

  const GameComponent = GAME_COMPONENTS[game.id];

  return (
    <main className="game-page">
      <section
        className="game-hero"
        style={{ backgroundImage: `url(${game.image})` }}
      >
        <div className="game-hero-overlay">
          <h1 className="game-hero-title">{game.name}</h1>
          <p className="game-hero-subtitle">{game.description}</p>
        </div>
      </section>

      {GameComponent ? (
        <GameComponent />
      ) : (
        <div className="game-content-container">
          <section className="game-coming-soon">
            <span className="game-status-badge">Coming soon</span>
            <h2 className="game-coming-soon-title">This game is being built</h2>
            <p className="game-coming-soon-text">
              The challenge is on its way. Check back soon to put your Twenty
              One Pilots knowledge to the test.
            </p>
            <ButtonLink to="/games">Back to games</ButtonLink>
          </section>
        </div>
      )}
    </main>
  );
}
