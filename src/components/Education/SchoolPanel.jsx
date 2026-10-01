import { AnimatePresence, motion } from "motion/react";
import Logo from "../ui/Logo";
import { asset } from "../../lib/asset";

export default function SchoolPanel({ school }) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={school.id}
        className="school"
        role="tabpanel"
        id={`panel-${school.id}`}
        aria-labelledby={`tab-${school.id}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <header className="school__head">
          <Logo src={asset(school.logo)} name={school.shortName} size={56} />
          <div>
            <h3 className="school__degree">{school.degree}</h3>
            <p className="school__meta">{school.school} · {school.dates}</p>
            <p className="school__meta">GPA {school.gpa} · {school.location.label}</p>
          </div>
        </header>
        {school.highlights.map((h) => (
          <div key={h.title} className="school__highlight">
            <h4>{h.title}</h4>
            <p>{h.text}</p>
          </div>
        ))}
        <h4 className="school__label">Coursework</h4>
        <ul className="chips">
          {school.coursework.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </motion.article>
    </AnimatePresence>
  );
}
