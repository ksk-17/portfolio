export const education = [
  {
    id: "sjsu",
    school: "San José State University",
    shortName: "SJSU",
    degree: "M.S. in Artificial Intelligence",
    dates: "Jan 2025 – Dec 2026",
    gpa: "3.67",
    location: { label: "San Jose, California", lat: 37.3352, lng: -121.8811 },
    logo: "logos/sjsu.svg",
    coursework: [
      "Machine Learning",
      "Artificial Intelligence and Data Engineering",
      "Math for Data Science",
      "Reinforcement Learning",
      "Natural Language Processing",
      "Recommender Systems",
    ],
    highlights: [
      {
        title: "Master's thesis — Neuro-Symbolic Vision Reasoning Models",
        text: "Strengthening visual reasoning by combining neural learning with structured symbolic reasoning.",
      },
    ],
  },
  {
    id: "vnr",
    school: "VNR Vignana Jyothi Institute of Engineering and Technology",
    shortName: "VNR VJIET",
    degree: "B.Tech in Computer Science and Business Systems",
    dates: "Aug 2019 – May 2023",
    gpa: "3.67",
    location: { label: "Hyderabad, India", lat: 17.54, lng: 78.386 },
    logo: "logos/vnrvjiet.png",
    coursework: [
      "Linear Algebra",
      "Statistics",
      "Machine Learning",
      "Artificial Intelligence",
      "Data Mining",
      "Data Structures and Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Compiler Design",
    ],
    highlights: [
      {
        title: "Major project — Old Photo Restoration with two VAEs",
        text: "Led development of a restoration system combining two variational autoencoders to remove scratches and dust and fill missing regions; trained on the VOC dataset.",
      },
      {
        title: "Mini project — Lip Movement Detection",
        text: "CNN + LSTM lip-reading system reaching 91% accuracy transcribing spoken words from video.",
      },
    ],
  },
];
