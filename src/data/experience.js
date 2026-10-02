export const experience = [
  {
    id: "research-assistant",
    role: "Research Assistant",
    company: "Computer Science Department, San José State University",
    short: "SJSU",
    dates: "Jun 2025 – Present",
    location: "San Jose, CA",
    logo: "logos/sjsu.svg",
    summary: [
      "Conducting research under Prof. Jelena Gligorijevic on LLM + Knowledge Graph reasoning, integrating external knowledge and transparent reasoning techniques to improve factuality, interpretability, and trustworthiness.",
      "Developed multi-agent reasoning frameworks for efficient knowledge graph traversal and multi-hop reasoning, incorporating self-improving mechanisms that iteratively evaluate and refine reasoning strategy.",
    ],
    details: [
      "Implemented and evaluated SOTA baselines and frontier reasoning techniques, analyzing reasoning failures and performance gaps to guide the development of more accurate, efficient, and trustworthy KG + LLM reasoning systems.",
    ],
  },
  {
    id: "sap",
    role: "AI Software Developer Intern / Performance Engineer",
    company: "SAP Labs",
    short: "SAP",
    dates: "Jul 2026 – Sep 2026",
    logo: "logos/sap.svg",
    summary: [
      "Researched open-source LLMs and curated Jira tickets and documentation to build a specialized model using Hugging Face Transformers and PEFT/LoRA, generating context-aware resolutions for recurring performance issues.",
      "Integrated knowledge from Jira, Splunk, Wiki, and Confluence, deployed the fine-tuned LLM locally with Ollama, and built AI Skills and MCP (Model Context Protocol) interfaces for secure, tool-augmented troubleshooting workflows.",
    ],
    details: [
      "Built an agentic validation framework that converts internal documentation into structured rules, table schemas, and knowledge graphs, enabling automated rule and schema validation of AI-generated configurations.",
      "Developed knowledge-graph-based impact analysis to trace dependencies and downstream effects of configuration changes, improving the reliability and explainability of AI-agent-driven performance analysis.",
    ],
  },
  {
    id: "jpmc",
    role: "Software Developer",
    company: "JPMorgan Chase",
    short: "JPMC",
    dates: "Feb 2023 – Dec 2024",
    location: "Hyderabad, India",
    logo: "logos/jpmc.jpg",
    summary: [
      "Developed core modules for JADE Catalog, an enterprise data governance and compliance platform managing 40K+ applications and 200K+ data sources, improving traceability, lineage, regulatory compliance, and policy automation.",
      "Engineered scalable data workflows and monitoring systems using Spring Boot, PostgreSQL, Kafka & Elasticsearch, ensuring 99.9% availability, real-time data consistency, and 10× faster artifact retrieval across enterprise systems.",
    ],
    details: [
      "Designed and deployed microservices on AWS Kubernetes, automated infrastructure with Terraform, and integrated OpenAPI, Redis & Amazon SQS to support high-throughput certification, communication, and data-processing.",
      "Built React + TypeScript interfaces and applied data analysis and automation to identify performance bottlenecks, optimize high-throughput workflows, and improve overall system efficiency, reliability, and cross-platform accessibility.",
    ],
  },
];
