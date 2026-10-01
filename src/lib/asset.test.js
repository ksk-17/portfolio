import { describe, it, expect } from "vitest";
import { asset } from "./asset";

describe("asset", () => {
  it("prefixes the Vite base URL", () => {
    expect(asset("image.png")).toBe(`${import.meta.env.BASE_URL}image.png`);
  });
  it("strips a leading slash so GitHub Pages subpath works", () => {
    expect(asset("/logos/sap.svg")).toBe(`${import.meta.env.BASE_URL}logos/sap.svg`);
    expect(asset("/logos/sap.svg").startsWith("//")).toBe(false);
  });
});
