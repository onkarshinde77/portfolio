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
  architectureDiagram?: string;
  evalResults: EvalResults;
  failureCases: string[];
  whatILearned?: string[];
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
    name: "AI Blog Writing Agent",
    tagline: "Autonomous multi-agent system that researches the web and writes comprehensive, structured blog posts — powered by LangGraph, Groq (LLaMA 3), and Tavily Search",
    description: `An autonomous, multi-agent blog writing pipeline that takes a single topic as input and produces a fully-written, research-backed blog post — automatically. Unlike a simple prompt-to-text setup, this system uses a graph-based multi-agent workflow powered by LangGraph where specialized agents collaborate.

The Router agent decides whether the topic needs live web research via Tavily Search API or can be answered from LLM knowledge. The Orchestrator plans the complete blog structure — title, sections, tone, target audience, and word-count targets. Multiple Worker agents then write each section simultaneously using LangGraph's fan-out pattern, and a Reducer stitches them into a final polished post.

The result is a production-quality blog post with a one-click Markdown download option. All past blogs are instantly accessible in a ChatGPT-style sidebar history — every generation is stored independently via SQLite-backed LangGraph checkpointing so there's no context bleed between posts. The entire pipeline is fully observable with LangSmith tracing.`,
    tech: ["LangGraph", "LangChain", "LangSmith", "Groq (LLaMA 3)", "Tavily API", "Streamlit", "Pydantic v2", "SQLite", "Python"],
    demoVideo: "https://youtube.com/embed/dQw4w9WgXcQ",
    github: "https://github.com/onkarshinde77/blog-writing-agent",
    complexity: 3,
    highlights: [
      "Intelligent routing — auto-detects if the topic needs live web research",
      "Parallel section writing via LangGraph fan-out (Send) pattern",
      "Full LangSmith observability — every agent step traced end-to-end",
      "SQLite-backed persistent checkpoint history (survives server restarts)",
      "One-click Markdown download of any generated blog",
      "ChatGPT-style sidebar with all past blog sessions",
      "Structured blog planning by Orchestrator (title, sections, word targets)",
      "Ultra-fast inference via Groq (LLaMA 3.1-8b)"
    ],
    architectureDiagram: `START
  │
  ▼
┌─────────┐
│  Router │  ← Decides: research needed? (yes/no)
└─────────┘
  │         \\
  ▼           ▼ (if no research needed)
┌──────────┐   │
│ Research │   │  ← Tavily real-time web search
└──────────┘   │
  │             │
  └──────┬──────┘
         ▼
  ┌─────────────┐
  │ Orchestrator│  ← Plans blog sections
  └─────────────┘
         │
    (fan-out to N parallel workers)
         │
  ┌──────┴──────┐
  ▼   ▼   ▼   ▼
[W1][W2][W3][W4]   ← Workers (each writes one section)
  └──────┬──────┘
         ▼
  ┌─────────┐
  │ Reducer │  ← Merges all sections into final blog
  └─────────┘
         │
        END`,
    architecture: "User Prompt → Router Agent → [Research Node (Tavily)] → Orchestrator Agent (Blog Plan) → Parallel Worker Agents [W1..Wn] (fan-out) → Reducer Agent → Final Blog Post → LangSmith Trace → SQLite Checkpoint",
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
    whatILearned: [
      "Workflow of Agentic AI — moving beyond linear prompts into robust, stateful node-based pipelines",
      "Building agents with LangGraph — defining nodes, edges, state schemas, and conditional routing in a StateGraph",
      "Parallel Execution / Fan-out Pattern — using Send to dynamically dispatch work to parallel worker agents simultaneously",
      "Orchestrator Pattern — having a manager agent plan execution and dynamically generate steps for worker agents",
      "Tool Calling (Tavily) — connecting LLMs to live external APIs to retrieve context dynamically",
      "LangGraph Checkpointing — preserving full persistent history into SQLite, allowing users to scroll through past blogs",
      "LangSmith Tracing — implementing full LLM observability to study rate limits, execution speeds, and inner-thought prompts",
      "Advanced Prompt Engineering — crafting precise system prompts that yield structured, reliable programmatic output using Pydantic schemas"
    ],
    stats: {
      latency: "< 5 min",
      evalScore: "93% relevancy",
      datasetSize: "Web-scale",
      costPerCall: "~$0.00 (Groq)"
    },
    category: "Agents & Tools",
    isResearch: false
  },
  {
    slug: "face-mask-detection",
    name: "Face Mask Detection System",
    tagline: "AI-powered real-time face mask detection using deep learning — 98% face detection + 95% mask classification accuracy",
    description: `A comprehensive Face Mask Detection System that uses state-of-the-art deep learning models to detect whether people are wearing masks. The system processes static images, video files, and live webcam feeds in real time.

The pipeline uses a two-stage approach: first, a Caffe DNN Single Shot MultiBox Detector (SSD) model detects all faces in the frame with 98%+ accuracy. Each detected face ROI is then cropped, preprocessed to 224×224 pixels, and classified as Mask / No Mask by a fine-tuned VGG16 model achieving 95%+ accuracy.

The system is deployed as a Flask web application with a modern, responsive UI supporting photo upload, camera capture, video upload with background processing, and a live MJPEG webcam stream. The dataset (9,525 images) was published on Kaggle by the author and used for training, testing, and validation. Color-coded bounding boxes (green = mask, red = no mask) annotate the output in real time.`,
    tech: ["TensorFlow", "Keras", "VGG16", "OpenCV", "Caffe DNN SSD", "Flask", "Python", "NumPy"],
    demoVideo: "https://youtube.com/embed/dQw4w9WgXcQ",
    github: "https://github.com/onkarshinde77/face_mask_detector",
    complexity: 2,
    highlights: [
      "Two-stage pipeline: Caffe DNN SSD face detector → VGG16 mask classifier",
      "98% face detection accuracy + 95% mask classification accuracy",
      "Real-time webcam stream via MJPEG with live bounding box overlays",
      "Dataset of 9,525 images published on Kaggle by the author",
      "Transfer learning: VGG16 pretrained on ImageNet, fine-tuned on custom dataset",
      "Flask web app with photo upload, camera capture, and video processing",
      "Background video processing with progress tracking",
      "Color-coded bounding boxes: green (mask) / red (no mask)"
    ],
    architectureDiagram: `Input (Image / Video / Webcam)
        ↓
Face Detection (Caffe DNN SSD — 300×300)
        ↓
Face Cropping & Preprocessing (224×224, VGG16 normalize)
        ↓
Batch Prediction (VGG16 — Binary Sigmoid)
        ↓
Post-processing & Annotation (bounding boxes, labels)
        ↓
Output (Annotated Image / Video / Stream)`,
    architecture: "Input (Image/Video/Webcam) → Caffe DNN SSD Face Detector → Face ROI Crop → VGG16 Preprocessing (224×224) → VGG16 Binary Classifier → Mask/No-Mask + Confidence → Real-time Annotated Output",
    evalResults: {
      accuracy: 95,
      precision: 94,
      recall: 96,
      latency: "~50ms per image (CPU)"
    },
    failureCases: [
      "Low accuracy on partially occluded faces — mitigated with aggressive augmentation including random occlusion patches during training",
      "False positives for face-like objects (e.g. posters) — fixed by raising the face detection confidence threshold to 0.7",
      "Camera shows black screen in browser — resolved by ensuring the app is accessed via localhost (not 127.0.0.1) and checking browser camera permissions"
    ],
    whatILearned: [
      "Transfer Learning — fine-tuning a pre-trained VGG16 model on a custom binary classification dataset",
      "Two-stage detection pipeline — combining a Caffe DNN SSD detector with a CNN classifier",
      "Data Collection & Annotation — building and publishing a 9,525-image dataset on Kaggle",
      "Real-time video processing — MJPEG streaming with OpenCV frame-by-frame inference",
      "Flask backend architecture — request handling, file upload management, background processing",
      "Data Augmentation — rotation, zoom, flip, brightness adjustment for diverse condition robustness",
      "Model Evaluation — precision, recall, F1, confusion matrix analysis across demographic groups"
    ],
    stats: {
      latency: "~50ms/image",
      evalScore: "95% accuracy",
      datasetSize: "9,525 images",
      costPerCall: "On-device"
    },
    category: "Computer Vision"
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}
