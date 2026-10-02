import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";
import Toast from "../ui/Toast";
import Icon3D from "./Icon3D";
import { MailGlyph, GitHubGlyph, LinkedInGlyph } from "./glyphs";
import "./ContactDock.css";

export default function ContactDock() {
  const [toast, setToast] = useState("");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  function flash(message) {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2600);
  }

  async function onEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      flash("Email copied — opening your mail app");
    } catch {
      flash(`Copy it manually: ${profile.email}`);
    }
  }

  return (
    <div id="contact" className="dock" role="group" aria-label="Contact">
      <Icon3D label="Email" href={`mailto:${profile.email}`} tone="#ff5f57" external={false} onClick={onEmail}><MailGlyph /></Icon3D>
      <Icon3D label="LinkedIn" href={profile.links.linkedin} tone="#0a66c2"><LinkedInGlyph /></Icon3D>
      <Icon3D label="GitHub" href={profile.links.github} tone="#24292f"><GitHubGlyph /></Icon3D>
      <Toast message={toast} />
    </div>
  );
}
