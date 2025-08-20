import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
  TimelineSeparator,
  timelineOppositeContentClasses,
} from "@mui/lab";

import { Typography, Box } from "@mui/material";

const educationList = [
  {
    title: "Masters in Artificial Intelligence",
    college: "San Jose State University, San Jose, California",
    duration: "Jan'25 - Dec'26",
    description:
      "GPA - 3.67 \n \
      Related Coursework: Machine Learning, Artificial Intelligence and Data Engineering, Math for Data Science, Reinforcement Learning, Natural Language Processing, Recommender Systems. \
      ",
  },
  {
    title: "Bachelors in Computer Science and Business Systems",
    college:
      "VNR Vignana Jyothi Institute of Engineering and Technology, Hyderabad, INdia",
    duration: "Aug'19 - May'23",
    description:
      "GPA - 3.67 \n \n \
      Related Coursework: Linear Algebra, Statistics, Machine Learning, Artificial Intellignece, Data Mining, Object Oriented Programming, Data Structures and Algorithms, Software Engineering, Software Design, Database Management Systems, Operating Systems, Computer Networks, Computer Organization and Architecture, Formal Language and Automata theory, Compiler Design, IT Project Management \n \n \
      Major Project: Old Photo Restoration using 2 Variational Auto Encoders (VAEs)\n \
      Headed the development of an innovative Old Photo Restoration system employing Two Variational Autoencoders (VAE), effectively restoring and enhancing aged photographs. Various models are employed in combination to remove scratches and dust spots while generating images fo missing areas. Trained the model using VOC Dataset.\n \n \
      Mini Project: Lip Movement Detection using RNN \n \
      Developed a lip reading system using CNN and LSTM, achieving high accuracy of 91% in transcribing spoken words from lip movements. Successfully preprocessed and curated extensive video datasets while optimizing model hyperparameters and conducting rigorous testing, resulting in a robust and accurate deep learning model. \
      ",
  },
];

function EducationComponent() {
  return (
    <Box className="experience-box">
      <Typography variant="h4" fontWeight="bold">
        Education
      </Typography>
      <div className="custom-divider"></div>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        {educationList.map((education) => (
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography>{education.duration}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="timeline-item-content">
              <Typography className="text-primary">
                {education.title}
              </Typography>
              <Typography className="text-secondary">
                {education.college}
              </Typography>
              <Typography
                className="text-light"
                style={{ whiteSpace: "pre-line" }}
              >
                {education.description}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}

export default EducationComponent;
