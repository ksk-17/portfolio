import { asset } from "../../lib/asset";

function hash(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export default function Cover({ slug, title, image }) {
  if (image) {
    return (
      <div className="cover cover--image" aria-hidden="true">
        <img src={asset(image)} alt="" loading="lazy" />
      </div>
    );
  }
  const h = hash(slug);
  const a = h % 360;
  const b = (a + 60 + ((h >> 8) % 80)) % 360;
  const mark = title
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <div className="cover" style={{ background: `linear-gradient(135deg, hsl(${a} 80% 62%), hsl(${b} 85% 52%))` }} aria-hidden="true">
      <span className="cover__orb" />
      <span className="cover__mark">{mark}</span>
    </div>
  );
}
