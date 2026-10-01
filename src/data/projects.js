export const projects = [
  {
    slug: "rag-research-assistant",
    title: "RAG-Based Research Assistant",
    summary:
      "AI research assistant using RAG with FAISS, SentenceTransformers and OpenAI APIs for semantic search over academic literature, with PDF/arXiv ingestion, citation-backed Q&A and summarization in a chat interface.",
    tags: ["RAG", "FAISS", "SentenceTransformers", "OpenAI"],
    github: "https://github.com/ksk-17/research_assistant_using_rag/tree/master",
  },
  {
    slug: "qlora-phi2",
    title: "Fine-Tuning LLMs with QLoRA",
    summary:
      "Fine-tuned microsoft/phi-2 on DialogSum using QLoRA with 4-bit quantization and LoRA adapters, improving summarization quality and contextual fluency with efficient parameter tuning.",
    metric: "+13.39% ROUGE",
    tags: ["QLoRA", "PEFT", "phi-2", "PyTorch"],
    github: "https://github.com/ksk-17/finetuning-using-qlora/blob/master/fine-tune-llm-using-qlora.ipynb",
  },
  {
    slug: "cyclegan-monet",
    title: "Style Transfer with CycleGAN",
    summary:
      "CycleGAN built from scratch in PyTorch for unpaired translation between landscape photos and Monet-style paintings, using adversarial, cycle-consistency and identity losses for stable training.",
    metric: "MiFID 69.25",
    tags: ["GANs", "PyTorch", "Computer Vision"],
    github: "https://github.com/ksk-17/CycleGAN-Monet-Art-Generator/blob/master/i-m-something-of-a-painter-myself-cyclegan.ipynb",
  },
  {
    slug: "hybrid-music-recsys",
    title: "Music Recommendation with Hybrid Filtering",
    summary:
      "Hybrid recommender combining content-based and collaborative filtering (PCA, K-Means, SVD) on the Million Song Dataset, with adaptive logic that resolves cold-start and sparsity issues.",
    metric: "Improved F1@5",
    tags: ["RecSys", "SVD", "K-Means", "PCA"],
    github: "https://github.com/ksk-17/music_recommendation_using_hybrid_filtering",
  },
  {
    slug: "ventilator-pressure",
    title: "Ventilator Pressure Prediction",
    summary:
      "Bi-LSTM model predicting ventilator pressure from time-series data using domain-specific and lag-based feature engineering, a custom training loop and k-fold cross-validation.",
    metric: "MAE 0.8045",
    tags: ["Bi-LSTM", "Time series", "Kaggle"],
    github: "https://github.com/ksk-17/Ventilator-Pressure-Prediction/tree/master",
  },
];
