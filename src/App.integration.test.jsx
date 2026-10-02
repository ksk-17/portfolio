import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders all sections and nothing for removed ones", () => {
    const { container } = render(<App />);
    ["Education", "Experience", "Projects", "Contact"].forEach((name) =>
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument()
    );
    expect(screen.queryByRole("heading", { name: /skills|certifications/i })).toBeNull();
    expect(container.querySelector("form")).toBeNull();
    ["top", "education", "experience", "projects", "contact"].forEach((id) =>
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    );
  });
  it("keeps Contact as the last section, with a single #contact target", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll("#contact")).toHaveLength(1);
    expect(container.querySelector("main").lastElementChild.id).toBe("contact");
    const order = [...container.querySelectorAll("main h2")].map((h) => h.textContent);
    expect(order).toEqual(["Education", "Experience", "Projects", "Contact"]);
  });
  it("has exactly one h1 and a skip link", () => {
    render(<App />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /skip to content/i })).toBeInTheDocument();
  });
});
