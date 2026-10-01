import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "./Logo";
import Toast from "./Toast";
import Reveal from "./Reveal";

describe("Logo", () => {
  it("shows a monogram when there is no src", () => {
    render(<Logo name="SAP" />);
    expect(screen.getByText("SAP")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });
  it("falls back to the monogram when the image fails to load", () => {
    render(<Logo name="San Jose State University" src="/missing.png" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("SJS")).toBeInTheDocument();
  });
});

describe("Toast", () => {
  it("is announced politely and reflects visibility", () => {
    const { rerender } = render(<Toast message="" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-show", "false");
    rerender(<Toast message="Copied" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-show", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
  });
});

describe("Reveal", () => {
  it("renders its children", () => {
    render(<Reveal><p>hello</p></Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
