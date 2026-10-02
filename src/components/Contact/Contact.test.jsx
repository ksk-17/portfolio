import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Contact from "./Contact";
import { profile } from "../../data/profile";

describe("Contact", () => {
  it("includes the message form", () => {
    render(<Contact />);
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });
  it("is the #contact section with a heading, the email and the three contact links", () => {
    const { container } = render(<Contact />);
    const section = container.querySelector("section#contact");
    expect(section).not.toBeNull();
    expect(within(section).getByRole("heading", { level: 2, name: "Contact" })).toBeInTheDocument();
    expect(within(section).getByText(profile.email)).toBeInTheDocument();
    expect(within(section).getAllByRole("link")).toHaveLength(3);
  });
  it("puts the contact links in the left column and the form in the right column", () => {
    const { container } = render(<Contact />);
    const grid = container.querySelector(".contact__grid");
    expect(grid.children).toHaveLength(2);
    const [left, right] = grid.children;
    expect(within(left).getAllByRole("link")).toHaveLength(3);
    expect(within(left).getByText(profile.email)).toBeInTheDocument();
    expect(within(left).getByRole("heading", { level: 2, name: "Contact" })).toBeInTheDocument();
    expect(left.querySelector("form")).toBeNull();
    expect(right.tagName).toBe("FORM");
    expect(within(right).queryByRole("heading")).toBeNull();
  });
});
