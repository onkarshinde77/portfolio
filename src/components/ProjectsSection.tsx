"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, ExternalLink, Play, Star, Zap } from "lucide-react";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";

function ComplexityBar({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span
        style={{
          fontFamily: "var(--font-code)",
          fontSize: "10px",
          color: "var(--text-muted)",
          letterSpacing: "0.1em"
        }}
      >
        COMPLEXITY:
      </span>
      <div style={{ display: "flex", gap: "3px" }}>
        {[1, 2, 3].map(n => (
          <div
            key={n}
            style={{
              width: "16px",
              height: "4px",
              borderRadius: "2px",
              background:
                n <= level
                  ? n === 3
                    ? "var(--accent-secondary)"
                    : "var(--accent-primary)"
                  : "rgba(0,212,255,0.12)"
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-code)",
          fontSize: "10px",
          color: level === 3 ? "var(--accent-secondary)" : "var(--accent-primary)",
          letterSpacing: "0.1em"
        }}
      >
        {level === 1 ? "STANDARD" : level === 2 ? "ADVANCED" : "EXPERT"}
      </span>
    </div>
  );
}

function VideoModal({
  url,
  onClose
}: {
  url: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.9)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "900px",
            aspectRatio: "16/9",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid var(--border)"
          }}
        >
          <iframe
            src={url}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectCard({
  project,
  tall = false
}: {
  project: Project;
  tall?: boolean;
}) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      {videoOpen && (
        <VideoModal
          url={project.demoVideo}
          onClose={() => setVideoOpen(false)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="glass-card circuit-bg"
        style={{
          padding: "1.75rem",
          position: "relative",
          overflow: "hidden",
          minHeight: tall ? "420px" : "320px",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease"
        }}
        whileHover={{
          y: -6,
          boxShadow: "0 0 50px rgba(0,212,255,0.15), 0 30px 60px rgba(0,0,0,0.5)"
        }}
      >
        {/* Research badge */}
        {project.isResearch && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.4)",
              borderRadius: "20px",
              padding: "3px 10px",
              fontFamily: "var(--font-code)",
              fontSize: "10px",
              color: "rgb(167,139,250)",
              letterSpacing: "0.05em"
            }}
          >
            <Star size={10} />
            Original Research
          </div>
        )}

        {/* Category */}
        <div
          style={{
            fontFamily: "var(--font-code)",
            fontSize: "10px",
            color: "var(--accent-secondary)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "0.75rem"
          }}
        >
          {project.category}
        </div>

        {/* Project name */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
            lineHeight: 1.3
          }}
        >
          {project.name}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: "1.25rem",
            flex: tall ? 1 : 0
          }}
        >
          {project.tagline}
        </p>

        {/* Highlights (only on tall cards) */}
        {tall && (
          <ul style={{ marginBottom: "1.25rem", paddingLeft: 0, listStyle: "none" }}>
            {project.highlights.slice(0, 3).map(h => (
              <li
                key={h}
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px"
                }}
              >
                <Zap
                  size={10}
                  style={{
                    color: "var(--accent-primary)",
                    marginTop: "3px",
                    flexShrink: 0
                  }}
                />
                {h}
              </li>
            ))}
          </ul>
        )}

        {/* Tech stack */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            marginBottom: "1.5rem"
          }}
        >
          {project.tech.map(t => (
            <span key={t} className="tech-badge">
              {t}
            </span>
          ))}
        </div>

        {/* Complexity */}
        <div style={{ marginBottom: "1.25rem" }}>
          <ComplexityBar level={project.complexity} />
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginTop: "auto"
          }}
        >
          <button
            onClick={() => setVideoOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 14px",
              borderRadius: "6px",
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.25)",
              color: "var(--accent-primary)",
              fontFamily: "var(--font-code)",
              fontSize: "11px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,212,255,0.18)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,212,255,0.1)";
            }}
          >
            <Play size={11} /> Demo
          </button>

          <Link
            href={`/projects/${project.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 14px",
              borderRadius: "6px",
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.2)",
              color: "rgb(167,139,250)",
              fontFamily: "var(--font-code)",
              fontSize: "11px",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,58,237,0.15)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(124,58,237,0.08)";
            }}
          >
            <ExternalLink size={11} /> Details
          </Link>

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "7px 12px",
              borderRadius: "6px",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-code)",
              fontSize: "11px",
              textDecoration: "none",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "var(--text-primary)";
              el.style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.color = "var(--text-muted)";
              el.style.borderColor = "var(--border)";
            }}
          >
            <Code2 size={13} />
          </a>
        </div>
      </motion.div>
    </>
  );
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1100px",
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
          // Work
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
          Projects
        </h2>
      </motion.div>

      {/* 2-column featured layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.5rem"
        }}
        className="projects-grid"
      >
        {projects.map(project => (
          <ProjectCard key={project.slug} project={project} tall />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .projects-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
