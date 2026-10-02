import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

const realMatchMedia = window.matchMedia;
function systemPrefers(dark) {
  window.matchMedia = vi.fn((q) => ({
    matches: dark && q.includes("dark"), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
  }));
}
function Probe() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>{theme}</button>;
}

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});
afterEach(() => {
  window.matchMedia = realMatchMedia;
});

describe("ThemeProvider", () => {
  it("follows the system preference when nothing is stored", () => {
    systemPrefers(true);
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole("button")).toHaveTextContent("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
  it("prefers a stored choice over the system preference", () => {
    systemPrefers(true);
    localStorage.setItem("theme", "light");
    render(<ThemeProvider><Probe /></ThemeProvider>);
    expect(screen.getByRole("button")).toHaveTextContent("light");
  });
  it("toggles, updates the document and remembers the choice", async () => {
    systemPrefers(false);
    const user = userEvent.setup();
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });
  it("still toggles when storage is blocked", async () => {
    systemPrefers(false);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const user = userEvent.setup();
    render(<ThemeProvider><Probe /></ThemeProvider>);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("dark");
    vi.restoreAllMocks();
  });
});
