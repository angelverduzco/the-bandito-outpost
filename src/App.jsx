import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { HomePage } from "./pages/HomePage/HomePage";
import { DiscographyPage } from "./pages/DiscographyPage/DiscographyPage";
import { AlbumPage } from "./pages/AlbumPage/AlbumPage";
import TourPage from "./pages/TourPage/TourPage";
import { Route, Routes, BrowserRouter } from "react-router";
import "./App.css";
import LorePage from "./pages/LorePage/LorePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discography" element={<DiscographyPage />} />
          <Route path="/discography/:type/:albumName" element={<AlbumPage />} />
          <Route path="/tour" element={<TourPage />} />
          <Route path="/lore" element={<LorePage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
