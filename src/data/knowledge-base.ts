export interface KnowledgeChunk {
  id: string;
  content: string;
  category: string;
  metadata: Record<string, string>;
}

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: "profile-summary",
    category: "profile",
    content: `Onkar Shinde is an AI/ML developer based in Pune, India. He is a second-year B.E. student in Artificial Intelligence & Data Science at D Y Patil College of Engineering Akurdi, Pune (2023–2027), with a GPA of 8.34. He builds intelligent systems focused on agentic AI, computer vision, NLP, and RAG pipelines. His objective is to build scalable, real-world intelligent systems using deep learning, agentic AI, and computer vision.`,
    metadata: { type: "bio", source: "profile" }
  },
  {
    id: "contact-info",
    category: "contact",
    content: `Onkar's contact information: Email: onkarshinde.ai@gmail.com. Phone: 9309313545. GitHub: github.com/onkarshinde77. LinkedIn: linkedin.com/in/onkarshinde77. He is located in Pune, India. He is open to AI engineering internships, research collaborations, and open source projects.`,
    metadata: { type: "contact", source: "profile" }
  },
  {
    id: "education",
    category: "education",
    content: `Onkar Shinde is studying B.E. in Artificial Intelligence & Data Science at D Y Patil College of Engineering Akurdi, Pune. Duration: 2023 to 2027. Current GPA: 8.34. His coursework covers machine learning, deep learning, NLP, computer vision, data structures, and software engineering.`,
    metadata: { type: "education", source: "resume" }
  },
  {
    id: "leadership",
    category: "experience",
    content: `Onkar Shinde serves as Commander at the Competitive Programming & Mentorship Club at DY Patil College of Engineering. His responsibilities include: coordinating and leading competitive programming contests, hackathons, and workshops; mentoring junior students in data structures, algorithms, and problem solving; and building a peer-learning community focused on technical excellence.`,
    metadata: { type: "leadership", source: "resume" }
  },
  {
    id: "skills-ai",
    category: "skills",
    content: `Onkar's AI/ML skills include: Deep Learning (TensorFlow, Keras, PyTorch), Computer Vision (OpenCV, MobileNetV2, YOLOv8), Natural Language Processing (NLTK, Transformers, sentiment analysis, text classification), and Machine Learning (Scikit-learn, regression, classification, clustering). He has built production systems in all these areas.`,
    metadata: { type: "skills", source: "resume" }
  },
  {
    id: "skills-agentic",
    category: "skills",
    content: `Onkar's Agentic AI skills include: LangChain for LLM orchestration, LangGraph for multi-agent graph workflows with Supervisor/Worker/Reducer architecture, LangSmith for agent observability and tracing, Groq API with LLaMA 3 for fast inference, Tavily API for web search, and Streamlit for deploying AI apps. He built a full Blog Writing Agent using these tools.`,
    metadata: { type: "skills", source: "resume" }
  },
  {
    id: "skills-rag",
    category: "skills",
    content: `Onkar's RAG (Retrieval-Augmented Generation) skills include: FAISS vector store for document indexing, Pinecone serverless vector database, HuggingFace sentence-transformers for embedding generation, LangChain RAG pipelines, document chunking strategies, query rewriting, and source-cited answer generation. He built a complete RAG Document Q&A system.`,
    metadata: { type: "skills", source: "resume" }
  },
  {
    id: "skills-backend",
    category: "skills",
    content: `Onkar's backend and web development skills include: Python (primary language), Node.js and Express for REST APIs, Django and Flask web frameworks, FastAPI for ML model serving, MongoDB for NoSQL storage, SQL databases, Docker for containerization, and Multer for file uploads. He has deployed multiple full-stack applications.`,
    metadata: { type: "skills", source: "resume" }
  },
  {
    id: "skills-data",
    category: "skills",
    content: `Onkar's data science skills include: Pandas and NumPy for data manipulation, Matplotlib and Seaborn for visualization, Scikit-learn for classical ML, Streamlit for interactive dashboards, and automated EDA pipeline development. He built a full Data Analytics Platform with automated insight generation.`,
    metadata: { type: "skills", source: "resume" }
  },
  {
    id: "project-blog-agent",
    category: "projects",
    content: `Blog Writing Agent System: Onkar's flagship project — an autonomous multi-agent blog writing system using LangGraph with a Supervisor → Router → Orchestrator → Worker → Reducer agent hierarchy. Uses Groq (LLaMA 3) for fast inference and Tavily API for real-time web research. Deployed as a Streamlit app with LangGraph checkpoint-based session history. Full observability via LangSmith. Reduces blog writing time to under 5 minutes. GitHub: github.com/onkarshinde77/blog-writing-agent`,
    metadata: { type: "project", source: "resume", slug: "blog-writing-agent" }
  },
  {
    id: "project-rag-qna",
    category: "projects",
    content: `RAG Document Q&A System: A retrieval-augmented generation pipeline for intelligent document question answering. Users upload PDF documents which are chunked, embedded with HuggingFace sentence-transformers, and stored in FAISS. Groq LLaMA 3 generates grounded answers with source citations. Achieves 87% faithfulness score. GitHub: github.com/onkarshinde77/rag-document-qna`,
    metadata: { type: "project", source: "resume", slug: "rag-document-qna" }
  },
  {
    id: "project-face-mask",
    category: "projects",
    content: `Face Mask Detection System: A real-time face mask detection system achieving 98% accuracy on 7,000 images. Uses MobileNetV2 (transfer learning on ImageNet) for classification and OpenCV DNN face detector for localization. Runs at 25 FPS on CPU. Built with TensorFlow/Keras. GitHub: github.com/onkarshinde77/face-mask-detection`,
    metadata: { type: "project", source: "resume", slug: "face-mask-detection" }
  },
  {
    id: "project-sentiment",
    category: "projects",
    content: `NLP Sentiment Analysis Pipeline: Multi-class sentiment classifier (Positive/Negative/Neutral) achieving 92% macro-F1 on Twitter data. Uses BiLSTM model with TF-IDF and sentence embeddings. Benchmarked against Naïve Bayes, Logistic Regression, and SVM baselines. Custom text cleaning pipeline for social media noise. GitHub: github.com/onkarshinde77/sentiment-analysis`,
    metadata: { type: "project", source: "resume", slug: "sentiment-analysis-nlp" }
  },
  {
    id: "project-analytics",
    category: "projects",
    content: `Data Analytics Platform: An interactive EDA and visualization platform for structured datasets. Auto-generates distribution plots, correlation heatmaps, outlier detection, and plain-English insight summaries from CSV/Excel uploads. Built with Streamlit, Pandas, Matplotlib, and Seaborn. Handles datasets up to 500k rows. GitHub: github.com/onkarshinde77/data-analytics-platform`,
    metadata: { type: "project", source: "resume", slug: "data-analytics-platform" }
  },
  {
    id: "project-civic",
    category: "projects",
    content: `AI-Powered Civic Issue Reporter: A full-stack civic complaint platform with AI image validation. Uses Roboflow YOLOv8 for object detection and Groq LLaMA 3 for civic-issue classification to reject invalid images (humans, pets) before submission. Built with MERN stack (MongoDB, Express, React, Node.js) and Multer for file handling. 91% validation accuracy. GitHub: github.com/onkarshinde77/civic-issue-reporter`,
    metadata: { type: "project", source: "resume", slug: "civic-issue-reporting" }
  },
  {
    id: "tech-stack",
    category: "skills",
    content: `Onkar Shinde's complete tech stack: Languages: Python, JavaScript, Node.js, SQL. AI/ML Frameworks: TensorFlow, Keras, PyTorch, Scikit-learn, OpenCV, HuggingFace Transformers. Agentic AI: LangChain, LangGraph, LangSmith, Groq API, Tavily API. Vector Databases: FAISS, Pinecone. Web: Django, Flask, FastAPI, Express, React, Streamlit. Databases: MongoDB, SQL. Tools: Docker, Git, Multer.`,
    metadata: { type: "tech-stack", source: "resume" }
  },
  {
    id: "resume-download",
    category: "resume",
    content: `Onkar Shinde's resume is available for download at /resume.pdf. He is a B.E. AI & Data Science student at DY Patil College of Engineering Akurdi, Pune (2023-2027), GPA 8.34. Available for AI engineering internships and research collaborations.`,
    metadata: { type: "resume", source: "profile" }
  }
];
