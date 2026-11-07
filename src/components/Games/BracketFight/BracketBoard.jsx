import { useEffect, useRef } from "react";
import { SongCard } from "./SongCard";

function slotState(match, song, currentMatchId) {
  if (!song) return "pending";
  if (match.winner) {
    return match.winner.key === song.key ? "winner" : "loser";
  }
  if (match.id === currentMatchId) return "active";
  return "pending";
}

function MatchCard({ match, currentMatchId, eager }) {
  const isCurrent = match.id === currentMatchId;

  return (
    <div className={`bracket-match${isCurrent ? " is-current" : ""}`}>
      <SongCard
        song={match.a}
        state={slotState(match, match.a, currentMatchId)}
        placeholder={match.roundIndex === 0 ? "BYE" : "TBD"}
        eager={eager}
      />
      <SongCard
        song={match.b}
        state={slotState(match, match.b, currentMatchId)}
        placeholder={match.roundIndex === 0 ? "BYE" : "TBD"}
        eager={eager}
      />
    </div>
  );
}

export function BracketSide({ side, rounds, currentMatchId, eager = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!currentMatchId) return;

    const container = containerRef.current;
    if (!container) return;

    const target = container.querySelector(".bracket-match.is-current");
    if (!target) return;

    const max = container.scrollWidth - container.clientWidth;
    const goal =
      target.offsetLeft + target.offsetWidth / 2 - container.clientWidth / 2;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    container.scrollTo({
      left: Math.min(Math.max(0, goal), Math.max(0, max)),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [currentMatchId, side, rounds]);

  if (rounds.length === 0) return null;

  return (
    <div
      className={`bracket-side bracket-side--${side}`}
      ref={containerRef}
      aria-label={
        side === "full"
          ? "Tournament bracket"
          : `${side} half of the tournament bracket`
      }
    >
      <div className="bracket-side-track">
        {rounds.map((round) => (
          <div className="bracket-round" key={round.roundIndex}>
            <span className="bracket-round-label">{round.label}</span>
            <div className="bracket-round-matches">
              {round.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  currentMatchId={currentMatchId}
                  eager={eager}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
