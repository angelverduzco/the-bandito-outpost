import { useCallback, useEffect, useRef, useState } from "react";
import { getAssetUrl } from "../../../utils/assets";
import {
  buildSongPool,
  castVote,
  countVotesCast,
  createTournament,
  getChampion,
  getFullRounds,
  getNextMatch,
  getRoundLabel,
  getSideRounds,
} from "../../../utils/bracketFight";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { BracketSetup } from "./BracketSetup";
import { BracketSide } from "./BracketBoard";
import { MatchupArena } from "./MatchupArena";
import { SongCard } from "./SongCard";
import "./BracketFight.css";

function waitForAlbumImages(node) {
  const images = Array.from(node.querySelectorAll("img"));
  const imageLoads = Promise.all(
    images.map((image) =>
      image.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
    ),
  );
  const timeout = new Promise((resolve) => {
    setTimeout(resolve, 8000);
  });

  return Promise.race([imageLoads, timeout]);
}

async function captureBracket(node) {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  await waitForAlbumImages(node);
  const { toPng } = await import("html-to-image");
  return toPng(node, {
    backgroundColor: "#1c1c1c",
    pixelRatio: 2,
    cacheBust: true,
    skipFonts: true,
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: {
      position: "static",
      left: "auto",
      top: "auto",
      zIndex: "auto",
      margin: "0",
      transform: "none",
    },
  });
}

export function BracketFight() {
  const [tournament, setTournament] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const exportRef = useRef(null);
  const isCompact = useMediaQuery("(max-width: 1024px)");

  const handleStart = useCallback((config) => {
    const pool = buildSongPool(config.selectedReleases);
    setTournament(createTournament(pool, config.size));
  }, []);

  const handleVote = useCallback((matchId, songKey) => {
    setTournament((current) =>
      current ? castVote(current, matchId, songKey) : current,
    );
  }, []);

  const endTournament = useCallback(() => {
    setTournament(null);
  }, []);

  const handleRestart = useCallback(() => {
    if (
      tournament &&
      !window.confirm("Start a new tournament? Current progress will be lost.")
    ) {
      return;
    }
    endTournament();
  }, [tournament, endTournament]);

  const handleExport = useCallback(() => {
    setExportError(null);
    setExporting(true);
  }, []);

  useEffect(() => {
    if (!exporting) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const node = exportRef.current;
        if (!node) throw new Error("Export surface is not mounted.");

        const dataUrl = await captureBracket(node);
        if (cancelled) return;

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `bracket-fight-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        if (!cancelled) setExporting(false);
      } catch {
        if (!cancelled) {
          setExportError("We could not generate the image. Please try again.");
          setExporting(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [exporting]);

  if (!tournament) {
    return <BracketSetup onStart={handleStart} />;
  }

  const sides = getSideRounds(tournament);
  const currentMatch = getNextMatch(tournament);
  const champion = getChampion(tournament);
  const votesCast = countVotesCast(tournament);
  const finalMatch = tournament.rounds[tournament.rounds.length - 1][0];

  const finalSlotState = (song) => {
    if (!finalMatch.winner || !song) return "pending";
    return finalMatch.winner.key === song.key ? "winner" : "loser";
  };

  return (
    <section className="bracket-fight" aria-label="Bracket Fight game">
      <div className="bracket-topbar">
        <div className="bracket-topbar-info">
          <h2 className="bracket-topbar-title">Bracket Fight</h2>
          <p className="bracket-topbar-progress">
            {currentMatch
              ? `${getRoundLabel(currentMatch.roundIndex, tournament.target)} · ${votesCast} of ${tournament.votesNeeded} matchups voted`
              : "Tournament complete"}
          </p>
        </div>
        <div className="bracket-topbar-actions">
          <button
            type="button"
            className="bracket-button"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? "Preparing…" : "Export bracket"}
          </button>
          <button
            type="button"
            className="bracket-button bracket-button--ghost"
            onClick={handleRestart}
          >
            New bracket
          </button>
        </div>
      </div>

      {exportError ? (
        <p className="bracket-export-error" role="alert">
          {exportError}
        </p>
      ) : null}

      <div className="bracket-stage">
        <MatchupArena
          tournament={tournament}
          onVote={handleVote}
          onRestart={endTournament}
          onExport={handleExport}
          exporting={exporting}
        />
        {isCompact ? (
          <BracketSide
            side="full"
            rounds={getFullRounds(tournament)}
            currentMatchId={currentMatch ? currentMatch.id : null}
          />
        ) : (
          <>
            <BracketSide
              side="left"
              rounds={sides.left}
              currentMatchId={currentMatch ? currentMatch.id : null}
            />
            <BracketSide
              side="right"
              rounds={sides.right}
              currentMatchId={currentMatch ? currentMatch.id : null}
            />
          </>
        )}
      </div>

      {exporting ? (
        <div
          className="bracket-export-surface"
          ref={exportRef}
          aria-hidden="true"
        >
          <header className="bracket-export-header">
            <span className="bracket-export-kicker">
              The Bandito Outpost · Bracket Fight
            </span>
            <h2 className="bracket-export-title">
              Tournament of {tournament.songCount} songs
            </h2>
            <p className="bracket-export-meta">
              {tournament.target > tournament.songCount
                ? `${tournament.songCount} songs + ${tournament.target - tournament.songCount} byes`
                : `${tournament.songCount} songs`}
              {" · "}
              {new Date().toLocaleDateString()}
            </p>
            <p className="bracket-export-champ-line">
              Champion:{" "}
              {champion ? `${champion.title} — ${champion.albumName}` : "TBD"}
            </p>
          </header>
          <div className="bracket-export-board">
            <BracketSide
              side="left"
              rounds={sides.left}
              currentMatchId={null}
              eager
            />
            <div className="bracket-export-center">
              <span className="bracket-export-center-label">Final</span>
              <SongCard
                song={finalMatch.a}
                state={finalSlotState(finalMatch.a)}
                eager
              />
              <SongCard
                song={finalMatch.b}
                state={finalSlotState(finalMatch.b)}
                eager
              />
              {champion ? (
                <div className="bracket-export-champion">
                  <span className="bracket-export-champion-kicker">
                    Champion
                  </span>
                  <img
                    className="bracket-export-champion-cover"
                    src={getAssetUrl(champion.albumCover)}
                    alt=""
                  />
                  <span className="bracket-export-champion-title">
                    {champion.title}
                  </span>
                  <span className="bracket-export-champion-album">
                    {champion.albumName}
                  </span>
                </div>
              ) : null}
            </div>
            <BracketSide
              side="right"
              rounds={sides.right}
              currentMatchId={null}
              eager
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
