# PERSONAL INFORMATION

## Basic Details
Name: Onkar Shinde
Role: AI Engineer
Location: Akurdi, Pune, Maharashtra, India
Email: onkarshinde.ai@gmail.com
Phone: +91 9309313545

## About Me
I am an AI/ML developer based in Pune, India. I build scalable, real-world intelligent systems focused on agentic AI, computer vision, NLP, and RAG pipelines. I am passionate about building futuristic web experiences and am open to AI engineering internships, research collaborations, and open source projects.

---

# EDUCATION

## College Information
College Name: D Y Patil College of Engineering Akurdi, Pune
University: Savitribai Phule Pune University (SPPU)
Degree: B.E. Artificial Intelligence and Data Science
Current Year: Forth Year(7th SEM) (2023-2027)
CGPA: 8
---

# SKILLS

## Programming Languages
- Java
- Python
- SQL
- HTML
- CSS
- Tailwind CSS
- Linux Command Line

## AI/ML Skills
- Machine Learning: Scikit-learn, Regression, Classification, Clustering, Model Evaluation
- Deep Learning: TensorFlow, Keras, PyTorch, CNN, RNN, LSTM, MobileNetV2
- Agentic AI: LangChain, LangGraph, LangSmith, Groq API (LLaMA 3), Tavily API, Multi-Agent Workflows
- Generative AI & RAG: FAISS, Pinecone, HuggingFace Transformers, Document Q&A Pipelines
- NLP: NLTK, Transformers, Text Classification, Sentiment Analysis
- Computer Vision: OpenCV, YOLOv8, Object Detection, Image Processing
- Database Management: SQL, MySQL, MongoDB, Pinecone, FAISS

## Frameworks & Libraries
- TensorFlow & Keras
- PyTorch
- Scikit-learn
- OpenCV
- Pandas & NumPy
- Matplotlib & Seaborn
- Flask & FastAPI
- Django

## Tools
- Git & GitHub
- Docker
- VS Code
- Vercel
- Streamlit

---

# PROJECTS

## Total Projects
7

---

## Project 1

### Project Name
AI Blog Writing Agent

### Description
An autonomous, multi-agent blog writing pipeline that takes a single topic as input and produces a fully-written, research-backed blog post — automatically. Built with LangGraph, Groq (LLaMA 3), and Tavily Search API. The system uses a graph-based multi-agent workflow where specialized agents (Router, Orchestrator, Worker, Reducer) collaborate. Includes SQLite-backed LangGraph checkpointing for persistent history and LangSmith tracing for full observability.

### Technologies Used
- LangGraph & LangChain
- LangSmith
- Groq (LLaMA 3)
- Tavily API
- Streamlit
- Pydantic v2
- SQLite
- Python

### Features
- Intelligent routing to detect if live web research is needed
- Parallel section writing via LangGraph fan-out pattern
- Full LangSmith observability and trace tracking
- SQLite-backed persistent checkpoint history
- One-click Markdown download of any generated blog
- ChatGPT-style sidebar with all past blog sessions
- Structured blog planning by Orchestrator

### Status
Completed

### GitHub Link
https://github.com/onkarshinde77/blog-writing-agent

---

## Project 2

### Project Name
Face Mask Detection System

### Description
A comprehensive Face Mask Detection System that uses deep learning models to detect whether people are wearing masks. Processes static images, video files, and live webcam feeds in real time. The pipeline uses a Caffe DNN SSD model for 98% face detection and a fine-tuned VGG16 model achieving 95% mask classification accuracy. Deployed as a Flask web application with a modern, responsive UI. The custom dataset of 9,525 images was published on Kaggle.

### Technologies Used
- TensorFlow / Keras
- VGG16
- OpenCV
- Caffe DNN SSD
- Flask
- Python
- NumPy

### Features
- Two-stage pipeline: face detector → mask classifier
- Real-time webcam stream via MJPEG with live bounding box overlays
- Background video processing with progress tracking
- Dataset of 9,525 images published on Kaggle
- Color-coded bounding boxes: green (mask) / red (no mask)

### Status
Completed

### GitHub Link
https://github.com/onkarshinde77/face_mask_detector

---

## Project 3

### Project Name
Collision Detection Robot

### Description
An autonomous collision detection and avoidance robot built from scratch using Arduino Uno, ultrasonic sensors, and a dual-channel motor driver. The robot continuously scans its surroundings and intelligently navigates around obstacles in real time without any human intervention using an HC-SR04 ultrasonic sensor. It features a dual-channel L298N motor driver controlling 4 gear motors. Exhibited at Cummins & PICT College of Engineering.

### Technologies Used
- Arduino Uno
- C/C++
- HC-SR04 Ultrasonic Sensor
- L298N Motor Driver
- Li-ion Battery
- Gear Motors & LEDs & Buzzer

### Features
- Real-time obstacle detection within 20 cm
- Autonomous reverse-and-turn avoidance maneuver
- Dual-channel L298N motor driver for independent motor control
- Buzzer + LED alert system for collision warning
- Fully wireless and portable

### Status
Completed

### GitHub Link
https://github.com/onkarshinde77

---

## Project 4

### Project Name
RAG Document Q&A System

### Description
A retrieval-augmented generation pipeline for intelligent document question answering. Users upload PDF documents which are chunked, embedded with HuggingFace sentence-transformers, and stored in FAISS. Groq LLaMA 3 generates grounded answers with source citations. Achieves 87% faithfulness score.

### Technologies Used
- HuggingFace Sentence-Transformers
- FAISS
- Groq (LLaMA 3)
- Python
- LangChain

### Features
- PDF upload and chunking
- Grounded answers with source citations
- 87% faithfulness score

### Status
Completed

### GitHub Link
https://github.com/onkarshinde77/rag-document-qna

---

## Project 5

### Project Name
NLP Sentiment Analysis Pipeline

### Description
Multi-class sentiment classifier (Positive/Negative/Neutral) achieving 92% macro-F1 on Twitter data. Uses BiLSTM model with TF-IDF and sentence embeddings. Benchmarked against Naïve Bayes, Logistic Regression, and SVM baselines. Custom text cleaning pipeline for social media noise.

### Technologies Used
- BiLSTM
- TF-IDF
- Sentence Embeddings
- Python

### Features
- Multi-class sentiment classifier
- Custom text cleaning for social media noise
- 92% macro-F1 on Twitter data

### Status
Completed

### GitHub Link
https://github.com/onkarshinde77/sentiment-analysis

---

## Project 6

### Project Name
Data Analytics Platform

### Description
An interactive EDA and visualization platform for structured datasets. Auto-generates distribution plots, correlation heatmaps, outlier detection, and plain-English insight summaries from CSV/Excel uploads. Built with Streamlit, Pandas, Matplotlib, and Seaborn. Handles datasets up to 500k rows.

### Technologies Used
- Streamlit
- Pandas
- Matplotlib
- Seaborn

### Features
- Automated EDA and visualization
- Auto-generates distribution plots and correlation heatmaps
- Outlier detection and insight summaries
- Handles datasets up to 500k rows

### Status
Completed

### GitHub Link
https://github.com/onkarshinde77/data-analytics-platform

---

## Project 7

### Project Name
AI-Powered Civic Issue Reporter

### Description
A full-stack civic complaint platform with AI image validation. Uses Roboflow YOLOv8 for object detection and Groq LLaMA 3 for civic-issue classification to reject invalid images (humans, pets) before submission. Built with MERN stack (MongoDB, Express, React, Node.js) and Multer for file handling. 91% validation accuracy.

### Technologies Used
- Roboflow YOLOv8
- Groq (LLaMA 3)
- MERN Stack (MongoDB, Express, React, Node.js)
- Multer

### Features
- AI image validation to reject invalid images
- Civic-issue classification
- 91% validation accuracy

### Status
Completed

### GitHub Link
https://github.com/onkarshinde77/civic-issue-reporter

---

# RESEARCH INTERESTS

- Recommendation Systems
- Computer Vision
- Generative AI
- AI Agents
- Robotics Automation

---

# ACHIEVEMENTS
- Commander at the Competitive Programming & Mentorship Club at DY Patil College of Engineering, leading contests, hackathons, and mentoring junior students
- Participated in Nirmaan 4.0 - Nexus of Evolution Hackathon 2026 (CODE TITANS category) by GDG On Campus MITAOE
- Organising Team Member for the DSA Bootcamp (Jan 2025) by CPMC & AlgoElite, DYPCOE
- Participated in INNOVATION 2025 at MKSSS's Cummins College of Engineering for Women
- Active participation in "DataVerse Horizon: Explore, Experiment, Excel" by S4DS DYPCOE
- Active participation in Expert Session on AI Ethics by ITESA
- Built multiple AI projects and developed real-time intelligent systems
---

# SOCIAL MEDIA

## LinkedIn
https://linkedin.com/in/onkarshinde77

## GitHub
https://github.com/onkarshinde77

## Twitter
https://x.com/onkarshinde77

---

# CERTIFICATIONS

## Certification 1
Name: Fundamentals of Deep Learning
Platform: NVIDIA
Date: February 2025
Description: Awarded for demonstrating competence and practical knowledge in the completion of Fundamentals of Deep Learning.

## Certification 2
Name: SQL (Intermediate)
Platform: HackerRank
Date: October 2025
ID: CB4429932844
Description: Passed the HackerRank skill certification test for SQL (Intermediate), demonstrating proficiency in writing complex queries and managing database operations.

## Certification 3
Name: Alpha (DSA with Java)
Platform: Apna College
ID: 66ddb6f8152f272b3105e948
Description: Successfully completed a comprehensive course on Data Structures and Algorithms with Java, building strong foundational problem-solving skills.

## Certification 4
Name: Breaking into Tech: Navigating AI Development and DSA
Platform: CPMC x IASC, DYPCOE
Description: Participated in an insightful expert-led session exploring the intersection of AI development, competitive programming, and Data Structures & Algorithms.

## Certification 5
Name: Nirmaan 4.0 - Nexus of Evolution Hackathon 2026
Platform: GDG On Campus MITAOE
Description: Actively participated in the CODE TITANS category as a member of "Synapse Squad", demonstrating technical problem-solving and rapid prototyping skills under Google Developer Groups.

## Certification 6
Name: Organising Team Member for the DSA Bootcamp
Platform: CPMC & AlgoElite, DYPCOE
Date: January 17-19, 2025
Description: Recognized for invaluable contributions, leadership, and exceptional efforts in organizing a 3-day rigorous DSA bootcamp for engineering students.

## Certification 7
Name: INNOVATION 2025
Platform: MKSSS's Cummins College of Engineering for Women
Date: April 3-5, 2025
Description: Successfully participated in the technical event, showcasing dedication to technological advancements and innovation.

## Certification 8
Name: DataVerse Horizon: Explore, Experiment, Excel
Platform: S4DS DYPCOE
Date: September 24, 2024
Description: Recognized for active participation and demonstrating commitment to innovation and collaboration in AI and Data Science.

## Certification 9
Name: Expert Session on AI Ethics
Platform: ITESA
Description: Attended and actively participated in a specialized session focusing on the ethical considerations, fairness, and responsible deployment of Artificial Intelligence.

---

# FUTURE GOALS

- Become an AI/ML expert
- Build scalable AI products
- Create AI startup
- Research advanced recommendation systems

---

# FAQ KNOWLEDGE

Q: What does Onkar specialize in?
A: AI, ML, Recommendation Systems, and Computer Vision.

Q: Which programming languages does Onkar know?
A: Python, C++, JavaScript, and SQL.

Q: What is Onkar’s strongest domain?
A: Artificial Intelligence and Machine Learning.