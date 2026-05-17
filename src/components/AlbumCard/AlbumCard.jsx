import { Link } from "react-router";
import { getAssetUrl } from "../../utils/assets";
import "./AlbumCard.css";

export function AlbumCard({ album, route }) {
  const albumSlug = album.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      to={`/discography/${route}/${albumSlug}`}
      className="album-card"
      style={{
        backgroundColor: album.color,
        "--album-glow": album.color,
      }}
    >
      <div className="album-card-img-wrapper">
        <img
          className="album-card-img"
          src={getAssetUrl(album.cover)}
          alt={`${album.name}'s cover`}
        />
      </div>
      <div className="album-card-info">
        <h3 className="album-card-name">{album.name}</h3>
        <p className="album-card-release">{album.release}</p>
      </div>
    </Link>
  );
}
