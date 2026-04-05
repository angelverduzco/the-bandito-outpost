import { AlbumBanner } from "../../components/AlbumBanner/AlbumBanner";
import { useParams } from "react-router";

import "./AlbumPage.css";
import { Tracklist } from "../../components/Tracklist/Tracklist";
import { AlbumOptions } from "../../components/AlbumOptions/AlbumOptions";
import { useEffect } from "react";
import { ALBUMS, LIVE_ALBUMS, EXTENDED_PLAYS, SINGLES } from "../../data";

export function AlbumPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { type, albumName } = useParams();

  const dataMap = {
    albums: ALBUMS,
    "live-albums": LIVE_ALBUMS,
    "extended-plays": EXTENDED_PLAYS,
    singles: SINGLES,
  };

  const dataset = dataMap[type] || [];
  const album = dataset.find(
    (a) => a.name.toLowerCase().replace(/\s+/g, "-") === albumName,
  );

  if (!album) {
    return <p>Album not found</p>;
  }

  return (
    <>
      <AlbumBanner album={album} />
      <main className="album-page">
        <div className="album-page-content">
          <section className="about-section">
            <h2 className="about-section-title">About it</h2>
            <p className="about-section-desc">{album.description}</p>
          </section>
          <Tracklist tracks={album.tracks} />
        </div>
        <AlbumOptions album={album} />
      </main>
    </>
  );
}
