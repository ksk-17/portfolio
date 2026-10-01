import { render, screen, act, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWebGL } from "./useWebGL";
import { useActiveSection } from "./useActiveSection";

describe("useWebGL", () => {
  it("is false when no WebGL context can be created", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
    expect(renderHook(() => useWebGL()).result.current).toBe(false);
  });
  it("is false when getContext throws", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => { throw new Error("boom"); });
    expect(renderHook(() => useWebGL()).result.current).toBe(false);
  });
  it("is true when a context exists", () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({}));
    expect(renderHook(() => useWebGL()).result.current).toBe(true);
  });
});

describe("useActiveSection", () => {
  let callback;
  beforeEach(() => {
    globalThis.IntersectionObserver = class {
      constructor(cb) { callback = cb; }
      observe() {} unobserve() {} disconnect() {}
    };
  });
  function Probe() {
    const active = useActiveSection(["a", "b"]);
    return (
      <div>
        <div id="a" /><div id="b" />
        <span data-testid="out">{active ?? "none"}</span>
      </div>
    );
  }
  it("reports the section that intersects", () => {
    render(<Probe />);
    expect(screen.getByTestId("out")).toHaveTextContent("none");
    act(() => callback([{ isIntersecting: true, target: { id: "b" } }]));
    expect(screen.getByTestId("out")).toHaveTextContent("b");
  });
});
