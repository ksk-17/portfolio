import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContactDock from "./ContactDock";
import { profile } from "../../data/profile";

beforeEach(() => {
  // mailto navigation is not implemented in jsdom; keep the click inert
  document.addEventListener("click", (e) => e.target.closest?.("a")?.href?.startsWith("mailto:") && e.preventDefault(), { capture: true });
});

describe("ContactDock", () => {
  it("renders three labelled links with safe external targets and no Kaggle", () => {
    render(<ContactDock />);
    const gh = screen.getByRole("link", { name: /github/i });
    expect(gh).toHaveAttribute("href", profile.links.github);
    expect(gh).toHaveAttribute("target", "_blank");
    expect(gh.getAttribute("rel")).toMatch(/noopener/);
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute("href", profile.links.linkedin);
    expect(screen.queryByRole("link", { name: /kaggle/i })).toBeNull();
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  it("copies the email and confirms with a toast", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<ContactDock />);
    await user.click(screen.getByRole("link", { name: /email/i }));
    expect(writeText).toHaveBeenCalledWith(profile.email);
    expect(await screen.findByRole("status")).toHaveTextContent(/copied/i);
  });

  it("shows the address when the clipboard is unavailable", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    render(<ContactDock />);
    await user.click(screen.getByRole("link", { name: /email/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(profile.email);
  });
});
