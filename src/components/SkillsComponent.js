import React from "react";
import { Box, Toolbar, Typography, Tooltip } from "@mui/material";

const skills = [
  {
    section: "Languages",
    items: [
      {
        name: "Python",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
      },
      {
        name: "Java",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
      },
      {
        name: "JavaScript",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        name: "C++",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
      },
      {
        name: "C",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
      },
      {
        name: "SQL",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
      },
    ],
  },
  {
    section: "Frameworks & Libraries",
    items: [
      {
        name: "PyTorch",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg",
      },
      {
        name: "NumPy",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg",
      },
      {
        name: "Pandas",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg",
      },
      {
        name: "OpenCV",
        src: "https://upload.wikimedia.org/wikipedia/commons/3/32/OpenCV_Logo_with_text_svg_version.svg",
      },
      {
        name: "LangChain",
        src: "skill-logos/langchain.png",
      },
      {
        name: "LangGraph",
        src: "skill-logos/langgraph.png",
      },
      {
        name: "CrewAI",
        src: "skill-logos/crewai.png",
      },
      {
        name: "Transformers",
        src: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
      },
      {
        name: "Spring Boot",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
      },
      {
        name: "React",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      },
      {
        name: "Node.js",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Express",
        src: "skill-logos/express.svg",
      },
      {
        name: "Redux",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redux/redux-original.svg",
      }
    ],
  },
  {
    section: "Tools & Platforms",
    items: [
      {
        name: "Git",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
      },
      {
        name: "Groq",
        src: "skill-logos/groq.svg",
      },
      {
        name: "Grafana",
        src: "https://cdn.worldvectorlogo.com/logos/grafana.svg",
      },
      {
        name: "Kubernetes",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg",
      },
      {
        name: "Terraform",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg",
      },
      {
        name: "Jenkins",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg",
      },
      {
        name: "Docker",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
      },
      {
        name: "Microservices",
        src: "https://cdn-icons-png.flaticon.com/512/2906/2906274.png", // generic icon
      },
      {
        name: "Kafka",
        src: "skill-logos/kafka.svg",
      },
      {
        name: "MLFlow",
        src: "skill-logos/mlflow.svg",
      },
    ],
  },
  {
    section: "Databases & Cloud",
    items: [
      {
        name: "PostgreSQL",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "MongoDB",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
      },
      {
        name: "Elasticsearch",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg",
      },
      {
        name: "Neo4j",
        src: "skill-logos/neo4j.png",
      },
      {
        name: "AWS",
        src: "skill-logos/aws.png",
      },
    ],
  },
];

function SkillsComponent() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold">
        Skills
      </Typography>
      <div className="custom-divider"></div>
      <Box>
        {skills.map((section) => (
          <Box key={section.section}>
            <Typography fontWeight="bold" className="text-secondary">
              {section.section}
            </Typography>
            <Toolbar className="skill-section">
              {section.items.map((skill) => (
                <Tooltip title={skill.name}>
                  <Box
                    component="img"
                    src={skill.src}
                    alt={skill.name}
                    className="skill-icon"
                  />
                </Tooltip>
              ))}
            </Toolbar>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default SkillsComponent;
