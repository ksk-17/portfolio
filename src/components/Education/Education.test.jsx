import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import { education } from "../../data/education";

vi.mock("cobe", () => ({ default: vi.fn(() => ({ destroy: vi.fn() })) }));

import Education from "./Education";
import Globe from "./Globe";

describe("Education without WebGL", () => {
  it("still lets visitors switch schools via tabs", async () => {
    const user = userEvent.setup();
    render(<Education />);
    expect(screen.getByRole("heading", { level: 2, name: "Education" })).toBeInTheDocument();
    expect(screen.getByText(education[0].degree)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: new RegExp(education[1].shortName) }));
    expect(await screen.findByText(education[1].degree)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: new RegExp(education[1].shortName) })).toHaveAttribute("aria-selected", "true");
  });
});

describe("Globe", () => {
  it("renders one pin button per school and reports selection", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Globe schools={education} selectedId={education[0].id} onSelect={onSelect} />);
    const pin = screen.getByRole("button", { name: new RegExp(education[1].location.label) });
    await user.click(pin);
    expect(onSelect).toHaveBeenCalledWith(education[1].id);
  });
  it("does not crash when cobe throws", async () => {
    const { default: createGlobe } = await import("cobe");
    createGlobe.mockImplementationOnce(() => { throw new Error("no webgl"); });
    expect(() => render(<Globe schools={education} selectedId="sjsu" onSelect={() => {}} />)).not.toThrow();
  });
});
