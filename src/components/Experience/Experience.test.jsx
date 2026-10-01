import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Experience from "./Experience";
import { experience } from "../../data/experience";

describe("Experience", () => {
  it("renders every role", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { level: 2, name: "Experience" })).toBeInTheDocument();
    experience.forEach((e) => expect(screen.getAllByText(e.company, { exact: false }).length).toBeGreaterThan(0));
    expect(screen.getAllByRole("article")).toHaveLength(experience.length);
  });
  it("expands and collapses extra details", async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const swe = experience.find((e) => e.details.length);
    expect(screen.queryByText(swe.details[0])).toBeNull();
    const btn = screen.getByRole("button", { name: /show more/i });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(swe.details[0])).toBeInTheDocument();
    await user.click(btn);
    expect(screen.queryByText(swe.details[0])).toBeNull();
  });
  it("marks placeholder entries so they can be styled as pending", () => {
    const { container } = render(<Experience />);
    expect(container.querySelectorAll("[data-placeholder='true']")).toHaveLength(experience.filter((e) => e.placeholder).length);
  });
});
