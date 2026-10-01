import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Nav from "./Nav";

describe("Nav", () => {
  it("links to every section", () => {
    render(<Nav />);
    ["Education", "Experience", "Projects", "Contact"].forEach((label) => {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", `#${label.toLowerCase()}`);
    });
  });
  it("toggles the mobile menu and closes it after choosing a link", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /close/i })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("link", { name: "Projects" }));
    expect(screen.getByRole("button", { name: /menu/i })).toHaveAttribute("aria-expanded", "false");
  });
});
