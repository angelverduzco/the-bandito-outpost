import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { getAssetUrl } from "../../../utils/assets";

export function SongCard({
  song,
  variant = "bracket",
  state = "pending",
  placeholder = null,
  eager = false,
  onClick,
}) {
  if (!song) {
    return (
      <div className={`song-card song-card--${variant} song-card--placeholder`}>
        <span className="song-card-placeholder-label">
          {placeholder ?? "TBD"}
        </span>
      </div>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        className={`song-card song-card--${variant} is-${state}`}
        onClick={onClick}
      >
        <img
          className="song-card-cover"
          src={getAssetUrl(song.albumCover)}
          alt=""
          decoding="async"
        />
        <span className="song-card-info">
          <span className="song-card-title" title={song.title}>
            {song.title}
          </span>
          <span className="song-card-album" title={song.albumName}>
            {song.albumName}
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className={`song-card song-card--${variant} is-${state}`}>
      <img
        className="song-card-cover"
        src={getAssetUrl(song.albumCover)}
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      <span className="song-card-info">
        <span className="song-card-title" title={song.title}>
          {song.title}
        </span>
        <span className="song-card-album" title={song.albumName}>
          {song.albumName}
        </span>
      </span>
      {state === "winner" ? (
        <span className="song-card-check" aria-hidden="true">
          <FontAwesomeIcon icon={faCheck} />
        </span>
      ) : null}
    </div>
  );
}
