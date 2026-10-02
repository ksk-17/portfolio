export const education = [
  {
    id: "sjsu",
    school: "San José State University",
    shortName: "SJSU",
    degree: "M.S. in Artificial Intelligence",
    dates: "Jan 2025 – Present",
    gpa: "3.77",
    location: { label: "San Jose, California", lat: 37.3352, lng: -121.8811 },
    logo: null,
    coursework: [
      "Machine Learning",
      "Artificial Intelligence and Data Engineering",
      "Math for Data Science",
      "Reinforcement Learning",
      "Natural Language Processing",
      "Recommender Systems",
      "Deep Learning",
    ],
    highlights: [
      {
        title: "Master's thesis — Vision Reasoning using a Neuro-Symbolic Approach",
        text: "Strengthening visual reasoning by combining neural learning with structured symbolic reasoning, toward vision models that are more robust, interpretable and scalable.",
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
    logo: null,
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
