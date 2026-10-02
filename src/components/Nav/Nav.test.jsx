import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Nav from "./Nav";
import { ThemeProvider } from "../../theme/ThemeContext";
import { profile } from "../../data/profile";

describe("Nav", () => {
  it("links to every section", () => {
    render(<ThemeProvider><Nav /></ThemeProvider>);
    ["Education", "Experience", "Projects", "Contact"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", `#${label.toLowerCase()}`);
    });
  });
  it("toggles the mobile menu and closes it after choosing a link", async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><Nav /></ThemeProvider>);
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /close/i })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("link", { name: "Projects" }));
    expect(screen.getByRole("button", { name: /menu/i })).toHaveAttribute("aria-expanded", "false");
  });
  it("shows the full name as the brand link", () => {
    render(<ThemeProvider><Nav /></ThemeProvider>);
    expect(screen.getByRole("link", { name: profile.name })).toHaveAttribute("href", "#top");
  });
  it("has a theme toggle that switches the page theme and its own label", async () => {
    localStorage.clear();
    const user = userEvent.setup();
    render(<ThemeProvider><Nav /></ThemeProvider>);
    await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(screen.getByRole("button", { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
