export interface EvalResults {
  faithfulness?: number;
  relevancy?: number;
  latency?: string;
  accuracy?: number;
  f1?: number;
  precision?: number;
  recall?: number;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  demoVideo: string;
  github: string;
  complexity: 1 | 2 | 3;
  highlights: string[];
  architecture: string;
  evalResults: EvalResults;
  failureCases: string[];
  stats: {
    latency?: string;
    evalScore?: string;
    datasetSize?: string;
    costPerCall?: string;
  };
  isResearch?: boolean;
  category: string;
}

export const projects: Project[] = [
  {
    slug: "blog-writing-agent",
    name: "Blog Writing Agent System",
    tagline: "Autonomous multi-agent system that researches, writes, and refines full-length blog posts end-to-end",
    description: `An autonomous multi-agent blog writing system built with LangGraph that orchestrates specialized AI agents to research, draft, and refine publication-quality blog posts with minimal human input.

The system uses a Supervisor → Worker architecture: a Router agent decomposes the writing task, an Orchestrator assigns sub-tasks to specialized Worker agents (Research Worker, Writer Worker, Critic Worker), and a Reducer collects and merges outputs into a final coherent blog post. The entire pipeline is observable via LangSmith for full traceability of agent decisions.

Built on Groq (LLaMA 3) for ultra-fast inference, Tavily API for real-time web research, and deployed as an interactive Streamlit app with persistent session history via LangGraph checkpointing. The system dramatically reduces blog writing time from hours to under 5 minutes.`,
    tech: ["LangGraph", "LangChain", "LangSmith", "Groq (LLaMA 3)", "Tavily API", "Streamlit", "Python"],
    demoVideo: "https://youtube.com/embed/dQw4w9WgXcQ",
    github: "https://github.com/onkarshinde77/blog-writing-agent",
    complexity: 3,
    highlights: [
      "Supervisor → Router → Orchestrator → Worker → Reducer agent hierarchy",
      "Groq LLaMA 3 backend for sub-second inference per agent step",
      "Real-time web research via Tavily API integrated into research agents",
      "Full observability and tracing with LangSmith",
      "Session history and state persistence via LangGraph checkpointing",
      "Deployed as Streamlit app with chat-style history sidebar"
    ],
    architecture: "User Prompt → Router Agent → Orchestrator Agent → [Research Worker | Writer Worker | Critic Worker] (parallel) → Reducer Agent → Final Blog Post → LangSmith Trace",
    evalResults: {
      relevancy: 93,
      faithfulness: 88,
      latency: "< 5 min end-to-end"
    },
    failureCases: [
      "Agents occasionally produced overlapping sections — fixed by adding explicit section boundary instructions to the orchestrator prompt",
      "Research worker hallucinated citations — fixed by forcing Tavily search-grounded outputs and adding a citation validation step",
      "State corruption on long sessions — fixed by implementing LangGraph checkpoint-based state recovery"
    ],
    stats: {
      latency: "< 5 min",
      evalScore: "93% relevancy",
      datasetSize: "Web-scale",
      costPerCall: "~$0.00 (Groq free)"
    },
    category: "Agents & Tools",
    isResearch: false
  },
  {
    slug: "rag-document-qna",
    name: "RAG Document Q&A System",
    tagline: "Retrieval-Augmented Generation pipeline for intelligent document question answering",
    description: `A production-grade RAG (Retrieval-Augmented Generation) system that enables intelligent question answering over custom document collections. Users upload PDF documents which are chunked, embedded, and indexed into a FAISS vector store for efficient semantic retrieval.

The pipeline combines dense vector retrieval with an LLM reader to generate grounded, faithful answers with source citations. The system supports multi-document collections, handles ambiguous queries via query rewriting, and provides a Streamlit-based interface for easy interaction.

Built with LangChain for orchestration, HuggingFace sentence-transformers for embedding, FAISS for vector search, and Groq (LLaMA 3) for fast answer generation. Includes a custom faithfulness evaluation module that scores responses against retrieved context.`,
    tech: ["LangChain", "FAISS", "HuggingFace", "Groq (LLaMA 3)", "Streamlit", "Python", "Sentence Transformers"],
    demoVideo: "https://youtube.com/embed/dQw4w9WgXcQ",
    github: "https://github.com/onkarshinde77/rag-document-qna",
    complexity: 3,
    highlights: [
      "FAISS vector store with sentence-transformer embeddings",
      "Query rewriting for ambiguous or vague user questions",
      "Source citation alongside every generated answer",
      "Multi-document collection support with metadata filtering",
      "Custom faithfulness scoring against retrieved chunks"
    ],
    architecture: "PDF Upload → Text Chunking → Sentence-Transformer Embedding → FAISS Index → Query Rewriting → Semantic Retrieval (Top-K) → Context-Grounded LLM Answer → Source Citations",
    evalResults: {
      faithfulness: 87,
      relevancy: 90,
      latency: "1.2s avg"
    },
    failureCases: [
      "Retrieval missed relevant chunks when query used different vocabulary — fixed by adding BM25 hybrid search",
      "LLM answered from prior knowledge instead of retrieved context — fixed by adding explicit grounding instructions and hallucination detection"
    ],
    stats: {
      latency: "1.2s avg",
      evalScore: "87% faithfulness",
      datasetSize: "Custom PDFs",
      costPerCall: "~$0.00 (Groq)"
    },
    category: "RAG Systems"
  },
  {
    slug: "face-mask-detection",
    name: "Face Mask Detection System",
    tagline: "Real-time face mask detection with 98% accuracy using MobileNetV2 + OpenCV",
    description: `A real-time face mask detection system that achieved 98% classification accuracy on a 7,000-image dataset. The system uses a two-stage pipeline: first detecting faces in video frames using OpenCV's DNN-based face detector, then classifying each detected face as mask/no-mask using a fine-tuned MobileNetV2 model.

The model was trained with custom data augmentation (random flips, rotations, brightness adjustment) to improve robustness to diverse lighting conditions and face orientations. The system runs in real-time on standard webcam input, processing at approximately 25 FPS on CPU.

Built as a complete end-to-end project — data collection, preprocessing, model training, evaluation, and deployment as a live demo application. Achieved 98% accuracy on the held-out test set across diverse demographic groups and lighting conditions.`,
    tech: ["TensorFlow", "Keras", "MobileNetV2", "OpenCV", "NumPy", "Matplotlib", "Python"],
    demoVideo: "https://youtube.com/embed/dQw4w9WgXcQ",
    github: "https://github.com/onkarshinde77/face-mask-detection",
    complexity: 2,
    highlights: [
      "98% test accuracy on 7,000-image custom dataset",
      "Real-time detection at ~25 FPS on CPU using OpenCV",
      "Transfer learning: MobileNetV2 pretrained on ImageNet",
      "Two-stage pipeline: DNN face detector → MobileNetV2 classifier",
      "Custom data augmentation pipeline for diverse conditions"
    ],
    architecture: "Webcam Frame → OpenCV DNN Face Detector → Face ROI Crop → Preprocessing (resize, normalize) → MobileNetV2 Classifier → Mask / No-Mask Label → Real-time Overlay",
    evalResults: {
      accuracy: 98,
      precision: 97,
      recall: 98
    },
    failureCases: [
      "Low accuracy on partially occluded faces — mitigated with aggressive augmentation including random occlusion patches",
      "False positives for face-like objects (e.g., posters) — fixed by raising the face detection confidence threshold to 0.7"
    ],
    stats: {
      latency: "~25 FPS real-time",
      evalScore: "98% accuracy",
      datasetSize: "7,000 images",
      costPerCall: "On-device"
    },
    category: "Computer Vision"
  },
  {
    slug: "sentiment-analysis-nlp",
    name: "NLP Sentiment Analysis Pipeline",
    tagline: "Multi-class text sentiment classifier with 92% accuracy using LSTM and transformer features",
    description: `A complete NLP pipeline for multi-class sentiment analysis (Positive / Negative / Neutral) on social media text. The system preprocesses raw text through a custom cleaning pipeline (tokenization, stopword removal, lemmatization), extracts features using TF-IDF and fine-tuned sentence embeddings, and classifies using a BiLSTM model.

The project also benchmarks classical ML baselines (Naïve Bayes, Logistic Regression, SVM) against the deep learning approach, providing a comprehensive evaluation framework. Results are visualized through confusion matrices, ROC curves, and per-class precision/recall breakdowns.

Achieved 92% macro-F1 on a benchmark Twitter dataset. The pipeline is packaged as a reusable Python module with a Streamlit demo interface.`,
    tech: ["Python", "NLTK", "TensorFlow", "Keras", "Scikit-learn", "Pandas", "Matplotlib", "Streamlit"],
    demoVideo: "https://youtube.com/embed/dQw4w9WgXcQ",
    github: "https://github.com/onkarshinde77/sentiment-analysis",
    complexity: 2,
    highlights: [
      "92% macro-F1 on benchmark Twitter sentiment dataset",
      "BiLSTM model outperforming all classical ML baselines by 8%",
      "Custom text cleaning pipeline for social media noise",
      "Comprehensive benchmark: NaïveBayes, Logistic Regression, SVM, BiLSTM",
      "Interactive Streamlit demo for real-time inference"
    ],
    architecture: "Raw Text → Custom Cleaning Pipeline → TF-IDF + Sentence Embeddings → BiLSTM (2-layer) → Softmax → Positive / Negative / Neutral",
    evalResults: {
      f1: 92,
      accuracy: 91,
      precision: 93
    },
    failureCases: [
      "Model confused sarcastic text as positive — partially addressed with negation handling in preprocessing",
      "Class imbalance (fewer neutral samples) causing bias — fixed with SMOTE oversampling on training set"
    ],
    stats: {
      latency: "12ms per text",
      evalScore: "92% F1",
      datasetSize: "50k tweets",
      costPerCall: "On-device"
    },
    category: "NLP"
  },
  {
    slug: "data-analytics-platform",
    name: "Data Analytics Platform",
    tagline: "Interactive EDA and visualization platform for structured datasets with automated insight generation",
    description: `An interactive data analytics platform that enables automated exploratory data analysis (EDA), statistical profiling, and visualization of structured datasets. Users upload CSV/Excel files and the platform auto-generates comprehensive reports: distribution plots, correlation heatmaps, missing value analysis, outlier detection, and statistical summaries.

Built with Streamlit for the interactive frontend, Pandas for data processing, and Matplotlib/Seaborn for visualization. The platform also includes an automated insight engine that highlights key findings (skewed distributions, high correlations, class imbalances) in plain English.

Designed to significantly speed up the EDA phase of any data science project — what typically takes hours of manual Jupyter notebook work is reduced to minutes of interactive exploration.`,
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Streamlit", "Scikit-learn"],
    demoVideo: "https://youtube.com/embed/dQw4w9WgXcQ",
    github: "https://github.com/onkarshinde77/data-analytics-platform",
    complexity: 1,
    highlights: [
      "Automated EDA report generation from CSV/Excel upload",
      "Distribution plots, correlation heatmaps, outlier detection",
      "Plain-English automated insight summaries",
      "Handles datasets up to 500k rows efficiently",
      "One-click export of full EDA report as HTML"
    ],
    architecture: "File Upload → Pandas DataFrame → Statistical Profiling → Automated Visualization Suite → Insight Engine → Interactive Dashboard",
    evalResults: {
      accuracy: 99,
      latency: "< 30s for 100k rows"
    },
    failureCases: [
      "Memory issues with very wide datasets (500+ columns) — fixed by lazy loading and column-by-column profiling",
      "Incorrect dtype inference for mixed-type columns — fixed by adding explicit type detection logic"
    ],
    stats: {
      latency: "< 30s",
      evalScore: "Fully automated",
      datasetSize: "Up to 500k rows",
      costPerCall: "Free"
    },
    category: "Data Analytics"
  },
  {
    slug: "civic-issue-reporting",
    name: "AI-Powered Civic Issue Reporter",
    tagline: "Image validation pipeline using YOLOv8 + Groq to auto-classify and route civic complaints",
    description: `An AI-powered civic issue reporting platform that validates submitted images using a multi-stage computer vision pipeline before accepting reports. The system prevents frivolous submissions (e.g., photos of people or pets) by running images through a Roboflow YOLOv8 object detector followed by Groq Llama 3 for intelligent civic-issue classification.

The backend is built with Node.js/Express using Multer for file handling and a local disk-based inference pipeline. The frontend provides a React-based report submission form with instant AI feedback. Validated reports are stored and routed to the appropriate municipal department.

This project was built to solve the real problem of false reports flooding civic complaint systems — the AI validation layer rejects non-civic images immediately, keeping the system clean and actionable.`,
    tech: ["Node.js", "Express", "React", "Roboflow YOLOv8", "Groq (LLaMA 3)", "Multer", "MongoDB"],
    demoVideo: "https://youtube.com/embed/dQw4w9WgXcQ",
    github: "https://github.com/onkarshinde77/civic-issue-reporter",
    complexity: 2,
    highlights: [
      "Two-stage validation: YOLOv8 object detection → Groq LLM classification",
      "Rejects non-civic images (humans, pets, plants) before submission",
      "Real-time AI feedback to user on image validity",
      "Multipart form data pipeline with Multer disk storage",
      "Full MERN stack with MongoDB report storage"
    ],
    architecture: "Image Upload → Multer Disk Storage → YOLOv8 Object Detection (Roboflow) → Groq LLaMA 3 Civic Classifier → Valid/Invalid Decision → Report Storage (MongoDB) / User Rejection",
    evalResults: {
      accuracy: 91,
      precision: 93,
      recall: 89
    },
    failureCases: [
      "YOLOv8 missed small potholes in dark images — addressed by adding brightness normalization in preprocessing",
      "Groq classifier occasionally accepted images of trees as 'fallen tree hazards' — fixed with stricter prompt engineering"
    ],
    stats: {
      latency: "2.1s per image",
      evalScore: "91% accuracy",
      datasetSize: "Custom civic dataset",
      costPerCall: "~$0.00 (Groq)"
    },
    category: "Computer Vision"
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}
