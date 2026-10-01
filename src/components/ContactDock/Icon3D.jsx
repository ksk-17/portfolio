import { motion, useAnimationControls } from "motion/react";

export default function Icon3D({ label, href, tone, external = true, onClick, children }) {
  const controls = useAnimationControls();
  function handleClick(e) {
    controls.start({ rotateY: [0, 360], transition: { duration: 0.7, ease: "easeInOut" } });
    onClick?.(e);
  }
  return (
    <motion.a
      className="icon3d"
      href={href}
      aria-label={label}
      onClick={handleClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ "--tone": tone, transformPerspective: 600 }}
      animate={controls}
      whileHover={{ rotateX: -14, rotateY: 14, y: -10 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
    >
      <span className="icon3d__side" aria-hidden="true" />
      <span className="icon3d__face" aria-hidden="true">{children}</span>
      <span className="icon3d__label" aria-hidden="true">{label}</span>
    </motion.a>
  );
}
