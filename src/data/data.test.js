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
    expect(profile.links.kaggle).toBeUndefined();
  });
  it("education entries have unique ids and valid coordinates", () => {
    expect(new Set(education.map((e) => e.id)).size).toBe(education.length);
    education.forEach((e) => {
      expect(Math.abs(e.location.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(e.location.lng)).toBeLessThanOrEqual(180);
      expect(e.coursework.length).toBeGreaterThan(0);
    });
  });
  it("experience covers the research role, SAP Labs and a single JPMorgan Chase role", () => {
    expect(new Set(experience.map((e) => e.id)).size).toBe(experience.length);
    expect(experience.map((e) => e.company)).toEqual([
      expect.stringMatching(/San José State University/),
      "SAP Labs",
      "JPMorgan Chase",
    ]);
    const sap = experience.find((e) => e.id === "sap");
    expect(sap.role).toBe("AI Software Developer Intern / Performance Engineer");
    expect(sap.dates).toBe("Jul 2026 – Sep 2026");
    expect(sap.placeholder).toBeUndefined();
    const jpmc = experience.find((e) => e.company === "JPMorgan Chase");
    expect(jpmc.role).toBe("Software Developer");
    expect(jpmc.dates).toBe("Feb 2023 – Dec 2024");
    expect(jpmc.location).toBe("Hyderabad, India");
    const ra = experience.find((e) => e.id === "research-assistant");
    expect(ra.dates).toBe("Jun 2025 – Present");
    experience.forEach((e) => expect(e.summary.length + e.details.length).toBeGreaterThanOrEqual(3));
  });
  it("SJSU education has the updated GPA, Deep Learning and the neuro-symbolic vision reasoning thesis", () => {
    const sjsu = education.find((e) => e.id === "sjsu");
    expect(sjsu.gpa).toBe("3.77");
    expect(sjsu.dates).toBe("Jan 2025 – Present");
    expect(sjsu.coursework).toContain("Deep Learning");
    const thesis = sjsu.highlights.find((h) => /thesis/i.test(h.title));
    expect(thesis.title).toMatch(/vision reasoning/i);
    expect(thesis.title).toMatch(/neuro-symbolic/i);
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
  it("uses the avatar cutout, and the file exists", () => {
    expect(profile.headshot).toBe("avatar.webp");
    expect(existsSync(resolve("public", profile.headshot))).toBe(true);
  });
  it("has a real logo for every school and every role", () => {
    [...education, ...experience].forEach((e) => expect(e.logo, e.id).toBeTruthy());
  });
});
