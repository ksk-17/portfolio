import { useState } from "react";
import Logo from "../ui/Logo";
import { asset } from "../../lib/asset";

export default function StackCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const hasMore = item.details.length > 0;
  return (
    <article className="stack__card" style={{ "--i": index }} data-placeholder={item.placeholder ? "true" : undefined}>
      <header className="stack__head">
        <Logo src={asset(item.logo)} name={item.short ?? item.company} size={52} />
        <div>
          <h3 className="stack__role">{item.role}</h3>
          <p className="stack__meta">{[item.company, item.location, item.dates].filter(Boolean).join(" · ")}</p>
        </div>
      </header>
      <ul className="stack__list">
        {item.summary.map((s) => <li key={s}>{s}</li>)}
        {open && item.details.map((d) => <li key={d}>{d}</li>)}
      </ul>
      {hasMore && (
        <button className="stack__more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </article>
  );
}
