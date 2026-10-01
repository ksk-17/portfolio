import { MotionConfig } from "motion/react";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#education">Skip to content</a>
      <Nav />
      <main>
        <h1 id="top">Sumanth Kumar Kotagudem</h1>
      </main>
      <Footer />
    </MotionConfig>
  );
}
