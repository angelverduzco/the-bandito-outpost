import { Link } from "react-router";
import "./GameCard.css";

export function GameCard({ game }) {
  const isComingSoon = game.status === "coming-soon";

  return (
    <Link className="game-card" to={`/games/${game.id}`}>
      <div className="game-card-image-wrapper">
        <img
          className="game-card-image"
          src={game.image}
          alt={`${game.name} artwork`}
        />
        <span className="game-card-badge">
          {isComingSoon ? "Coming soon" : "Play"}
        </span>
      </div>
      <div className="game-card-body">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-description">{game.description}</p>
        <span className="game-card-link">
          {isComingSoon ? "Preview game" : "Play now"}
        </span>
      </div>
    </Link>
  );
}
