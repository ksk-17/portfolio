import { describe, it, expect } from "vitest";
import { focusAngles, projectPin } from "./globeMath";

const places = [
  [37.3352, -121.8811],
  [17.54, 78.386],
  [0, 0],
  [-33.9, 151.2],
];

describe("globeMath", () => {
  it.each(places)("focusAngles brings (%f, %f) to the centre of the disc", (lat, lng) => {
    const { phi, theta } = focusAngles(lat, lng);
    const p = projectPin(lat, lng, phi, theta);
    expect(p.visible).toBe(true);
    expect(Math.abs(p.x)).toBeLessThan(1e-9);
    expect(Math.abs(p.y)).toBeLessThan(1e-9);
  });
  it("hides the antipode", () => {
    const { phi, theta } = focusAngles(37.3352, -121.8811);
    expect(projectPin(-37.3352, 58.1189, phi, theta).visible).toBe(false);
  });
  it("unwraps phi to the shortest rotation from the current angle", () => {
    const { phi } = focusAngles(17.54, 78.386, 20);
    expect(Math.abs(phi - 20)).toBeLessThanOrEqual(Math.PI + 1e-9);
  });
  it("keeps projected coordinates inside the unit disc", () => {
    const p = projectPin(10, 20, 1.1, 0.3);
    expect(Math.hypot(p.x, p.y)).toBeLessThanOrEqual(1 + 1e-9);
  });
});
