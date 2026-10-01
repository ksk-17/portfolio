import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { focusAngles, projectPin, GLOBE_RADIUS_RATIO } from "./globeMath";

export default function Globe({ schools, selectedId, onSelect }) {
  const canvasRef = useRef(null);
  const pinRefs = useRef({});
  const current = useRef({ phi: 0, theta: 0.3 });
  const target = useRef({ phi: 0, theta: 0.3 });
  const drag = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const s = schools.find((x) => x.id === selectedId);
    if (s) target.current = focusAngles(s.location.lat, s.location.lng, current.current.phi);
  }, [selectedId, schools]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const size = canvas.offsetWidth || 560;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const locations = schools.map((s) => [s.location.lat, s.location.lng]);
    let globe;
    try {
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: current.current.phi,
        theta: current.current.theta,
        dark: dark ? 1 : 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: dark ? 6 : 5,
        baseColor: dark ? [0.25, 0.25, 0.3] : [1, 1, 1],
        markerColor: [0, 0.44, 0.89],
        glowColor: dark ? [0.1, 0.1, 0.2] : [0.92, 0.94, 1],
        markers: locations.map((location) => ({ location, size: 0.07 })),
        arcs: locations.length > 1 ? [{ from: locations[0], to: locations[1] }] : [],
        arcColor: [0, 0.44, 0.89],
        arcWidth: 0.5,
        arcHeight: 0.3,
      });
    } catch {
      setFailed(true);
      return undefined;
    }

    let raf;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const R = size * GLOBE_RADIUS_RATIO;
    const half = size / 2;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (!drag.current) {
        const c = current.current;
        const t = target.current;
        c.phi += (t.phi - c.phi) * 0.08;
        c.theta += (t.theta - c.theta) * 0.08;
      }
      const { phi, theta } = current.current;
      globe.update({ phi, theta });
      schools.forEach((s) => {
        const el = pinRefs.current[s.id];
        if (!el) return;
        const p = projectPin(s.location.lat, s.location.lng, phi, theta);
        el.style.transform = `translate(${half + p.x * R}px, ${half - p.y * R}px) translate(-50%, -50%)`;
        el.style.opacity = p.visible ? 1 : 0;
        el.style.pointerEvents = p.visible ? "auto" : "none";
      });
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      globe.destroy();
    };
  }, [schools]);

  function down(e) {
    drag.current = { x: e.clientX };
    target.current = { ...current.current };
  }
  function move(e) {
    if (!drag.current) return;
    current.current.phi += (e.clientX - drag.current.x) / 200;
    drag.current.x = e.clientX;
    target.current = { ...current.current };
  }
  function up() {
    drag.current = null;
  }

  return (
    <div className="globe" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}>
      {!failed && <canvas ref={canvasRef} className="globe__canvas" aria-hidden="true" />}
      {!failed &&
        schools.map((s) => (
          <button
            key={s.id}
            ref={(el) => {
              pinRefs.current[s.id] = el;
            }}
            className="globe__pin"
            data-active={s.id === selectedId}
            aria-label={`${s.shortName} — ${s.location.label}`}
            onClick={() => onSelect(s.id)}
            style={{ opacity: 0 }}
          >
            <span className="globe__pin-dot" />
            <span className="globe__pin-label">{s.shortName}</span>
          </button>
        ))}
    </div>
  );
}
