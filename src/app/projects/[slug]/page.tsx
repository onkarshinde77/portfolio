"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Code2, Play, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getProjectBySlug, type Project, type EvalResults } from "@/data/projects";

const FaceMaskDemo = dynamic(
  () => import("@/components/FaceMaskDemo").then(mod => mod.FaceMaskDemo),
  { ssr: false }
);

function getScoreColor(score: number): string {
  if (score >= 85) return "var(--accent-tertiary)";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
}

function EvalTable({ results }: { results: EvalResults }) {
  const entries = Object.entries(results).filter(
    ([, v]) => typeof v === "number"
  ) as [string, number][];
  const latency = results.latency;

  return (
    <div
      style={{
        overflowX: "auto",
        borderRadius: "8px",
        border: "1px solid var(--border)"
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(0,212,255,0.04)" }}>
            {["Metric", "Score", "Status"].map(h => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  fontFamily: "var(--font-code)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  borderBottom: "1px solid var(--border)"
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map(([metric, score]) => (
            <tr
              key={metric}
              style={{ borderBottom: "1px solid rgba(0,212,255,0.05)" }}
            >
              <td
                style={{
                  padding: "0.7rem 1rem",
                  fontFamily: "var(--font-code)",
                  fontSize: "13px",
                  color: "var(--text-primary)",
                  textTransform: "capitalize"
                }}
              >
                {metric}
              </td>
              <td
                style={{
                  padding: "0.7rem 1rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: getScoreColor(score)
                }}
              >
                {score}%
              </td>
              <td style={{ padding: "0.7rem 1rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-code)",
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "3px",
                    background:
                      score >= 85
                        ? "rgba(16,185,129,0.1)"
                        : score >= 70
                        ? "rgba(245,158,11,0.1)"
                        : "rgba(239,68,68,0.1)",
                    color: getScoreColor(score),
                    border: `1px solid ${getScoreColor(score)}44`
                  }}
                >
                  {score >= 85 ? "STRONG" : score >= 70 ? "ACCEPTABLE" : "NEEDS WORK"}
                </span>
              </td>
            </tr>
          ))}
          {latency && (
            <tr>
              <td
                style={{
                  padding: "0.7rem 1rem",
                  fontFamily: "var(--font-code)",
                  fontSize: "13px",
                  color: "var(--text-primary)"
                }}
              >
                Latency
              </td>
              <td
                style={{
                  padding: "0.7rem 1rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--accent-primary)"
                }}
              >
                {latency}
              </td>
              <td style={{ padding: "0.7rem 1rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-code)",
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "3px",
                    background: "rgba(0,212,255,0.08)",
                    color: "var(--accent-primary)",
                    border: "1px solid rgba(0,212,255,0.2)"
                  }}
                >
                  MEASURED
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function FailureGallery({ failures }: { failures: string[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="glass-card"
      style={{ overflow: "hidden" }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.05em"
          }}
        >
          Failure Analysis & Fixes
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                padding: "0 1.5rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              {failures.map((f, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(239,68,68,0.05)",
                    borderLeft: "3px solid rgba(239,68,68,0.4)",
                    borderRadius: "0 6px 6px 0",
                    padding: "0.75rem 1rem",
                    fontFamily: "var(--font-code)",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    lineHeight: 1.6
                  }}
                >
                  <span style={{ color: "#ef4444", marginRight: "8px" }}>
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug) ?? null;
  const [videoOpen, setVideoOpen] = useState(false);

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontFamily: "var(--font-code)"
        }}
      >
        Project not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingTop: "80px"
      }}
    >
      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        {/* Back button */}
        <Link
          href="/#projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-code)",
            fontSize: "12px",
            color: "var(--text-muted)",
            textDecoration: "none",
            marginBottom: "2.5rem",
            transition: "color 0.2s ease"
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-primary)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
          }}
        >
          <ArrowLeft size={14} />
          Back to portfolio
        </Link>

        {/* Hero */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "11px",
              color: "var(--accent-secondary)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "0.75rem"
            }}
          >
            {project.category}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
              lineHeight: 1.15
            }}
          >
            {project.name}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.1rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: "600px"
            }}
          >
            {project.tagline}
          </p>
        </div>

        {/* Quick stats bar */}
        <div
          className="glass-card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
            padding: "1.25rem",
            marginBottom: "2.5rem",
            textAlign: "center"
          }}
        >
          {[
            { label: "Latency", value: project.stats.latency ?? "—" },
            { label: "Eval Score", value: project.stats.evalScore ?? "—" },
            { label: "Dataset Size", value: project.stats.datasetSize ?? "—" },
            { label: "Cost/call", value: project.stats.costPerCall ?? "—" }
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  marginBottom: "3px"
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-code)",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}
              >
                {label}
              </div>
            </div>
          ))}

          <style>{`
            @media (max-width: 640px) {
              .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
        </div>

        {/* Full description */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "var(--text-primary)",
              marginBottom: "1rem"
            }}
          >
            System Overview
          </h2>
          {project.description.split("\n\n").map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: i === 0 ? "var(--text-primary)" : "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: "1rem"
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Architecture */}
        <div
          className="glass-card"
          style={{
            padding: "1.75rem",
            marginBottom: "1.5rem",
            background: "rgba(0,212,255,0.02)"
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "var(--text-primary)",
              marginBottom: "1rem"
            }}
          >
            System Architecture
          </h2>
          {project.architectureDiagram ? (
            <pre
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "12px",
                color: "var(--accent-primary)",
                lineHeight: 1.9,
                overflowX: "auto",
                padding: "1rem",
                background: "rgba(0,212,255,0.04)",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                whiteSpace: "pre"
              }}
            >
              {project.architectureDiagram}
            </pre>
          ) : (
            <div
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "12px",
                color: "var(--accent-primary)",
                lineHeight: 1.8,
                wordBreak: "break-word"
              }}
            >
              {project.architecture}
            </div>
          )}
        </div>

        {/* Tech stack */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "var(--text-primary)",
              marginBottom: "1rem"
            }}
          >
            Tech Stack
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {project.tech.map(t => (
              <span key={t} className="tech-badge">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Eval Results */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "var(--text-primary)",
              marginBottom: "1rem"
            }}
          >
            Evaluation Results
          </h2>
          <EvalTable results={project.evalResults} />
          <p
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "10px",
              color: "var(--text-muted)",
              marginTop: "0.75rem"
            }}
          >
            Green ≥ 85% · Yellow 70–84% · Red &lt; 70%
          </p>
        </div>

        {/* Failure Gallery */}
        <div style={{ marginBottom: "1.5rem" }}>
          <FailureGallery failures={project.failureCases} />
        </div>

        {/* What I Learned */}
        {project.whatILearned && project.whatILearned.length > 0 && (
          <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "var(--text-primary)",
                marginBottom: "1rem"
              }}
            >
              What I Learned
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
              {project.whatILearned.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6
                  }}
                >
                  <span
                    style={{
                      color: "var(--accent-primary)",
                      fontFamily: "var(--font-code)",
                      fontSize: "11px",
                      marginTop: "3px",
                      flexShrink: 0
                    }}
                  >
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Demo video */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "var(--text-primary)",
              marginBottom: "1rem"
            }}
          >
            Demo
          </h2>
          {project.slug === "face-mask-detection" ? (
            <>
              {videoOpen ? (
                <div style={{ marginBottom: "2rem" }}>
                  <FaceMaskDemo />
                </div>
              ) : (
                <button
                  onClick={() => setVideoOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.25)",
                    color: "var(--accent-primary)",
                    fontFamily: "var(--font-code)",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  <Play size={14} /> Open Live Demo
                </button>
              )}
            </>
          ) : (
            <>
              {videoOpen ? (
                <div style={{ aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden" }}>
                  <iframe
                    src={project.demoVideo}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              ) : (
                <button
                  onClick={() => setVideoOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.25)",
                    color: "var(--accent-primary)",
                    fontFamily: "var(--font-code)",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  <Play size={14} /> Play Demo Video
                </button>
              )}
            </>
          )}
        </div>

        {/* GitHub CTA */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            marginBottom: "4rem"
          }}
        >
          <Code2 size={16} />
          View on GitHub
        </a>
      </div>
    </motion.div>
  );
}
