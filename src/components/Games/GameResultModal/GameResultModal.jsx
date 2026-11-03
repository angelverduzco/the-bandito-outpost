import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faFlag, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { formatElapsed } from "../../../utils/songGuesser";
import "./GameResultModal.css";

function groupMissedSongs(missed) {
  const groups = new Map();

  missed.forEach((row) => {
    if (!groups.has(row.albumId)) {
      groups.set(row.albumId, {
        albumId: row.albumId,
        albumName: row.albumName,
        songs: [],
      });
    }

    groups.get(row.albumId).songs.push(row.title);
  });

  return Array.from(groups.values());
}

export function GameResultModal({ result, onClose, onPlayAgain }) {
  const titleId = useId();
  const modalRef = useRef(null);
  const { outcome, run, missed, previousBest, isNewRecord } = result;
  const missedGroups = groupMissedSongs(missed);
  const icon = isNewRecord ? faTrophy : outcome === "won" ? faCheck : faFlag;
  const title = isNewRecord
    ? "New personal record!"
    : outcome === "won"
      ? "All songs found!"
      : "Run ended";
  const description = isNewRecord
    ? "You beat your previous best. The Banditos are impressed."
    : outcome === "won"
      ? "You named every track in the studio discography."
      : "You surrendered this run. The missing titles are revealed below.";

  const improvements = [];

  if (previousBest && isNewRecord) {
    if (run.percentage > previousBest.percentage) {
      improvements.push(
        `+${(run.percentage - previousBest.percentage).toFixed(1)}% completion`,
      );
    }
    if (run.timeMs < previousBest.timeMs) {
      improvements.push(
        `${formatElapsed(previousBest.timeMs - run.timeMs)} faster`,
      );
    }
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="game-result-overlay">
      <div
        ref={modalRef}
        className={`game-result-modal${isNewRecord ? " game-result-modal--record" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {isNewRecord ? (
          <span className="game-result-new-record">New record</span>
        ) : null}

        <div
          className={`game-result-icon${isNewRecord ? " game-result-icon--record" : ""}`}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={icon} />
        </div>

        <h2 className="game-result-title" id={titleId}>
          {title}
        </h2>
        <p className="game-result-description">{description}</p>

        <div className="game-result-stats">
          <div className="game-result-stat">
            <span className="game-result-stat-label">Completed</span>
            <strong className="game-result-stat-value">
              {run.percentage.toFixed(1)}%
            </strong>
          </div>
          <div className="game-result-stat">
            <span className="game-result-stat-label">Songs found</span>
            <strong className="game-result-stat-value">
              {run.found} / {run.total}
            </strong>
          </div>
          <div className="game-result-stat">
            <span className="game-result-stat-label">Time</span>
            <strong className="game-result-stat-value">
              {formatElapsed(run.timeMs)}
            </strong>
          </div>
        </div>

        <div className="game-result-best">
          <div className="game-result-best-header">
            <span className="game-result-best-label">
              {isNewRecord ? "Previous best" : "Personal best"}
            </span>
            {isNewRecord ? (
              <span className="game-result-best-new">Record beaten</span>
            ) : null}
          </div>
          {previousBest ? (
            <>
              <p className="game-result-best-value">
                {previousBest.percentage.toFixed(1)}% in{" "}
                {formatElapsed(previousBest.timeMs)}
              </p>
              {improvements.length > 0 ? (
                <p className="game-result-improvement">
                  {improvements.join(" · ")}
                </p>
              ) : null}
            </>
          ) : (
            <p className="game-result-best-value">
              This first run is now your baseline.
            </p>
          )}
        </div>

        {missedGroups.length > 0 ? (
          <section className="game-result-missed" aria-label="Missed songs">
            <h3 className="game-result-section-title">
              Missed songs ({missed.length})
            </h3>
            <div className="game-result-missed-scroll">
              {missedGroups.map((group) => (
                <div className="game-result-missed-group" key={group.albumId}>
                  <h4>{group.albumName}</h4>
                  <ul>
                    {group.songs.map((song, index) => (
                      <li key={`${song}-${index}`}>{song}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="game-result-actions">
          <button
            className="game-result-button game-result-button--primary"
            type="button"
            onClick={onPlayAgain}
          >
            Play again
          </button>
          <button
            className="game-result-button game-result-button--secondary"
            type="button"
            onClick={onClose}
          >
            Review board
          </button>
          <Link className="game-result-link" to="/games">
            Back to games
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
