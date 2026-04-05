import { Banner } from "../../components/Banner/Banner";
import { AlbumsSection } from "../../components/AlbumsSection/AlbumsSection";
import { BandSection } from "../../components/BandSection/BandSection";
import { MembersSection } from "../../components/MembersSection/MembersSection";
import "./HomePage.css";

export function HomePage() {
  return (
    <main className="home-page">
      <Banner />
      <BandSection />
      <MembersSection />
      <AlbumsSection />
    </main>
  );
}
