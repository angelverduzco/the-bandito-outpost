import "./Banner.css";
import banner from "../../assets/banner.png";

export function Banner() {
  return (
    <section
      className="banner"
      style={{
        background: `url(${banner}) center bottom / contain no-repeat, radial-gradient(circle at 0% 0%, #8a701f 0%, transparent 70%), radial-gradient(circle at 100% 100%, #6b1b1b 0%, transparent 70%), linear-gradient(135deg, #1c1c1c 0%, #2f2d2d 100%)`,
      }}
    >
      <h1 className="banner-title">Welcome to the Resistance</h1>
      <p className="banner-text">
        Together, we push on through. Welcome to a world where the Banditos
        thrive.
      </p>
    </section>
  );
}
