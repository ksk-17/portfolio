import { MotionConfig } from "motion/react";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer";
import Hero from "./components/Hero/Hero";
import Education from "./components/Education/Education";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#education">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Education />
      </main>
      <Footer />
    </MotionConfig>
  );
}
