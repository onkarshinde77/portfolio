"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/site-config";

function SectionDivider() {
  return <div className="section-divider" style={{ margin: "0 auto 5rem" }} />;
}

function ModelCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="glass-card"
      style={{ padding: "2rem", height: "fit-content" }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          paddingBottom: "1rem",
          marginBottom: "1.5rem"
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-code)",
            fontSize: "10px",
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "6px"
          }}
        >
          model-card.json
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--accent-primary)"
          }}
        >
          {siteConfig.name}
        </div>
      </div>

      {/* Fields */}
      {[
        { key: "Architecture", value: "Agentic AI · Deep Learning · CV" },
        {
          key: "Training Data",
          value: `${siteConfig.college}`
        },
        {
          key: "Tasks",
          value: "Agentic AI · RAG · Computer Vision · NLP"
        },
        { key: "Languages", value: "Python · JavaScript · SQL" },
        { key: "GPA", value: `${siteConfig.gpa} / 10` },
        { key: "License", value: "Open to internships" }
      ].map(({ key, value }) => (
        <div
          key={key}
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: "0.5rem",
            marginBottom: "1rem",
            alignItems: "start"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "12px",
              color: "var(--text-muted)",
              paddingTop: "2px"
            }}
          >
            {key}:
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "var(--text-primary)",
              lineHeight: 1.5
            }}
          >
            {value}
          </span>
        </div>
      ))}

      {/* Status badge */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "0.75rem 1rem",
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span
          className="pulse-dot"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--accent-tertiary)",
            flexShrink: 0
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-code)",
            fontSize: "12px",
            color: "var(--accent-tertiary)"
          }}
        >
          Available for internships · Open now
        </span>
      </div>
    </motion.div>
  );
}

function TechTicker() {
  const doubled = [...siteConfig.techTicker, ...siteConfig.techTicker];

  return (
    <div
      className="ticker-wrapper"
      style={{
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid var(--border)"
      }}
    >
      <div className="ticker-track">
        {doubled.map((tech, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "var(--font-code)",
              fontSize: "12px",
              color: "var(--text-muted)",
              padding: "0 1.5rem",
              whiteSpace: "nowrap"
            }}
          >
            <span
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--accent-primary)",
                display: "inline-block",
                marginRight: "1.5rem",
                opacity: 0.5
              }}
            />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section
      id="about"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative"
      }}
    >
      <SectionDivider />

      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "12px",
          letterSpacing: "0.2em",
          color: "var(--accent-primary)",
          textTransform: "uppercase",
          marginBottom: "1rem"
        }}
      >
        // About
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "3rem",
          letterSpacing: "-0.02em"
        }}
      >
        Model Profile
      </motion.h2>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(300px, 380px) 1fr",
          gap: "3rem",
          alignItems: "start"
        }}
        className="about-grid"
      >
        <ModelCard />

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          {siteConfig.bio.map((paragraph, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.05rem",
                color: i === 0 ? "var(--text-primary)" : "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: "1.5rem"
              }}
            >
              {paragraph}
            </p>
          ))}

          <TechTicker />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
