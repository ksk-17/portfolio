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
          <div className="likes">
            <span className="likes__label">I like</span>
            <ul className="likes__list">
              {profile.interests.map(({ id, emoji, label }) => (
                <li key={id} className="like">
                  <span className="like__emoji" aria-hidden="true">{emoji}</span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <HeadshotCard src={asset(profile.headshot)} alt={`Portrait of ${profile.name}`} />
      </div>
    </section>
  );
}
