import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export default function RoleTicker({ roles, interval = 2400 }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % roles.length), interval);
    return () => clearInterval(t);
  }, [reduced, roles.length, interval]);

  if (reduced) return <p className="ticker">{roles.join(" · ")}</p>;
  return (
    <p className="ticker">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
