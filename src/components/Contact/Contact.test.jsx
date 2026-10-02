import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Contact from "./Contact";
import { profile } from "../../data/profile";

describe("Contact", () => {
  it("is the #contact section with a heading, the email and the three contact links", () => {
    const { container } = render(<Contact />);
    const section = container.querySelector("section#contact");
    expect(section).not.toBeNull();
    expect(within(section).getByRole("heading", { level: 2, name: "Contact" })).toBeInTheDocument();
    expect(within(section).getByText(profile.email)).toBeInTheDocument();
    expect(within(section).getAllByRole("link")).toHaveLength(3);
  });
});
