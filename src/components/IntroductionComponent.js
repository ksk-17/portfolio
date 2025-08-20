import { Avatar, Box, Chip, Typography } from "@mui/material";

const profiles = [
  "ML Engineer",
  "Data Scientist",
  "ML Operations",
  "Full Stack Developer",
];

function IntroductionComponent() {
  return (
    <Box className="introbox">
      <Box>
        <Box className="introbox-header">
          <Typography variant="h4" fontWeight="bold">
            About Me
          </Typography>
          <div className="custom-divider"></div>
        </Box>
        <Box mt={3}>
          <Typography className="text-light">
            Hi, I’m Sumanth Kumar Kotagudem — a Master's student in Artificial
            Intelligence at San Jose State University with a background in
            software development, machine learning, and data-driven systems.
            <br />
            <br />
            I’m passionate about building intelligent, scalable solutions that
            bridge the gap between cutting-edge research and real-world impact.
            From developing backend infrastructure at JP Morgan to leading AI
            projects in areas like recommendation systems, geospatial modeling,
            and autonomous data engineering agents, I thrive at the intersection
            of data, code, and innovation. Welcome to my portfolio — a
            collection of work that reflects my curiosity, technical depth, and
            drive to create meaningful technology.
          </Typography>
        </Box>
        <Box mt={3}>
          {profiles.map((profile) => (
            <Chip label={profile} variant="outlined" className="chip" />
          ))}
        </Box>
      </Box>
      <Avatar
        alt="Sumanth Kumar Kotagudem"
        src="image.png"
        sx={{ width: 300, height: 300 }}
      />
    </Box>
  );
}

export default IntroductionComponent;
