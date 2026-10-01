import { useRef } from "react";
import { projects } from "../../data/projects";
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

  return (
    <section id="projects" className="section">
      <Reveal>
        <h2 className="section__title">Projects</h2>
        <p className="section__sub">Selected work in LLMs, generative models and recommender systems.</p>
      </Reveal>
      <div className="carousel__controls">
        <button onClick={() => scrollByCard(-1)} aria-label="Previous project">←</button>
        <button onClick={() => scrollByCard(1)} aria-label="Next project">→</button>
      </div>
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
      </div>
    </section>
  );
}
