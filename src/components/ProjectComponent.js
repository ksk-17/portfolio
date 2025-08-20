import { useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, GitHub } from "@mui/icons-material";

function ProjectComponent() {
  const projects = [
    {
      title: "RAG-Based Research Assistant",
      description:
        "Designed an AI research assistant using RAG pipelines with FAISS, SentenceTransformers, and OpenAI APIs for semantic search over academic literature. Enabled PDF and arXiv ingestion with real-time citation-backed Q&A, abstractive summarization, and contextual topic discovery and in-depth research analysis through an interactive chat interface.",
      links: [
        "https://github.com/ksk-17/research_assistant_using_rag/tree/master",
      ],
    },
    {
      title: "Fine-Tuning LLM with QLoRA for Personalized Dialogue Generation",
      description:
        "Fine-tuned the microsoft/phi-2 model on the DialogSum dataset using QLoRA with 4-bit quantization and LoRA adapters for efficient parameter tuning. Achieved a 13.39% improvement in ROUGE score, enhancing summarization accuracy and contextual fluency. Demonstrated scalable fine-tuning strategies for domain-specific LLM applications.",
      links: [
        "https://github.com/ksk-17/finetuning-using-qlora/blob/master/fine-tune-llm-using-qlora.ipynb",
      ],
    },
    {
      title: "Style Transfer using CycleGAN",
      description:
        "Built a CycleGAN model from scratch using PyTorch for unpaired image-to-image translation between landscape photos and Monet-style artworks. Implemented adversarial, cycle-consistency, and identity losses for stable training and style preservation. Achieved a MiFID score of 69.25, validating the model’s ability to generalize and mimic artistic patterns.",
      links: [
        "https://github.com/ksk-17/CycleGAN-Monet-Art-Generator/blob/master/i-m-something-of-a-painter-myself-cyclegan.ipynb",
      ],
    },
    {
      title: "Music Recommendation using Hybrid Filtering",
      description:
        "Developed a Hybrid recommender system by integrating content-based filtering with collaborative methods using PCA, K-Means, and SVD. Processed user interaction data from the Million Song Dataset to extract preferences and song similarity metrics. Improved F1@5 scores and resolved cold-start and sparsity issues with adaptive logic.",
      links: [
        "https://github.com/ksk-17/music_recommendation_using_hybrid_filtering",
      ],
    },
    {
      title: "Ventilator Pressure Prediction",
      description:
        "Engineered a Bi-LSTM model to predict ventilator pressure from Time-series data, using domain-specific and lag-based feature engineering. Achieved a MAE of 0.8045 via custom training loop and k-fold cross-validation for robustness.",
      links: [
        "https://github.com/ksk-17/Ventilator-Pressure-Prediction/tree/master",
      ],
    },
  ];

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Box className="project-box">
      <div>
        <Typography variant="h4" fontWeight="bold">
          Projects
        </Typography>
        <div className="custom-divider"></div>
      </div>

      <Box className="project-row">
        <IconButton
          onClick={() => scroll("left")}
          className="project-scroll project-scroll-left text-secondary"
        >
          <ArrowBackIos />
        </IconButton>

        <Box className="project-container" ref={scrollRef}>
          {projects.map((project, index) => (
            <Card
              key={index}
              className="project-card"
              style={{ minWidth: "300px" }}
            >
              <CardContent>
                <Typography className="text-secondary">
                  {project.title}
                </Typography>
                <Typography variant="body2" className="text-light" mt={2}>
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions className="row-reverse">
                {project.links.map((link) => (
                  <Button
                    size="small"
                    onClick={() => window.open(link, "_blank")}
                    className="card-button"
                  >
                    <GitHub sx={{ color: "#fff" }} />
                  </Button>
                ))}
              </CardActions>
            </Card>
          ))}
        </Box>

        <IconButton
          onClick={() => scroll("right")}
          className="project-scroll project-scroll-right text-secondary"
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ProjectComponent;
