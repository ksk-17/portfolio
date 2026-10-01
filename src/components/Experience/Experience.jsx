import { experience } from "../../data/experience";
import Reveal from "../ui/Reveal";
import StackCard from "./StackCard";
import "./Experience.css";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <Reveal>
        <h2 className="section__title">Experience</h2>
        <p className="section__sub">Research, and building enterprise-scale platforms.</p>
      </Reveal>
      <div className="stack">
        {experience.map((item, i) => <StackCard key={item.id} item={item} index={i} />)}
      </div>
    </section>
  );
}
