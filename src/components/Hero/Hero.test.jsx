import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "./Hero";
import { profile } from "../../data/profile";

describe("Hero", () => {
  it("shows the name as the single h1 and the first role", () => {
    render(<Hero />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(profile.name);
    expect(screen.getByText(profile.roles[0])).toBeInTheDocument();
  });
  it("renders the headshot with alt text and a BASE_URL-aware src", () => {
    render(<Hero />);
    const img = screen.getByAltText(new RegExp(profile.name));
    expect(img.getAttribute("src")).toBe(`${import.meta.env.BASE_URL}avatar.webp`);
  });
  it("lists interests under the intro", () => {
    render(<Hero />);
    expect(screen.getByText("I like")).toBeInTheDocument();
    ["Running", "Treks", "Beaches", "Movies"].forEach((l) => expect(screen.getByText(l)).toBeInTheDocument());
  });
  it("has no decorative 3D layer", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("canvas, .backdrop3d")).toBeNull();
  });
  it("no longer holds the contact icons (they live in the final Contact section)", () => {
    render(<Hero />);
    expect(screen.queryByRole("link", { name: /github|linkedin|email/i })).toBeNull();
  });
});
