import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { education } from "../../data/education";

vi.mock("cobe", () => ({ default: vi.fn(() => ({ update: vi.fn(), destroy: vi.fn() })) }));

import createGlobe from "cobe";
import { ThemeContext } from "../../theme/ThemeContext";
import Education from "./Education";
import Globe from "./Globe";

let rafCbs;
function runFrames(n) {
  for (let i = 0; i < n; i++) {
    const cbs = rafCbs;
    rafCbs = [];
    cbs.forEach((cb) => cb(0));
  }
}
function pinXY(label) {
  const el = screen.getByRole("button", { name: new RegExp(label) });
  const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(el.style.transform);
  return { x: Number(m[1]), y: Number(m[2]) };
}

beforeEach(() => {
  rafCbs = [];
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    rafCbs.push(cb);
    return rafCbs.length;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({ isContextLost: () => false }));
  globalThis.__w = 400;
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, get: () => globalThis.__w });
  createGlobe.mockClear();
});

describe("Education without WebGL", () => {
  it("still lets visitors switch schools via tabs", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
    const user = userEvent.setup();
    render(<Education />);
    expect(screen.getByRole("heading", { level: 2, name: "Education" })).toBeInTheDocument();
    expect(screen.getByText(education[0].degree)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: new RegExp(education[1].shortName) }));
    expect(await screen.findByText(education[1].degree)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: new RegExp(education[1].shortName) })).toHaveAttribute("aria-selected", "true");
  });
  it("drops the globe column when the WebGL context turns out to be unusable", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({ isContextLost: () => true }));
    const { container } = render(<Education />);
    await waitFor(() => expect(container.querySelector(".edu__globe")).toBeNull());
    expect(screen.getByRole("tab", { name: new RegExp(education[0].shortName) })).toBeInTheDocument();
  });
});

describe("Globe", () => {
  it("renders one pin button per school and reports selection", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Globe schools={education} selectedId={education[0].id} onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: new RegExp(education[1].location.label) }));
    expect(onSelect).toHaveBeenCalledWith(education[1].id);
  });
  it("keeps the globe when the canvas holds a webgl2 context (a webgl request returns null)", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn((type) => (type === "webgl2" ? { isContextLost: () => false } : null));
    const onUnavailable = vi.fn();
    const { container } = render(<Globe schools={education} selectedId="sjsu" onSelect={() => {}} onUnavailable={onUnavailable} />);
    expect(onUnavailable).not.toHaveBeenCalled();
    expect(container.querySelector("canvas")).not.toBeNull();
  });
  it("draws the dark globe when the theme is dark", () => {
    render(
      <ThemeContext.Provider value={{ theme: "dark", toggle() {} }}>
        <Globe schools={education} selectedId="sjsu" onSelect={() => {}} />
      </ThemeContext.Provider>
    );
    expect(createGlobe.mock.calls.at(-1)[1].dark).toBe(1);
  });
  it("reports unavailable when cobe throws", async () => {
    createGlobe.mockImplementationOnce(() => { throw new Error("no webgl"); });
    const onUnavailable = vi.fn();
    render(<Globe schools={education} selectedId="sjsu" onSelect={() => {}} onUnavailable={onUnavailable} />);
    expect(onUnavailable).toHaveBeenCalled();
  });
  it("reports unavailable when cobe returns stubs because the context is lost", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({ isContextLost: () => true }));
    const onUnavailable = vi.fn();
    const { container } = render(<Globe schools={education} selectedId="sjsu" onSelect={() => {}} onUnavailable={onUnavailable} />);
    expect(onUnavailable).toHaveBeenCalled();
    expect(container.querySelector("canvas")).toBeNull();
  });
  it("re-measures the canvas on resize so pins follow the globe", () => {
    let resize;
    globalThis.ResizeObserver = class { constructor(cb) { resize = cb; } observe() {} disconnect() {} };
    render(<Globe schools={education} selectedId="sjsu" onSelect={() => {}} />);
    runFrames(300);
    expect(pinXY("SJSU").x).toBeCloseTo(200, 0);
    globalThis.__w = 800;
    resize();
    runFrames(1);
    expect(pinXY("SJSU").x).toBeCloseTo(400, 0);
    const globe = createGlobe.mock.results[0].value;
    expect(globe.update).toHaveBeenCalledWith(expect.objectContaining({ width: expect.any(Number) }));
  });
  it("brings the selected school back to centre when it is selected again after dragging", () => {
    const { rerender, container } = render(<Globe schools={education} selectedId="sjsu" focusKey={0} onSelect={() => {}} />);
    runFrames(300);
    expect(pinXY("SJSU").x).toBeCloseTo(200, 0);
    const globeEl = container.querySelector(".globe");
    fireEvent.pointerDown(globeEl, { clientX: 0 });
    fireEvent.pointerMove(globeEl, { clientX: 300 });
    fireEvent.pointerUp(globeEl);
    runFrames(2);
    expect(Math.abs(pinXY("SJSU").x - 200)).toBeGreaterThan(20);
    rerender(<Globe schools={education} selectedId="sjsu" focusKey={1} onSelect={() => {}} />);
    runFrames(300);
    expect(pinXY("SJSU").x).toBeCloseTo(200, 0);
  });
});
