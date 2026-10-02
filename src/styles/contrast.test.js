import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const css = readFileSync(resolve("src/styles/tokens.css"), "utf8");
const [lightPart, darkPart] = css.split("@media");
const vars = (block) => Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
const light = vars(lightPart);
const dark = { ...light, ...vars(darkPart) };

function lum(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const pairs = [
  ["text", "bg"], ["text", "surface"], ["muted", "bg"], ["muted", "surface"], ["muted", "surface-2"],
  ["accent", "bg"], ["accent", "surface"], ["grad-a", "bg"], ["grad-b", "bg"],
];

describe.each([["light", light], ["dark", dark]])("%s theme contrast (WCAG AA 4.5:1)", (_name, t) => {
  it.each(pairs)("%s on %s", (fg, bg) => {
    expect(t[fg], `--${fg} missing`).toBeDefined();
    expect(ratio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });
});

it("skip link text (white) is readable on its background", () => {
  expect(light["skip-bg"]).toBeDefined();
  expect(ratio("#ffffff", light["skip-bg"])).toBeGreaterThanOrEqual(4.5);
});
