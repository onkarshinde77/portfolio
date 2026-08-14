"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Code2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug, type EvalResults } from "@/data/projects";
import s from "./page.module.css";

/* ─── label map for metric keys ─── */
const METRIC_LABELS: Record<string, string> = {
  accuracy: "Accuracy",
  precision: "Precision",
  recall: "Recall",
  f1: "F1-Score",
  rocAuc: "ROC AUC",
  faithfulness: "Faithfulness",
  relevancy: "Relevancy",
};

/* ─── helpers ─── */
function scoreColor(n: number) {
  return n >= 85 ? "var(--accent-tertiary)" : n >= 70 ? "#f59e0b" : "#ef4444";
}

/* ─── Metrics ─── */
function Metrics({ results }: { results: EvalResults }) {
  const nums = Object.entries(results).filter(([, v]) => typeof v === "number") as [string, number][];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className={s.metricRow}>
        {nums.map(([k, v]) => (
          <motion.div key={k} className={s.metricBox} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
            <div className={s.metricNum} style={{ color: scoreColor(v) }}>{v}%</div>
            <div className={s.metricKey}>{METRIC_LABELS[k] ?? k}</div>
          </motion.div>
        ))}
      </div>
      {results.latency && (
        <div style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 10, padding: "0.875rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-code)", fontSize: 12, color: "var(--text-muted)" }}>LATENCY</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-primary)" }}>{results.latency}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Evaluation Charts ─── */
function EvaluationCharts({ evaluationImages }: { evaluationImages: { confusionMatrix?: string; rocCurve?: string; trainingHistory?: string } }) {
  const topCharts = [
    { key: "confusionMatrix", label: "Confusion Matrix", src: evaluationImages.confusionMatrix },
    { key: "rocCurve", label: "ROC Curve (AUC = 0.9987)", src: evaluationImages.rocCurve },
  ].filter(c => !!c.src);

  const hasTraining = !!evaluationImages.trainingHistory;
  if (topCharts.length === 0 && !hasTraining) return null;

  return (
    <motion.div
      className={s.card}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.22 }}
    >
      <div className={s.cardTitle}>Model Evaluation Reports</div>

      {/* Confusion Matrix + ROC Curve side-by-side */}
      {topCharts.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: topCharts.length === 2 ? "repeat(2, 1fr)" : "1fr", gap: "1rem" }}>
          {topCharts.map(({ key, label, src }) => (
            <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(0,212,255,0.12)"
                }}
              >
                <Image
                  src={src!}
                  alt={label}
                  fill
                  style={{ objectFit: "contain", padding: "8px" }}
                />
              </div>
              <div style={{ fontFamily: "var(--font-code)", fontSize: "11px", color: "var(--text-muted)", textAlign: "center", letterSpacing: "0.05em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Training History — full width below */}
      {hasTraining && (
        <div style={{ marginTop: topCharts.length > 0 ? "1rem" : 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: "10px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(0,212,255,0.12)"
            }}
          >
            <Image
              src={evaluationImages.trainingHistory!}
              alt="Training History"
              fill
              style={{ objectFit: "contain", padding: "8px" }}
            />
          </div>
          <div style={{ fontFamily: "var(--font-code)", fontSize: "11px", color: "var(--text-muted)", textAlign: "center", letterSpacing: "0.05em" }}>
            Training History
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Gallery ─── */
function Gallery({ images, localVideo }: { images: string[]; localVideo?: string }) {
  const [idx, setIdx] = useState(0);
  const [lb, setLb] = useState<string | null>(null);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);
  return (
    <>
      <AnimatePresence>
        {lb && (
          <motion.div className={s.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLb(null)}>
            <motion.div className={s.lightboxInner} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <Image src={lb} alt="Preview" width={1200} height={900} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={s.mainImage} onClick={() => setLb(images[idx])}>
        <Image src={images[idx]} alt={`screenshot ${idx + 1}`} fill style={{ objectFit: "contain", width: "100%", height: "100%" }} priority />
        <div className={s.imageOverlay} />
        {images.length > 1 && <>
          <button className={`${s.imgNav} ${s.imgNavLeft}`} onClick={e => { e.stopPropagation(); prev(); }}><ChevronLeft size={18} /></button>
          <button className={`${s.imgNav} ${s.imgNavRight}`} onClick={e => { e.stopPropagation(); next(); }}><ChevronRight size={18} /></button>
        </>}
        <span className={s.imgCounter}>{idx + 1} / {images.length}</span>
      </div>

      {images.length > 1 && (
        <div className={s.thumbRow}>
          {images.map((img, i) => (
            <div key={i} className={`${s.thumb} ${i === idx ? s.thumbActive : ""}`} onClick={() => setIdx(i)}>
              <Image src={img} alt={`thumb ${i + 1}`} fill style={{ objectFit: "contain", width: "100%", height: "100%" }} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ─── Accordion ─── */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={s.accordion}>
      <button className={s.accordionBtn} onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
            <div className={s.accordionBody}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page ─── */
export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const p = getProjectBySlug(slug);

  if (!p) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
      Project not found.
    </div>
  );

  const hasMedia = p.images && p.images.length > 0;
  const words = p.name.split(" ");
  const lastWord = words.pop();
  const rest = words.join(" ");

  return (
    <motion.div className={s.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className={s.container}>

        {/* Back */}
        <Link href="/#projects" className={s.backBtn}>
          <ArrowLeft size={14} /> Back to Projects
        </Link>

        {/* Hero */}
        <motion.div className={s.hero} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className={s.category}>{p.category}</div>
          <h1 className={s.heroTitle}>
            {rest} <span>{lastWord}</span>
          </h1>
          <p className={s.tagline}>{p.tagline}</p>
          <div className={s.heroActions}>
            <a href={p.github} target="_blank" rel="noopener noreferrer" className={s.btnPrimary}>
              <Code2 size={15} /> View on GitHub
            </a>
            <Link href="/#projects" className={s.btnGhost}>
              <ExternalLink size={15} /> All Projects
            </Link>
            {/* <a href={p.demoVideo} target="_blank" rel="noopener noreferrer" className={s.btnPrimary}>
              <Code2 size={15} /> Demo Video
            </a> */}
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div className={s.statsGrid} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {[
            { label: "Eval Score", value: p.stats.evalScore ?? "—" },
            { label: "Latency", value: p.stats.latency ?? "—" },
            { label: "Dataset", value: p.stats.datasetSize ?? "—" },
            { label: "Cost/call", value: p.stats.costPerCall ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className={s.statCard}>
              <div className={s.statValue}>{value}</div>
              <div className={s.statLabel}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Two-column body */}
        <div className={s.mainGrid}>

          {/* LEFT — info */}
          <div className={s.infoCol}>

            {/* Overview */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className={s.cardTitle}>System Overview</div>
              {p.description.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: i === 0 ? "var(--text-primary)" : "var(--text-muted)", lineHeight: 1.85, marginBottom: "0.875rem" }}>{para}</p>
              ))}
            </motion.div>

            {/* Architecture */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 }}>
              <div className={s.cardTitle}>Architecture</div>
              {p.architectureDiagram
                ? <pre className={s.archPre}>{p.architectureDiagram}</pre>
                : <div style={{ fontFamily: "var(--font-code)", fontSize: 12, color: "var(--accent-primary)", lineHeight: 1.8 }}>{p.architecture}</div>}
            </motion.div>

            {/* Tech Stack */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <div className={s.cardTitle}>Tech Stack</div>
              <div className={s.techRow}>{p.tech.map(t => <span key={t} className={s.techBadge}>{t}</span>)}</div>
            </motion.div>

            {/* Highlights */}
            {p.highlights.length > 0 && (
              <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
                <div className={s.cardTitle}>Key Highlights</div>
                {p.highlights.map((h, i) => (
                  <div key={i} className={s.highlightItem}>
                    <div className={s.highlightDot} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{h}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Metrics */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className={s.cardTitle}>Evaluation Metrics</div>
              <Metrics results={p.evalResults} />
            </motion.div>

            {/* Evaluation Charts (confusion matrix, ROC curve, training history) */}
            {p.evaluationImages && (
              <EvaluationCharts evaluationImages={p.evaluationImages} />
            )}

            {/* Failure Analysis */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }}>
              <Accordion title="Failure Analysis & Fixes">
                {p.failureCases.map((f, i) => (
                  <div key={i} className={s.failureItem}>
                    <span style={{ color: "#ef4444", marginRight: 8 }}>[{String(i + 1).padStart(2, "0")}]</span>{f}
                  </div>
                ))}
              </Accordion>
            </motion.div>

            {/* What I Learned */}
            {p.whatILearned && p.whatILearned.length > 0 && (
              <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
                <div className={s.cardTitle}>What I Learned</div>
                {p.whatILearned.map((item, i) => (
                  <div key={i} className={s.learnItem}>
                    <span className={s.learnNum}>[{String(i + 1).padStart(2, "0")}]</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{item}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* RIGHT — media */}
          {hasMedia && (
            <motion.div className={s.mediaCol} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className={s.card} style={{ padding: "1.25rem" }}>
                <div className={s.cardTitle}>Project Preview</div>
                <Gallery images={p.images!} localVideo={p.localVideo} />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
