import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function HeadshotCard({ src, alt }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const imgX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const imgY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() { px.set(0); py.set(0); }

  return (
    <div className="headshot" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div className="headshot__card" style={{ rotateX, rotateY, transformPerspective: 900 }}>
        <div className="headshot__glow" aria-hidden="true" />
        <motion.img className="headshot__img" src={src} alt={alt} style={{ x: imgX, y: imgY }} width="900" height="1083" fetchPriority="high" />
      </motion.div>
    </div>
  );
}
