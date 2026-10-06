import { profile } from "../../data/profile";
import Reveal from "../ui/Reveal";
import ContactDock from "../ContactDock/ContactDock";
import ContactForm from "./ContactForm";
import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal className="contact__grid">
        <div className="contact__links">
          <h2 className="section__title">Contact</h2>
          <p className="section__sub">
            I’m looking for research roles and to connect with great minds.
          </p>
          <p className="contact__or">Reach out directly</p>
          <ContactDock />
          <p className="contact__email">{profile.email}</p>
        </div>
        <ContactForm />
      </Reveal>
    </section>
  );
}
