import { getAssetUrl } from "../../utils/assets";
import "./AlbumBanner.css";
import { Link } from "react-router";

export function AlbumBanner({ album }) {
  return (
    <section
      className="album-banner"
      style={{ backgroundImage: `url(${getAssetUrl(album.cover)})` }}
    >
      <Link
        className="album-banner-btn"
        to={"/discography"}
        style={{ "--album-color": album.color }}
      >
        &#60; Back to discography
      </Link>
      <h2 className="album-banner-title" style={{ color: album.color }}>
        {album.name}
      </h2>
      <p className="album-banner-date" style={{ color: album.color }}>
        Released in {album.release}
      </p>
    </section>
  );
}
