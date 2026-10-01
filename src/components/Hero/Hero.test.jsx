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
    expect(img.getAttribute("src")).toBe(`${import.meta.env.BASE_URL}image.png`);
  });
  it("does not mount the 3D backdrop when WebGL is unavailable", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector(".backdrop3d")).toBeNull();
  });
});
