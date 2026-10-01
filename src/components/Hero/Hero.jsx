import { lazy, Suspense } from "react";
import { useReducedMotion } from "motion/react";
import { profile } from "../../data/profile";
import { asset } from "../../lib/asset";
import { useWebGL } from "../../hooks/useWebGL";
import Reveal from "../ui/Reveal";
import HeadshotCard from "./HeadshotCard";
import RoleTicker from "./RoleTicker";
import ContactDock from "../ContactDock/ContactDock";
import "./Hero.css";

const Backdrop3D = lazy(() => import("./Backdrop3D"));

export default function Hero() {
  const webgl = useWebGL();
  const reduced = useReducedMotion();
  const wide = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
  const show3D = webgl && !reduced && wide;

  return (
    <section id="top" className="hero">
      {show3D && (
        <Suspense fallback={null}>
          <Backdrop3D />
        </Suspense>
      )}
      <div className="hero__grid">
        <Reveal className="hero__copy">
          <p className="eyebrow">Hello, I’m</p>
          <h1 className="hero__name">{profile.name}</h1>
          <RoleTicker roles={profile.roles} />
          <p className="hero__lede">{profile.lede}</p>
          <ContactDock />
        </Reveal>
        <HeadshotCard src={asset(profile.headshot)} alt={`Portrait of ${profile.name}`} />
      </div>
    </section>
  );
}
