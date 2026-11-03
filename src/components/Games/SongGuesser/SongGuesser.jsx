import { useCallback, useEffect, useRef, useState } from "react";
import { ALBUMS } from "../../../data/albums";
import {
  buildSongIndex,
  formatElapsed,
  isBetterRun,
  loadBestRun,
  normalizeSongTitle,
  saveBestRun,
} from "../../../utils/songGuesser";
import { AlbumSongTable } from "./AlbumSongTable";
import { GameResultModal } from "../GameResultModal/GameResultModal";
import "./SongGuesser.css";

const SONG_INDEX = buildSongIndex(ALBUMS);

export function SongGuesser() {
  const [status, setStatus] = useState("idle");
  const [revealed, setRevealed] = useState(() => new Set());
  const [inputValue, setInputValue] = useState("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [bestRun, setBestRun] = useState(loadBestRun);
  const [result, setResult] = useState(null);

  const inputRef = useRef(null);
  const startTimeRef = useRef(null);

  const { albums, rows, titleIndex, total } = SONG_INDEX;
  const foundCount = revealed.size;
  const percentage = Number(((foundCount / total) * 100).toFixed(1));

  const finishGame = useCallback(
    (outcome, revealedSet, timeMs) => {
      const found = revealedSet.size;
      const runPercentage = Number(((found / total) * 100).toFixed(1));
      const run = {
        found,
        total,
        percentage: runPercentage,
        timeMs,
        completedAt: new Date().toISOString(),
      };
      const previousBest = bestRun;
      const isNewRecord = previousBest ? isBetterRun(run, previousBest) : false;
      const missed = rows.filter((row) => !revealedSet.has(row.key));

      if (!previousBest || isNewRecord) {
        setBestRun(run);
        saveBestRun(run);
      }

      startTimeRef.current = null;
      setElapsedMs(timeMs);
      setInputValue("");
      setResult({ outcome, run, missed, previousBest, isNewRecord });
      setStatus(outcome);
    },
    [bestRun, rows, total],
  );

  useEffect(() => {
    if (status !== "playing") return undefined;

    const intervalId = setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsedMs(Date.now() - startTimeRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status === "playing") {
      inputRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === "playing" && revealed.size === total) {
      const timeMs =
        startTimeRef.current === null ? 0 : Date.now() - startTimeRef.current;
      finishGame("won", revealed, timeMs);
    }
  }, [finishGame, revealed, status, total]);

  const handleStart = () => {
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    setInputValue("");
    setStatus("playing");
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    if (status !== "playing") return;

    const normalized = normalizeSongTitle(value);
    const matches = normalized ? titleIndex.get(normalized) : undefined;

    if (!matches) {
      setInputValue(value);
      return;
    }

    setInputValue("");
    setRevealed((current) => {
      const next = new Set(current);
      matches.forEach((key) => next.add(key));
      return next.size === current.size ? current : next;
    });
  };

  const handleSurrender = () => {
    if (status !== "playing") return;

    const timeMs =
      startTimeRef.current === null
        ? elapsedMs
        : Date.now() - startTimeRef.current;
    finishGame("surrendered", revealed, timeMs);
  };

  const handlePlayAgain = () => {
    startTimeRef.current = null;
    setStatus("idle");
    setRevealed(new Set());
    setInputValue("");
    setElapsedMs(0);
    setResult(null);
  };

  const handleCloseResult = useCallback(() => {
    setResult(null);
  }, []);

  const bestLabel = bestRun
    ? `${bestRun.percentage.toFixed(1)}% in ${formatElapsed(bestRun.timeMs)}`
    : "No run recorded yet";

  return (
    <section className="song-guesser" aria-label="Guess the Songs game">
      <div className="song-guesser-toolbar">
        <div className="song-guesser-stats">
          <div className="song-guesser-stat">
            <span className="song-guesser-stat-label">Time</span>
            <strong className="song-guesser-stat-value">
              {formatElapsed(elapsedMs)}
            </strong>
          </div>
          <div className="song-guesser-stat">
            <span className="song-guesser-stat-label">Songs found</span>
            <strong className="song-guesser-stat-value">
              {foundCount} / {total}
            </strong>
          </div>
          <div className="song-guesser-stat">
            <span className="song-guesser-stat-label">Progress</span>
            <strong className="song-guesser-stat-value">
              {percentage.toFixed(1)}%
            </strong>
          </div>
        </div>

        <div
          className="song-guesser-progress"
          role="progressbar"
          aria-label="Songs found"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
        >
          <span
            className="song-guesser-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {status === "idle" ? (
          <div className="song-guesser-start">
            <p className="song-guesser-start-text">
              Name all {total} tracks across {albums.length} studio albums.
              Titles reveal the moment your typing matches—no Enter needed. The
              timer starts when you press start.
            </p>
            <button
              className="song-guesser-button song-guesser-button--primary"
              type="button"
              onClick={handleStart}
            >
              Start game
            </button>
          </div>
        ) : (
          <div className="song-guesser-input-row">
            <input
              ref={inputRef}
              id="song-guess-input"
              className="song-guesser-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={
                status === "playing" ? "Type a song title..." : "Run finished"
              }
              aria-label="Guess a song title"
              autoComplete="off"
              spellCheck={false}
              disabled={status !== "playing"}
            />
            {status === "playing" ? (
              <button
                className="song-guesser-button song-guesser-button--danger"
                type="button"
                onClick={handleSurrender}
              >
                Surrender
              </button>
            ) : (
              <button
                className="song-guesser-button song-guesser-button--primary"
                type="button"
                onClick={handlePlayAgain}
              >
                Play again
              </button>
            )}
          </div>
        )}

        <p className="song-guesser-best">Best run: {bestLabel}</p>
      </div>

      <div className="song-guesser-albums">
        {albums.map((album) => (
          <AlbumSongTable
            key={album.id}
            album={album}
            revealed={revealed}
            status={status}
          />
        ))}
      </div>

      {result ? (
        <GameResultModal
          result={result}
          onClose={handleCloseResult}
          onPlayAgain={handlePlayAgain}
        />
      ) : null}
    </section>
  );
}
