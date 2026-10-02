import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { profile } from "./profile";
import { education } from "./education";
import { experience } from "./experience";
import { projects } from "./projects";

const allText = JSON.stringify({ profile, education, experience, projects });

describe("content data", () => {
  it("has the exact contact links", () => {
    expect(profile.email).toBe("sumanthkumarkotagudem@gmail.com");
    expect(profile.links.linkedin).toBe("https://www.linkedin.com/in/ksk-17/");
    expect(profile.links.github).toBe("https://github.com/ksk-17");
    expect(profile.links.kaggle).toBe("https://www.kaggle.com/ksk872");
  });
  it("education entries have unique ids and valid coordinates", () => {
    expect(new Set(education.map((e) => e.id)).size).toBe(education.length);
    education.forEach((e) => {
      expect(Math.abs(e.location.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(e.location.lng)).toBeLessThanOrEqual(180);
      expect(e.coursework.length).toBeGreaterThan(0);
    });
  });
  it("experience covers JPMC, SAP and the research role with unique ids", () => {
    expect(new Set(experience.map((e) => e.id)).size).toBe(experience.length);
    const companies = experience.map((e) => e.company).join("|");
    expect(companies).toMatch(/JPMorgan/);
    expect(companies).toMatch(/SAP/);
    expect(companies).toMatch(/SKILL Lab/);
  });
  it("every project has a GitHub https link, tags and a summary", () => {
    expect(projects.length).toBe(5);
    projects.forEach((p) => {
      expect(p.github).toMatch(/^https:\/\/github\.com\/ksk-17\//);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.summary.length).toBeGreaterThan(40);
    });
  });
  it("has fixed the known typos", () => {
    expect(allText).not.toMatch(/INdia|Intellignece/);
  });
  it("only references logo files that exist (null means monogram fallback)", () => {
    [...education, ...experience].forEach((e) => {
      if (e.logo !== null) expect(existsSync(resolve("public", e.logo)), e.logo).toBe(true);
    });
  });
});
