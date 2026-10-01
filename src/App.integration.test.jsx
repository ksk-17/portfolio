import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders all sections and nothing for removed ones", () => {
    const { container } = render(<App />);
    ["Education", "Experience", "Projects"].forEach((name) =>
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument()
    );
    expect(screen.queryByRole("heading", { name: /skills|certifications/i })).toBeNull();
    expect(container.querySelector("form")).toBeNull();
    ["top", "education", "experience", "projects", "contact"].forEach((id) =>
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    );
  });
  it("has exactly one h1 and a skip link", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
  });
});
