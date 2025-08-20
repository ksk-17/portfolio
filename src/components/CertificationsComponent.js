import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";

function CertificationsComponent() {
  const certifications = [
    {
      title: "AWS Cloud Practicioner",
      issuer: "Amazon Web Services (AWS)",
      description:
        "\n Through this certification, I developed a solid foundation in cloud computing and the AWS ecosystem. I learned: \n \n \
      • The core concepts of cloud computing, including scalability, elasticity, and high availability. \n \
      • How AWS services such as EC2, S3, Lambda, RDS, and CloudFront are used to build and manage cloud applications. \n \
      • The structure of AWS's global infrastructure, including regions, availability zones, and edge locations. \n \
      • Fundamentals of cloud security, including IAM (Identity and Access Management), encryption, and compliance best practices. \n \
      • How to estimate AWS costs, choose the right pricing models, and apply cost management tools for efficient cloud budgeting. \n \
      • Basic architectural principles for designing cloud-native applications.\n \n \
      This certification strengthened my ability to speak about AWS services confidently and positioned me to build and support cloud-based solutions.",
      verificationLink:
        "https://cp.certmetrics.com/amazon/en/public/verify/credential/E30RQGBBQF411GGW",
    },
    {
      title: "Machine Learning Speciailzation",
      issuer: "DeepLearning.ai",
      description:
        "\n Through this three-course specialization led by Andrew Ng, I gained a solid and practical foundation in modern machine learning—building intuition, writing code, and leveraging real-world tools to solve complex problems. \n \n \
        •  Course 1: Supervised Machine Learning – Regression & Classification  \n \
        Explored supervised learning using Python, NumPy, and scikit-learn. \
        Built and trained models such as linear regression for predicting continuous values and logistic regression for classification tasks.  \n \n \
        • Course 2: Advanced Learning Algorithms  \n \
        Designed and trained neural networks using TensorFlow for multi-class classification. \
        Applied best practices for model generalization—regularization, ensemble methods (random forests and boosted trees), and performance optimization.  \n \n \
        • Course 3: Unsupervised Learning, Recommenders & Reinforcement Learning  \n\
        Worked with clustering and anomaly detection techniques in an unsupervised context. \
        Built recommender systems through both collaborative filtering and content‑based deep learning methods. \
        Explored reinforcement learning fundamentals by creating a basic RL model.",
      verificationLink:
        "https://www.coursera.org/account/accomplishments/specialization/9XBLQE4P6F6E",
    },
    {
      title: "Deep Learning Speciailzation",
      issuer: "DeepLearning.ai",
      description:
        "\n Through this five‑course, intermediate‑level specialization taught by Andrew Ng and the DeepLearning.ai team, I built a robust and practical foundation in deep learning—grounded in both theory and real‑world application. \
        What I Learned \n \n \
        •  Course 1: Neural Networks and Deep Learning \n \
        Grasped foundational deep learning concepts such as forward and backpropagation, vectorization, and activation functions. \
        Built and trained fully connected neural networks to tackle classification problems. \
        Learned to optimize network performance using techniques like parameter tuning and architecture selection.\n \n \
        •  Course 2: Improving Deep Neural Networks: Hyperparameter Tuning, Regularization, and Optimization \n \
        Mastered strategies to improve model generalization and performance, including L2 and dropout regularization, batch normalization, and gradient checking. \
        Applied various optimization algorithms (e.g. mini‑batch gradient descent, Momentum, RMSprop, Adam) and experimented with hyperparameter tuning and initialization methods. \
        Gained hands‑on experience implementing neural networks using TensorFlow. \
        • Course 3: Structuring Machine Learning Projects \n \n \
        Learned to diagnose errors systematically by analyzing bias vs. variance and identifying mismatched datasets. \
        Explored strategic techniques such as end‑to‑end learning, transfer learning, and multi‑task learning. \
        Developed a project‑oriented mindset inspired by real‑world ML leadership scenarios. \n \n \
        • Course 4: Convolutional Neural Networks \n \
        Understood the workings and variations of CNN architectures including residual networks. \
        Applied convolutional networks to tasks like image recognition, object detection, and neural style transfer. \
        Gained insight into applications such as face recognition, radiology image analysis, and autonomous driving. \n \n \
        • Course 5: Sequence Models \n \
        Built and trained sequence models using RNNs, GRUs, and LSTMs across domains like language modeling and speech processing. \
        Applied natural language processing techniques, including word embeddings, attention mechanisms, and Transformer-based models using tools like Hugging Face. \
        Worked on applications such as music synthesis, character‑level text generation, chatbots, machine translation, and question answering.",
      verificationLink:
        "https://www.coursera.org/account/accomplishments/specialization/G8VS8K75NPAC",
    },
    {
      title: "Generative Adversial Networks(GANs) Speciailzation",
      issuer: "DeepLearning.ai",
      description:
        "\n I completed the intermediate-level, three-course GANs Specialization taught by Sharon Zhou and the DeepLearning.ai team, where I gained a robust grasp of generative modeling using GANs—mastering both foundational techniques and cutting-edge applications using PyTorch. \n \n \
        • Course 1: Build Basic Generative Adversarial Networks (GANs) \n \
        Learned the core intuition behind GANs—how the generator and discriminator interact in a competitive, zero-sum game. \
        Designed and implemented basic GANs using PyTorch, stepping through the training process and loss functions. \
        Built DCGANs by integrating convolutional layers, batch normalization, and activation functions to improve image generation quality. \
        Created conditional GANs (cGANs) to generate images based on specified categories, giving me control over the generated outputs. \n \n \
        • Course 2: Build Better Generative Adversarial Networks (GANs) \
        Tackled challenges in evaluating GAN quality, learning to use metrics like Fréchet Inception Distance (FID) to measure fidelity and diversity. \
        Gained awareness of bias in GANs, identifying how it arises and learning strategies to detect and mitigate it. \
        Studied and implemented StyleGAN, understanding key techniques such as progressive growing, noise mapping, and adaptive instance normalization (AdaIN). \n \n \
        • Course 3: Apply Generative Adversarial Networks (GANs) \n \
        Explored practical applications of GANs, including data augmentation and privacy preservation via synthetic data generation methods. \
        Implemented Pix2Pix for paired image-to-image translation—like converting satellite images to maps using U-Net and PatchGAN architectures. \
        Implemented CycleGAN for unpaired image translation such as transforming images of horses into zebras (and vice versa).",
      verificationLink:
        "https://www.coursera.org/account/accomplishments/specialization/KH63MWJLC4WM",
    },
    {
      title: "Generative AI with Large Language Models",
      issuer: "DeepLearning.ai",
      description:
        "\n I completed an intensive, intermediate-level course that deepened my understanding of generative AI powered by LLMs and equipped me with hands-on experience in designing, fine-tuning, and deploying large-scale language models. This course was jointly developed with AWS and rooted in real-world practices, delivering both technical depth and practical application insights \n \n \
        • Week 1: LLM Fundamentals & Generative AI Lifecycle \n \
        Mastered the end-to-end Generative AI project lifecycle, from scoping and data gathering to model selection, evaluation, deployment, and application integration \
        Gained a deep-looking understanding of the Transformer architecture, including how LLMs generate text and how prompt engineering and generative configuration parameters (temperature, top-p, etc.) shape model outputs  \
        Explored pre-training mechanics using empirical scaling laws, and learned how dataset size, compute budget, and inference constraints influence design decisions  \n \n \
        • Week 2: Fine-Tuning & Evaluation (Week 2)  \n \
        Learned how to fine-tune LLMs, including both single-task and multi-task instruction tuning, and evaluated models using standard benchmarks and performance metrics  \
        Became proficient with parameter-efficient fine-tuning (PEFT) techniques like LoRA (Low-Rank Adaptation) and soft prompting, enabling effective tuning with fewer computational resources  \n \n \
        • Week 3: RLHF & Application Architectures (Week 3)  \n \
        Gained first-hand experience with Reinforcement Learning from Human Feedback (RLHF)—from collecting feedback and building reward models to applying RL for fine-tuning LLMs \
        Explored advanced application architectures, including chain-of-thought reasoning, Program-Aided Language (PAL) approaches, and ReAct models that blend reasoning with action in LLM-driven tasks \
        Learned best practices for deploying LLM applications, optimizer model performance, and integrating models with AWS tools and services  \
        Examined Responsible AI practices, including alignment with human values and ethical deployment considerations.",
      verificationLink:
        "https://www.coursera.org/account/accomplishments/specialization/KH63MWJLC4WM",
    },
  ];

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 1120;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Box>
      <div>
        <Typography variant="h4" fontWeight="bold">
          Certifications
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
          {certifications.map((certification, index) => (
            <Card
              key={index}
              className="project-card"
              style={{ minWidth: "100%" }}
            >
              <CardContent>
                <Typography className="text-primary">
                  {certification.title}
                </Typography>
                <Typography className="text-secondary" gutterBottom>
                  {certification.issuer}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-light"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {certification.description}
                </Typography>
              </CardContent>
              <CardActions className="row-reverse">
                <Button
                  onClick={() =>
                    (window.location.href = certification.verificationLink)
                  }
                  className="card-button"
                >
                  Verify
                </Button>
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

export default CertificationsComponent;
