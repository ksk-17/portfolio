import { useState } from "react";

function monogram(name) {
  const words = name.split(/\s+/).filter(Boolean);
  return words.length === 1 ? name.slice(0, 4).toUpperCase() : words.map((w) => w[0]).join("").slice(0, 3).toUpperCase();
}

export default function Logo({ src, name, size = 48 }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <span className="logo logo--mono" style={{ width: size, height: size }} aria-hidden="true">
        {monogram(name)}
      </span>
    );
  }
  return (
    <img className="logo" src={src} alt={`${name} logo`} width={size} height={size} onError={() => setFailed(true)} />
  );
}
