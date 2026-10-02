import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useTheme } from "../../theme/ThemeContext";
import Logo from "../ui/Logo";
import { asset } from "../../lib/asset";
import { focusAngles, projectPin, labelSide, GLOBE_RADIUS_RATIO } from "./globeMath";

export default function Globe({ schools, selectedId, focusKey = 0, onSelect, onUnavailable }) {
  const canvasRef = useRef(null);
  const pinRefs = useRef({});
  const sizeRef = useRef(560);
  const current = useRef({ phi: 0, theta: 0.3 });
  const target = useRef({ phi: 0, theta: 0.3 });
  const drag = useRef(null);
  const [failed, setFailed] = useState(false);
  const { theme } = useTheme();

  // Re-centre whenever a school is chosen, even if it is already the selected one.
  useEffect(() => {
    const s = schools.find((x) => x.id === selectedId);
    if (s) target.current = focusAngles(s.location.lat, s.location.lng, current.current.phi);
  }, [selectedId, focusKey, schools]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const dark = theme === "dark";
    const measure = () => {
      sizeRef.current = canvas.offsetWidth || 560;
      return sizeRef.current;
    };
    const size = measure();

    let globe;
    const fail = () => {
      setFailed(true);
      onUnavailable?.();
    };
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
        markers: [],
        arcs: [],
      });
      // cobe 2.x does not throw without WebGL; it hands back no-op stubs. Verify the context ourselves.
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl || gl.isContextLost?.()) throw new Error("WebGL context unavailable");
    } catch {
      globe?.destroy?.();
      fail();
      return undefined;
    }

    canvas.addEventListener("webglcontextlost", fail);
    const ro = new ResizeObserver(() => {
      const s = measure();
      globe.update({ width: s * dpr, height: s * dpr });
    });
    ro.observe(canvas);

    let raf;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
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
      const half = sizeRef.current / 2;
      const R = sizeRef.current * GLOBE_RADIUS_RATIO;
      schools.forEach((s) => {
        const el = pinRefs.current[s.id];
        if (!el) return;
        const p = projectPin(s.location.lat, s.location.lng, phi, theta);
        el.style.transform = `translate(${half + p.x * R}px, ${half - p.y * R}px) translate(-50%, -50%)`;
        el.dataset.side = labelSide(p.x);
        el.style.opacity = p.visible ? 1 : 0;
        el.style.pointerEvents = p.visible ? "auto" : "none";
      });
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", fail);
      ro.disconnect();
      io.disconnect();
      globe.destroy();
    };
  }, [schools, theme]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <span className="globe__pin-logo">
              <Logo src={asset(s.logo)} name={s.shortName} size={36} />
            </span>
            <span className="globe__pin-label">{s.shortName}</span>
          </button>
        ))}
    </div>
  );
}
