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
  it("scrolls the track from the arrow buttons and keyboard", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    await user.click(screen.getByRole("button", { name: /next project/i }));
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: /previous project/i }));
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeLessThan(0);
    screen.getByRole("region", { name: /projects/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(Element.prototype.scrollBy.mock.calls.at(-1)[0].left).toBeGreaterThan(0);
  });
});

describe("Cover", () => {
  it("is deterministic per slug", () => {
    const a = render(<Cover slug="x" title="Alpha Beta" />).container.innerHTML;
    const b = render(<Cover slug="x" title="Alpha Beta" />).container.innerHTML;
    expect(a).toBe(b);
  });
});
