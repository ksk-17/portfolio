import { useEffect, useRef } from "react";
import { projects, moreProjects } from "../../data/projects";
import Reveal from "../ui/Reveal";
import ProjectCard from "./ProjectCard";
import "./Projects.css";

export default function Projects() {
  const track = useRef(null);

  function scrollByCard(dir) {
    const el = track.current;
    const card = el.querySelector(".pcard");
    const step = (card?.getBoundingClientRect().width || 320) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  // Every 10s, nudge the track sideways and back so it reads as scrollable.
  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let paused = false;
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);
    let back;
    const id = setInterval(() => {
      if (paused || document.hidden) return;
      el.scrollBy({ left: 90, behavior: "smooth" });
      back = setTimeout(() => { if (!paused) el.scrollBy({ left: -90, behavior: "smooth" }); }, 900);
    }, 10000);
    return () => {
      clearInterval(id);
      clearTimeout(back);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, []);

  return (
    <section id="projects" className="section">
      <Reveal>
        <h2 className="section__title">Projects</h2>
        <p className="section__sub">Recent work in multi-agent systems, LLM alignment, computer vision and retrieval.</p>
      </Reveal>
      <div
        ref={track}
        className="carousel"
        role="region"
        aria-label="Projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollByCard(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollByCard(-1);
          }
        }}
      >
        {projects.map((p) => <ProjectCard key={p.slug} project={p} />)}
        <a className="pcard pcard--more" href={moreProjects.href} target="_blank" rel="noopener noreferrer">
          <span className="pcard--more__label">{moreProjects.label}</span>
          <span className="pcard--more__arrow" aria-hidden="true">↗</span>
          <span className="pcard--more__sub">github.com/ksk-17</span>
        </a>
      </div>
    </section>
  );
}
