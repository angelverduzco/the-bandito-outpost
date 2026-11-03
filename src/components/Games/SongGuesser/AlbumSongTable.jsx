import { memo } from "react";
import { getAssetUrl } from "../../../utils/assets";
import "./AlbumSongTable.css";

export const AlbumSongTable = memo(function AlbumSongTable({
  album,
  revealed,
  status,
}) {
  const isGameOver = status === "won" || status === "surrendered";

  return (
    <section className="song-album" aria-labelledby={`album-${album.id}-title`}>
      <header className="song-album-header">
        <img
          className="song-album-cover"
          src={getAssetUrl(album.cover)}
          alt={`${album.name} album cover`}
          loading="lazy"
        />
        <div className="song-album-info">
          <h3 className="song-album-title" id={`album-${album.id}-title`}>
            {album.name}
          </h3>
          <p className="song-album-meta">
            {album.release} · {album.rows.length} tracks
          </p>
        </div>
      </header>

      <table className="song-table">
        <thead>
          <tr className="song-table-header">
            <th className="song-table-number" scope="col">
              #
            </th>
            <th scope="col">Song</th>
          </tr>
        </thead>
        <tbody>
          {album.rows.map((row) => {
            const isRevealed = revealed.has(row.key);
            const isMissed = !isRevealed && isGameOver;
            const state = isRevealed ? "found" : isMissed ? "missed" : "hidden";

            return (
              <tr
                key={row.key}
                className={`song-table-row song-table-row--${state}`}
              >
                <td className="song-table-number">{row.trackId}</td>
                <td className="song-table-title">
                  <span
                    className={`song-table-status song-table-status--${state}`}
                    aria-hidden="true"
                  >
                    {isRevealed ? "✓" : isMissed ? "✕" : "•"}
                  </span>
                  {isRevealed || isMissed ? (
                    <span>{row.title}</span>
                  ) : (
                    <span
                      className="song-table-masked"
                      aria-label="Hidden song"
                    >
                      ••••••••••
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
});
