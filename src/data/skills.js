// `icon` is a key in components/Skills/skillIcons.js; skills without one show a monogram badge.
export const skills = [
  {
    group: "Languages",
    items: [
      { name: "Python", icon: "python" },
      { name: "Java" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "C++", icon: "cplusplus" },
      { name: "SQL" },
      { name: "Go", icon: "go" },
      { name: "Rust", icon: "rust" },
    ],
  },
  {
    group: "ML & AI",
    items: [
      { name: "PyTorch", icon: "pytorch" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "scikit-learn", icon: "scikitlearn" },
      { name: "OpenCV", icon: "opencv" },
      { name: "Hugging Face", icon: "huggingface" },
      { name: "LangChain", icon: "langchain" },
      { name: "LangGraph", icon: "langgraph" },
      { name: "MCP", icon: "modelcontextprotocol" },
      { name: "RAG" },
      { name: "LoRA / PEFT" },
    ],
  },
  {
    group: "Data & Cloud",
    items: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Kafka", icon: "apachekafka" },
      { name: "Elasticsearch", icon: "elasticsearch" },
      { name: "Neo4j", icon: "neo4j" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "FAISS" },
      { name: "AWS" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "Docker", icon: "docker" },
      { name: "Terraform", icon: "terraform" },
    ],
  },
  {
    group: "Web & Backend",
    items: [
      { name: "React", icon: "react" },
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Spring Boot", icon: "springboot" },
      { name: "FastAPI", icon: "fastapi" },
    ],
  },
];
