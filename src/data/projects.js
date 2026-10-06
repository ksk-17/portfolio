export const moreProjects = { label: "More projects", href: "https://github.com/ksk-17?tab=repositories" };

export const projects = [
  {
    slug: "cardguard",
    title: "CardGuard",
    context: "Flower.ai Collaborative Agent Hackathon 2026",
    summary:
      "Merchants, a card's bank and a Flower coordinator investigate a card payment together without any card data entering a model's context. Only banded facts cross parties, a deterministic Policy Gate makes the decision, and a person reviews the uncertain cases, with a hash-chained audit ledger.",
    image: "projects/cardguard.webp",
    tags: ["Multi-agent", "Flower", "Stripe", "React"],
    github: "https://github.com/CR2004/cardguard",
  },
  {
    slug: "signcast",
    title: "SignCast",
    context: "CalHacks 2026",
    summary:
      "Live sign-language layer that translates sports commentary for Deaf and hard-of-hearing fans. Speech-to-text feeds Claude, which converts commentary into sign gloss in ASL, BSL, LSF, CSL or JSL, and a draggable video overlay plays the signs over a YouTube live stream. A Claude-as-judge agent grades translations on five quality metrics.",
    tags: ["Claude", "Deepgram", "WebSocket", "Accessibility"],
    image: "projects/signcast.webp",
    github: "https://github.com/AkankshaThalla-24/CalHacks26",
  },
  {
    slug: "road-damage-detection",
    title: "Road Damage Detection",
    context: "Deep Learning course project",
    summary:
      "End-to-end detection of cracks and potholes in aerial imagery on RDD2022 (47k images, 6 countries). Compares YOLOv11 with RT-DETRv2 and adds a 4th FPN scale, Focal + WIoU loss and augmentation-based domain adaptation.",
    metric: "RT-DETRv2 0.552 mAP@50 vs 0.354 YOLO baseline",
    tags: ["YOLOv11", "RT-DETRv2", "PyTorch", "Computer Vision"],
    github: "https://github.com/ksk-17/road_damage_detection",
  },
  {
    slug: "math-reasoning-finetuning",
    title: "Math Reasoning Alignment",
    summary:
      "SFT, PPO, DPO and GRPO implemented from scratch with QLoRA on Qwen2.5-Math-1.5B, trained on Colab GPUs. Self-play DPO with distribution-aligned preference pairs beat both RL methods under limited compute.",
    metric: "DPO 42.1% vs 9.3% base accuracy",
    tags: ["DPO", "PPO", "GRPO", "QLoRA"],
    github: "https://github.com/ksk-17/math-reasoning-finetuning",
  },
  {
    slug: "football-detection",
    title: "Football Detection",
    context: "Deep Learning course project",
    summary:
      "Player, ball, goalkeeper and referee detection with YOLOv8n, YOLO11n and RT-DETR-L, each accelerated with ONNX Runtime and OpenVINO on CPU. Served through a FastAPI backend and a React dashboard with benchmark views, and evaluated on a self-annotated test set.",
    metric: "RT-DETR-L 0.84 mAP50",
    tags: ["RT-DETR", "ONNX", "OpenVINO", "FastAPI"],
    github: "https://github.com/ksk-17/football-detection",
  },
  {
    slug: "forge-ops",
    title: "Forge Ops",
    summary:
      "A self-improving multi-agent system for coding tasks, built with LangGraph and Claude. An Architect agent clarifies requirements with the user, a Team Lead splits the spec into tasks and runs parallel Workers, and each Worker plans, edits files through locked tools, writes tests and self-reviews before reporting back.",
    tags: ["Multi-agent", "LangGraph", "Claude", "Python"],
    github: "https://github.com/ksk-17/forge-ops",
  },
  {
    slug: "finance-rag",
    title: "Finance RAG",
    summary:
      "RAG over SEC EDGAR filings for S&P 100 companies. Filings are parsed into text and table chunks, with LLM table summaries, embedded into Qdrant for hybrid dense and BM25 search, filtered by ticker, year and quarter, then reranked with a cross-encoder.",
    tags: ["RAG", "Qdrant", "Hybrid search", "LangChain"],
    github: "https://github.com/ksk-17/finance_rag",
  },
  {
    slug: "recsys-256",
    title: "Recommendation System (CMPE 256)",
    summary:
      "Large-scale implicit-feedback recommender evaluated with NDCG@20. Progresses from BPR matrix factorization with popularity-weighted negatives to NeuralMF and LightGCN graph convolution.",
    tags: ["RecSys", "LightGCN", "BPR", "PyTorch"],
    github: "https://github.com/ksk-17/cmpe_256_project",
  },
];
