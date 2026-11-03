import { NavLink } from "react-router";
import "./Header.css";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Discography", path: "/discography" },
    { name: "Tour", path: "/tour" },
    { name: "Lore", path: "/lore" },
    { name: "Games", path: "/games" },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <NavLink className="header-title" to="/">
        The Bandito Outpost
      </NavLink>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <ul className="header-nav-list">
          {navItems.map((item) => (
            <li className="list-item" key={item.name}>
              <NavLink
                className="list-link"
                to={item.path}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
