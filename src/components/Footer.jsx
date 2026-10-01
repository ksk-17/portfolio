import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer style={{ textAlign: "center", color: "var(--muted)", padding: "96px 24px 48px", fontSize: "0.9rem" }}>
      © {new Date().getFullYear()} {profile.name}
    </footer>
  );
}
