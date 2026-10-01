import { useState } from "react";
import { education } from "../../data/education";
import { useWebGL } from "../../hooks/useWebGL";
import Reveal from "../ui/Reveal";
import Globe from "./Globe";
import SchoolPanel from "./SchoolPanel";
import "./Education.css";

export default function Education() {
  const [selection, setSelection] = useState({ id: education[0].id, n: 0 });
  const [globeOk, setGlobeOk] = useState(true);
  const webgl = useWebGL();
  const school = education.find((s) => s.id === selection.id);
  const select = (id) => setSelection((s) => ({ id, n: s.n + 1 }));

  return (
    <section id="education" className="section">
      <Reveal>
        <h2 className="section__title">Education</h2>
        <p className="section__sub">From Hyderabad to San Jose. Drag the globe, or pick a school.</p>
      </Reveal>
      <div className="edu">
        {webgl && globeOk && (
          <Reveal className="edu__globe">
            <Globe
              schools={education}
              selectedId={selection.id}
              focusKey={selection.n}
              onSelect={select}
              onUnavailable={() => setGlobeOk(false)}
            />
          </Reveal>
        )}
        <div className="edu__detail">
          <div role="tablist" aria-label="Schools" className="edu__tabs">
            {education.map((s) => (
              <button
                key={s.id}
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={s.id === selection.id}
                aria-controls={`panel-${s.id}`}
                onClick={() => select(s.id)}
              >
                {s.shortName}
              </button>
            ))}
          </div>
          <SchoolPanel school={school} />
        </div>
      </div>
    </section>
  );
}
