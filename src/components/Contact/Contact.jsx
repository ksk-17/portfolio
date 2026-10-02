import { profile } from "../../data/profile";
import Reveal from "../ui/Reveal";
import ContactDock from "../ContactDock/ContactDock";
import ContactForm from "./ContactForm";
import "./Contact.css";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal>
        <h2 className="section__title">Contact</h2>
        <p className="section__sub">
          I’m looking for industry research roles and collaborations with professors and PhD students. Say hello.
        </p>
      </Reveal>
      <Reveal className="contact__grid">
        <div className="contact__links">
          <p className="contact__or">Reach out directly</p>
          <ContactDock />
          <p className="contact__email">{profile.email}</p>
        </div>
        <ContactForm />
      </Reveal>
    </section>
  );
}
