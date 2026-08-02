import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">Made by: Angel Verduzco</p>
      <div className="footer-links">
        <a
          className="footer-link"
          href="https://github.com/angelverduzco"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            className="footer-icon"
            icon={faGithub}
          />
        </a>
        <a
          className="footer-link"
          href="https://www.linkedin.com/in/angelverduzco"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            className="footer-icon"
            icon={faLinkedin}
          />
        </a>
      </div>
      <p className="footer-disclaimer">
        Disclaimer: This is a non-profit fan website. All content, characters, and storylines mentioned on this site are property and copyright of Twenty One Pilots and their respective owners. No copyright infringement is intended.
      </p>
    </footer>
  );
}
