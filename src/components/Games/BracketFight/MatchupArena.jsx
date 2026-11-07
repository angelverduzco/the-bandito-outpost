import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { getAssetUrl } from "../../../utils/assets";
import {
  getChampion,
  getNextMatch,
  getRoundLabel,
} from "../../../utils/bracketFight";
import { SongCard } from "./SongCard";

export function MatchupArena({
  tournament,
  onVote,
  onRestart,
  onExport,
  exporting,
}) {
  const match = getNextMatch(tournament);
  const champion = getChampion(tournament);

  return (
    <aside className="bracket-arena" aria-label="Current matchup">
      <div className="bracket-arena-inner">
        {champion ? (
          <div className="bracket-arena-champion">
            <span className="bracket-champion-trophy" aria-hidden="true">
              <FontAwesomeIcon icon={faTrophy} />
            </span>
            <span className="bracket-arena-round">Your champion</span>
            <img
              className="bracket-champion-cover"
              src={getAssetUrl(champion.albumCover)}
              alt={`${champion.title} album artwork`}
            />
            <h2 className="bracket-champion-title">{champion.title}</h2>
            <p className="bracket-champion-album">{champion.albumName}</p>
            <div className="bracket-arena-actions">
              <button
                type="button"
                className="bracket-button"
                onClick={onExport}
                disabled={exporting}
              >
                {exporting ? "Preparing…" : "Export bracket image"}
              </button>
              <button
                type="button"
                className="bracket-button bracket-button--ghost"
                onClick={onRestart}
              >
                New tournament
              </button>
            </div>
          </div>
        ) : match ? (
          <div className="bracket-arena-match-wrap" key={match.id}>
            <span className="bracket-arena-round">
              {getRoundLabel(match.roundIndex, tournament.target)}
            </span>
            <p className="bracket-arena-sub">
              Pick the song that deserves to advance.
            </p>
            <div className="bracket-arena-match">
              <SongCard
                variant="arena"
                song={match.a}
                onClick={() => onVote(match.id, match.a.key)}
              />
              <span className="arena-vs" aria-hidden="true">
                VS
              </span>
              <SongCard
                variant="arena"
                song={match.b}
                onClick={() => onVote(match.id, match.b.key)}
              />
            </div>
            <span className="bracket-arena-hint">Tap a song to advance it</span>
            <span className="sr-only" role="status">
              Now voting: {match.a.title} versus {match.b.title}
            </span>
          </div>
        ) : (
          <div className="bracket-arena-empty">
            <span className="bracket-arena-round">Nothing to vote yet</span>
            <p className="bracket-arena-sub">
              Start the tournament by picking songs on the field.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
