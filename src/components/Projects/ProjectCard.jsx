import { motion } from "motion/react";
import Cover from "./Cover";

export default function ProjectCard({ project }) {
  const { slug, title, context, image, summary, metric, tags, github } = project;
  return (
    <motion.article
      className="pcard"
      style={{ transformPerspective: 1000 }}
      whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <Cover slug={slug} title={title} image={image} />
      <div className="pcard__body">
        {metric && <p className="pcard__metric">{metric}</p>}
        <h3 className="pcard__title">{title}</h3>
        {context && <p className="pcard__context">{context}</p>}
        <p className="pcard__summary">{summary}</p>
        <ul className="chips">{tags.map((t) => <li key={t}>{t}</li>)}</ul>
        <a className="pcard__link" href={github} target="_blank" rel="noopener noreferrer" aria-label={`${title} on GitHub`}>
          View on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </motion.article>
  );
}
