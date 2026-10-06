import { skills } from "../../data/skills";
import Reveal from "../ui/Reveal";
import { skillIcons } from "./skillIcons";
import "./Skills.css";

function SkillIcon({ name, icon }) {
  const si = skillIcons[icon];
  if (!si) {
    const mark = name.replace(/[^A-Za-z0-9+]/g, "").slice(0, 2);
    return <span className="skill__mono" aria-hidden="true">{mark}</span>;
  }
  return (
    <svg className="skill__icon" viewBox="0 0 24 24" aria-hidden="true" style={{ "--brand": `#${si.hex}` }}>
      <path d={si.path} />
    </svg>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal>
        <h2 className="section__title">Skills</h2>
        <p className="section__sub">The tools I reach for most.</p>
      </Reveal>
      <div className="skills">
        {skills.map((g) => (
          <Reveal key={g.group}>
            <div className="skills__group">
              <h3 className="skills__title">{g.group}</h3>
              <ul className="skills__list">
                {g.items.map((s) => (
                  <li key={s.name} className="skill">
                    <SkillIcon name={s.name} icon={s.icon} />
                    <span>{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
