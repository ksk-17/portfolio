import { useState } from "react";
import { profile } from "../../data/profile";
import { useActiveSection } from "../../hooks/useActiveSection";
import ThemeToggle from "./ThemeToggle";
import "./Nav.css";

const links = [
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
const observed = ["education", "experience", "skills", "projects", "contact"];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(observed);
  return (
    <header className="nav">
      <nav className="nav__inner" aria-label="Primary">
        <a className="nav__brand" href="#top">{profile.name}</a>
        <ul id="nav-links" className="nav__links" data-open={open}>
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav__actions">
          <ThemeToggle />
          <button className="nav__toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
    </header>
  );
}
