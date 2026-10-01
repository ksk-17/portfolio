import { useState } from "react";
import { education } from "../../data/education";
import { useWebGL } from "../../hooks/useWebGL";
import Reveal from "../ui/Reveal";
import Globe from "./Globe";
import SchoolPanel from "./SchoolPanel";
import "./Education.css";

export default function Education() {
  const [selectedId, setSelectedId] = useState(education[0].id);
  const webgl = useWebGL();
  const school = education.find((s) => s.id === selectedId);

  return (
    <section id="education" className="section">
      <Reveal>
        <h2 className="section__title">Education</h2>
        <p className="section__sub">From Hyderabad to San Jose. Drag the globe, or pick a school.</p>
      </Reveal>
      <div className="edu">
        {webgl && (
          <Reveal className="edu__globe">
            <Globe schools={education} selectedId={selectedId} onSelect={setSelectedId} />
          </Reveal>
        )}
        <div className="edu__detail">
          <div role="tablist" aria-label="Schools" className="edu__tabs">
            {education.map((s) => (
              <button
                key={s.id}
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={s.id === selectedId}
                aria-controls={`panel-${s.id}`}
                onClick={() => setSelectedId(s.id)}
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
