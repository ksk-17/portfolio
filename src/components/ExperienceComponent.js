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

const experiences = [
  {
    title: "Software Engineer",
    company: "JP Morgan Chase",
    duration: "Jun'23 - Dec'24",
    description:
      "• Developed and maintained core modules of the JADE Catalog, an enterprise-grade internal Data Governance platform, significantly improving data traceability, compliance tracking, and governance across 40k+ internal applications and 200k+ sharepoints and other data sources. \n\
      • Engineered dynamic workflows for handling complex upstream data pipelines automating application and data resource certification against evolving compliance frameworks. \n \
      • Actively monitored and optimized data sync health and logical consistency across pipelines, ensuring 99.9% availability and timely certification updates. \n\
      • Built and deployed microservices using Spring Boot, integrated with PostgreSQL for data persistence, hosted on AWS with Kubernetes for scalable, fault-tolerant deployments. \n\
      • Leveraged Terraform for repeatable infrastructure provisioning and Kafka for low-latency, real-time communication between services. \n\
      • Implemented Elasticsearch-backed search capabilities, enabling users to locate compliance artifacts and data assets 10x faster, significantly improving productivity for data stewards and governance teams. \n\
      • Supported React.js frontend development during critical feature sprints, accelerating cross-functional delivery timelines and ensuring a seamless, responsive UI for compliance officers and data owners. \n\
      • Refactored legacy monolithic services into modular microservices, enabling faster deployment cycles, better fault isolation, and independent scalability. Designed and integrated a cross-application notification framework, ensuring real-time visibility into compliance statuses, registration progress, and pipeline failures. \n\
      • Acted as a key liaison during production incidents and major release cycles, leading root cause analysis and hotfix deployments. \n\
      • Conducted technical demos and knowledge transfers for leadership and end-users, improving feature adoption and aligning technical delivery with business objectives. \n\
",
  },
  {
    title: "Software Engineer Intern",
    company: "JP Morgan Chase",
    duration: "Jan'23 - May'24",
  },
];

function ExperienceComponent() {
  return (
    <Box className="experience-box">
      <Typography variant="h4" fontWeight="bold">
        Experience
      </Typography>
      <div className="custom-divider"></div>
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.2,
          },
        }}
      >
        {experiences.map((experience) => (
          <TimelineItem>
            <TimelineOppositeContent>
              <Typography>{experience.duration}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent className="timeline-item-content">
              <Typography className="text-primary">
                {experience.title}
              </Typography>
              <Typography className="text-secondary">
                {experience.company}
              </Typography>
              <Typography
                className="text-light"
                style={{ whiteSpace: "pre-line" }}
              >
                {experience.description}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}

export default ExperienceComponent;
