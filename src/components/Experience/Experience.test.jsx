import { render, screen, within } from "@testing-library/react";
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
  it("expands and collapses extra details per card", async () => {
    const user = userEvent.setup();
    render(<Experience />);
    const jpmc = experience.find((e) => e.id === "jpmc");
    const card = screen.getByRole("heading", { name: jpmc.role }).closest("article");
    expect(within(card).queryByText(jpmc.details[0])).toBeNull();
    const btn = within(card).getByRole("button", { name: /show more/i });
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(within(card).getByText(jpmc.details[0])).toBeInTheDocument();
    await user.click(btn);
    expect(within(card).queryByText(jpmc.details[0])).toBeNull();
  });
  it("shows the location next to the company when there is one", () => {
    render(<Experience />);
    expect(screen.getByText(/JPMorgan Chase · Hyderabad, India · Feb 2023 – Dec 2024/)).toBeInTheDocument();
  });
  it("uses a short monogram for long organisation names", () => {
    render(<Experience />);
    const card = screen.getByRole("heading", { name: "Research Assistant" }).closest("article");
    expect(within(card).getByText("SJSU")).toBeInTheDocument();
  });
  it("marks placeholder entries so they can be styled as pending", () => {
    const { container } = render(<Experience />);
    expect(container.querySelectorAll("[data-placeholder='true']")).toHaveLength(experience.filter((e) => e.placeholder).length);
  });
});
