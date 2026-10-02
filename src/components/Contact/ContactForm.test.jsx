import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@emailjs/browser", () => ({ default: { send: vi.fn() } }));

import emailjs from "@emailjs/browser";
import ContactForm from "./ContactForm";
import { profile } from "../../data/profile";

async function fill(user, { name = "Ada Lovelace", email = "ada@example.com", message = "Hello there, let us collaborate." } = {}) {
  if (name) await user.type(screen.getByLabelText(/name/i), name);
  if (email) await user.type(screen.getByLabelText(/email/i), email);
  if (message) await user.type(screen.getByLabelText(/message/i), message);
}

beforeEach(() => {
  emailjs.send.mockReset();
  vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "svc_1");
  vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "tpl_1");
  vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "pub_1");
});
afterEach(() => vi.unstubAllEnvs());

describe("ContactForm", () => {
  it("has labelled name, email and message fields and a send button", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/message/i).tagName).toBe("TEXTAREA");
    expect(screen.getByRole("button", { name: /send/i })).toBeEnabled();
  });

  it("shows an error for each empty field and sends nothing", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/message/i)).toHaveAttribute("aria-invalid", "true");
    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it("rejects a malformed email address", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user, { email: "not-an-email" });
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it("sends name, email and message through EmailJS, then confirms and clears the form", async () => {
    emailjs.send.mockResolvedValue({ status: 200 });
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(emailjs.send).toHaveBeenCalledWith(
      "svc_1",
      "tpl_1",
      { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there, let us collaborate." },
      { publicKey: "pub_1" }
    );
    expect(await screen.findByRole("status")).toHaveTextContent(/thanks/i);
    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    expect(screen.getByLabelText(/message/i)).toHaveValue("");
  });

  it("disables the button while sending so it cannot be double-submitted", async () => {
    let resolve;
    emailjs.send.mockReturnValue(new Promise((r) => { resolve = r; }));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /sending/i }));
    expect(emailjs.send).toHaveBeenCalledTimes(1);
    resolve({ status: 200 });
    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("keeps what was typed and points to the direct email when sending fails", async () => {
    emailjs.send.mockRejectedValue(new Error("network"));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(profile.email);
    expect(screen.getByLabelText(/message/i)).toHaveValue("Hello there, let us collaborate.");
    expect(screen.getByRole("button", { name: /send/i })).toBeEnabled();
  });

  it("silently ignores submissions that fill the hidden spam-trap field", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContactForm />);
    await fill(user);
    await user.type(container.querySelector('input[name="website"]'), "http://spam.example");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(emailjs.send).not.toHaveBeenCalled();
  });

  it("explains itself instead of failing silently when the EmailJS keys are missing", async () => {
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(profile.email);
    expect(emailjs.send).not.toHaveBeenCalled();
  });
});
