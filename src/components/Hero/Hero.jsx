import { profile } from "../../data/profile";
import { asset } from "../../lib/asset";
import Reveal from "../ui/Reveal";
import HeadshotCard from "./HeadshotCard";
import RoleTicker from "./RoleTicker";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__grid">
        <Reveal className="hero__copy">
          <p className="eyebrow">Hello, I’m</p>
          <h1 className="hero__name">{profile.name}</h1>
          <RoleTicker roles={profile.roles} />
          <p className="hero__lede">{profile.lede}</p>
        </Reveal>
        <HeadshotCard src={asset(profile.headshot)} alt={`Portrait of ${profile.name}`} />
      </div>
    </section>
  );
}
