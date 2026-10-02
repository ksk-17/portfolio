import { MotionConfig } from "motion/react";
import { ThemeProvider } from "./theme/ThemeContext";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer";
import Hero from "./components/Hero/Hero";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Projects from "./components/Projects/Projects";

export default function App() {
  return (
    <ThemeProvider>
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#education">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Education />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </MotionConfig>
    </ThemeProvider>
  );
}
