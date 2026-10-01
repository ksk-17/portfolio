import { useState } from "react";
import { profile } from "../../data/profile";
import { useActiveSection } from "../../hooks/useActiveSection";
import "./Nav.css";

const links = [
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
const observed = ["education", "experience", "projects"];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(observed);
  return (
    <header className="nav">
      <nav className="nav__inner" aria-label="Primary">
        <a className="nav__brand" href="#top">{profile.shortName}</a>
        <button className="nav__toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
        <ul id="nav-links" className="nav__links" data-open={open}>
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
