import { useId, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { profile } from "../../data/profile";
import "./ContactForm.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: "", email: "", message: "", website: "" };

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Please enter your name.";
  if (!email.trim()) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "Please enter a valid email address.";
  if (!message.trim()) errors.message = "Please write a message.";
  return errors;
}

export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const refs = useRef({});

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (status === "sent") setStatus("idle");
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);
    const firstInvalid = ["name", "email", "message"].find((k) => found[k]);
    if (firstInvalid) {
      refs.current[firstInvalid]?.focus();
      return;
    }

    // Hidden spam-trap field: real visitors never fill it. Pretend success, send nothing.
    if (values.website) {
      setValues(EMPTY);
      setStatus("sent");
      return;
    }

    const service = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const template = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!service || !template || !publicKey) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        service,
        template,
        { name: values.name.trim(), email: values.email.trim(), message: values.message.trim() },
        { publicKey }
      );
      setValues(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const field = (key, label, props) => {
    const id = `${uid}-${key}`;
    const err = errors[key];
    const Tag = props.as ?? "input";
    return (
      <div className="cf__field">
        <label htmlFor={id}>{label}</label>
        <Tag
          id={id}
          name={key}
          ref={(el) => { refs.current[key] = el; }}
          value={values[key]}
          onChange={set(key)}
          required
          aria-invalid={err ? "true" : "false"}
          aria-describedby={err ? `${id}-err` : undefined}
          {...props.attrs}
        />
        {err && <p id={`${id}-err`} className="cf__error">{err}</p>}
      </div>
    );
  };

  return (
    <form className="cf" onSubmit={onSubmit} noValidate>
      {field("name", "Name", { attrs: { type: "text", autoComplete: "name", maxLength: 100 } })}
      {field("email", "Email", { attrs: { type: "email", autoComplete: "email", maxLength: 200 } })}
      {field("message", "Message", { as: "textarea", attrs: { rows: 5, maxLength: 2000 } })}

      <div className="cf__trap" aria-hidden="true">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
        </label>
      </div>

      <button className="cf__send" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>

      {status === "sent" && (
        <p className="cf__note" role="status">Thanks! Your message is on its way. I’ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className="cf__note cf__note--error" role="alert">
          Couldn’t send your message. Please email me directly at {profile.email}.
        </p>
      )}
    </form>
  );
}
