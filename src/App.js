import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import {
  AppBar,
  Container,
  Toolbar,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import IntroductionComponent from "./components/IntroductionComponent";
import ExperienceComponent from "./components/ExperienceComponent";
import ProjectComponent from "./components/ProjectComponent";
import ContactMeComponent from "./components/ContactMeComponent";
import EducationComponent from "./components/EducationComponent";
import SkillsComponent from "./components/SkillsComponent";
import CertificationsComponent from "./components/CertificationsComponent";

const sections = [
  "Intro",
  "Experience",
  "Education",
  "Projects",
  "Certifications",
  "Skills",
  "Contact",
];

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <AppBar position="fixed" className="app-bar">
            <Toolbar>
              <Typography
                variant="h6"
                fontWeight="bold"
                className="text-secondary"
              >
                Sumanth Kumar Kotagudem
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              {sections.map((section) => (
                <MenuItem key={section} className="menu-item">
                  <Link
                    to={`#${section.toLowerCase()}`}
                    smooth={true}
                    duration={500}
                    className="menu-item-link"
                  >
                    <Typography>{section}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Toolbar>
          </AppBar>
        </header>
        <main>
          <Container disableGutters>
            <section id="intro" className="section">
              <IntroductionComponent />
            </section>

            <section
              id="experience"
              className="section"
              style={{ marginTop: "25vh" }}
            >
              <ExperienceComponent />
            </section>

            <section
              id="education"
              className="section"
              style={{ marginTop: "25vh" }}
            >
              <EducationComponent />
            </section>

            <section
              id="projects"
              className="section"
              style={{ marginTop: "25vh" }}
            >
              <ProjectComponent />
            </section>

            <section
              id="certifications"
              className="section"
              style={{ marginTop: "25vh" }}
            >
              <CertificationsComponent />
            </section>

            <section
              id="skills"
              className="section"
              style={{ marginTop: "25vh" }}
            >
              <SkillsComponent />
            </section>

            <section
              id="contact"
              className="section"
              style={{ marginTop: "25vh" }}
            >
              <ContactMeComponent />
            </section>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
