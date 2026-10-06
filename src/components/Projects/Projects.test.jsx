import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Projects from "./Projects";
import Cover from "./Cover";
import { projects } from "../../data/projects";

beforeEach(() => { Element.prototype.scrollBy = vi.fn(); });

describe("Projects", () => {
  it("shows every project with a GitHub link", () => {
    render(<Projects />);
    projects.forEach((p) => {
      const link = screen.getByRole("link", { name: `${p.title} on GitHub` });
      expect(link).toHaveAttribute("href", p.github);
      expect(link).toHaveAttribute("target", "_blank");
    });
  });
  it("scrolls the track from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    screen.getByRole("region", { name: /projects/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeGreaterThan(0);
    await user.keyboard("{ArrowLeft}");
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeLessThan(0);
  });
  it("has no arrow buttons and nudges the track every 10s", () => {
    vi.useFakeTimers();
    window.matchMedia = window.matchMedia || (() => ({ matches: false }));
    render(<Projects />);
    expect(screen.queryByRole("button", { name: /project/i })).toBeNull();
    Element.prototype.scrollBy.mockClear();
    vi.advanceTimersByTime(10000);
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeGreaterThan(0);
    vi.advanceTimersByTime(900);
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeLessThan(0);
    vi.useRealTimers();
  });
});

describe("Cover", () => {
  it("is deterministic per slug", () => {
    const a = render(<Cover slug="x" title="Alpha Beta" />).container.innerHTML;
    const b = render(<Cover slug="x" title="Alpha Beta" />).container.innerHTML;
    expect(a).toBe(b);
  });
});
