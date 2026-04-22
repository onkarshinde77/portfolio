"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Database,
  Eye,
  Bot,
  BarChart3,
  Code
} from "lucide-react";

interface SkillCategory {
  icon: React.ReactNode;
  category: string;
  skills: string[];
  proficiency: number;
}

const skillCategories: SkillCategory[] = [
  {
    icon: <Bot size={24} />,
    category: "Agentic AI",
    skills: ["LangGraph", "LangChain", "LangSmith", "Groq LLaMA 3", "Tavily API", "Multi-Agent"],
    proficiency: 92
  },
  {
    icon: <Database size={24} />,
    category: "RAG Systems",
    skills: ["FAISS", "Pinecone", "HuggingFace", "Document QnA", "Semantic Search", "Chunking"],
    proficiency: 88
  },
  {
    icon: <Brain size={24} />,
    category: "Deep Learning",
    skills: ["TensorFlow", "Keras", "PyTorch", "MobileNetV2", "BiLSTM", "Transfer Learning"],
    proficiency: 87
  },
  {
    icon: <Eye size={24} />,
    category: "Computer Vision",
    skills: ["OpenCV", "YOLOv8", "Roboflow", "Object Detection", "Image Classification", "Real-time CV"],
    proficiency: 85
  },
  {
    icon: <Code size={24} />,
    category: "NLP",
    skills: ["NLTK", "Transformers", "Sentiment Analysis", "TF-IDF", "Text Classification", "Scikit-learn"],
    proficiency: 84
  },
  {
    icon: <BarChart3 size={24} />,
    category: "Data & Backend",
    skills: ["Pandas", "NumPy", "Streamlit", "FastAPI", "Django", "Docker"],
    proficiency: 86
  }
];

function CapabilityCard({
  icon,
  category,
  skills,
  proficiency,
  index
}: SkillCategory & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-card"
      style={{
        padding: "1.75rem",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "default"
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 0 40px rgba(0,212,255,0.15), 0 20px 40px rgba(0,0,0,0.4)"
      }}
    >
      {/* Background gradient decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "120px",
          height: "120px",
          opacity: 0.3,
          background:
            "radial-gradient(ellipse at top right, rgba(0,212,255,0.06) 0%, transparent 70%)"
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "10px",
          background: "rgba(0,212,255,0.08)",
          border: "1px solid rgba(0,212,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-primary)",
          marginBottom: "1.25rem"
        }}
      >
        {icon}
      </div>

      {/* Category name */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "1rem"
        }}
      >
        {category}
      </h3>

      {/* Skill tags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginBottom: "1.5rem"
        }}
      >
        {skills.map(skill => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>

      {/* Proficiency indicator */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "10px",
              color: "var(--text-muted)",
              letterSpacing: "0.1em"
            }}
          >
            PROFICIENCY
          </span>
          <span
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "11px",
              color: "var(--accent-primary)",
              fontWeight: 600
            }}
          >
            {proficiency}/100
          </span>
        </div>
        <div
          style={{
            height: "3px",
            background: "rgba(0,212,255,0.1)",
            borderRadius: "2px",
            overflow: "hidden"
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${proficiency}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 + index * 0.08 }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
              borderRadius: "2px",
              boxShadow: "0 0 8px var(--accent-primary)"
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <section
      id="skills"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative"
      }}
    >
      <div className="section-divider" style={{ marginBottom: "5rem" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "3rem" }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "12px",
            letterSpacing: "0.2em",
            color: "var(--accent-primary)",
            textTransform: "uppercase",
            marginBottom: "1rem"
          }}
        >
          // Capabilities
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em"
          }}
        >
          Skill Matrix
        </h2>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.25rem"
        }}
        className="skills-grid"
      >
        {skillCategories.map((cat, i) => (
          <CapabilityCard key={cat.category} {...cat} index={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
