"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface MetricCard {
  label: string;
  value: number;
  unit: string;
  suffix?: string;
  color: string;
}

const metricCards: MetricCard[] = [
  { label: "Avg Faithfulness (RAG)", value: 87, unit: "%", color: "var(--accent-primary)" },
  { label: "Best CV Accuracy", value: 98, unit: "%", color: "var(--accent-tertiary)" },
  { label: "Best NLP F1 Score", value: 92, unit: "%", color: "var(--accent-secondary)" },
  { label: "Agent Task Success", value: 93, unit: "%", suffix: "", color: "#f59e0b" }
];

const chartData = [
  { version: "RAG v1", faithfulness: 74, relevancy: 79 },
  { version: "RAG v2", faithfulness: 80, relevancy: 83 },
  { version: "Blog Agent", faithfulness: 85, relevancy: 90 },
  { version: "RAG v3", faithfulness: 87, relevancy: 90 },
  { version: "Civic AI", faithfulness: 88, relevancy: 91 },
  { version: "NLP", faithfulness: 90, relevancy: 92 },
  { version: "Agent v2", faithfulness: 91, relevancy: 93 }
];

const recentRuns = [
  { model: "LangGraph Agents", task: "Blog Writing", score: 93, pass: true },
  { model: "FAISS + Groq LLaMA", task: "RAG Faithfulness", score: 87, pass: true },
  { model: "MobileNetV2", task: "Face Mask Detection", score: 98, pass: true },
  { model: "BiLSTM", task: "Sentiment Analysis", score: 92, pass: true },
  { model: "YOLOv8 + Groq", task: "Civic Image Validation", score: 91, pass: true }
];

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = Date.now();
          const duration = 1500;
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(parseFloat((target * eased).toFixed(1)));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  // suppressHydrationWarning: value is always 0 on server; animation starts client-side
  return <span ref={ref} suppressHydrationWarning>{value}{suffix}</span>;
}


const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        fontFamily: "var(--font-code)",
        fontSize: "12px"
      }}
    >
      <div style={{ color: "var(--text-muted)", marginBottom: "4px" }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value}%
        </div>
      ))}
    </div>
  );
};

export function EvalDashboard() {
  return (
    <section
      id="eval"
      style={{
        padding: "6rem 2rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >
      <div className="section-divider" style={{ marginBottom: "5rem" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "3rem",
          flexWrap: "wrap"
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              letterSpacing: "0.2em",
              color: "var(--accent-primary)",
              textTransform: "uppercase",
              marginBottom: "0.75rem"
            }}
          >
            // Metrics
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
            Live Evaluation Metrics
          </h2>
        </div>
        {/* LIVE badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "20px",
            padding: "4px 12px",
            fontFamily: "var(--font-code)",
            fontSize: "11px",
            color: "var(--accent-tertiary)",
            alignSelf: "flex-end",
            marginBottom: "8px"
          }}
        >
          <span
            className="live-dot"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent-tertiary)"
            }}
          />
          LIVE
        </div>
      </motion.div>

      {/* Metric cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem"
        }}
        className="eval-cards-grid"
      >
        {metricCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-card"
            style={{ padding: "1.5rem", textAlign: "center" }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.5rem",
                fontWeight: 700,
                color: card.color,
                marginBottom: "4px",
                textShadow: `0 0 20px ${card.color}66`
              }}
            >
              {card.suffix !== undefined ? card.suffix : ""}
              <AnimatedNumber target={card.value} suffix={card.unit} />
            </div>
            <div
              style={{
                fontFamily: "var(--font-code)",
                fontSize: "11px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}
            >
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two-column: chart + table */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem"
        }}
        className="eval-bottom-grid"
      >
        {/* Line chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card"
          style={{ padding: "1.75rem" }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
              letterSpacing: "0.05em"
            }}
          >
            Eval Scores over Prompt Versions
          </div>
          <div
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "10px",
              color: "var(--text-muted)",
              marginBottom: "1.5rem"
            }}
          >
            Multi-Hop QA System · RAG pipeline
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="version"
                tick={{ fontFamily: "var(--font-code)", fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                tick={{ fontFamily: "var(--font-code)", fontSize: 10, fill: "#6b7280" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="faithfulness"
                stroke="#00d4ff"
                strokeWidth={2}
                dot={{ fill: "#00d4ff", r: 3 }}
                name="Faithfulness"
              />
              <Line
                type="monotone"
                dataKey="relevancy"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ fill: "#7c3aed", r: 3 }}
                name="Relevancy"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent eval runs table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card"
          style={{ padding: "1.75rem" }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
              letterSpacing: "0.05em"
            }}
          >
            Recent Eval Runs
          </div>
          <div
            style={{
              fontFamily: "var(--font-code)",
              fontSize: "10px",
              color: "var(--text-muted)",
              marginBottom: "1.25rem"
            }}
          >
            Powered by custom eval suite · see GitHub
          </div>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Model", "Task", "Score", "Status"].map(h => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontFamily: "var(--font-code)",
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      paddingBottom: "0.75rem",
                      borderBottom: "1px solid var(--border)"
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid rgba(0,212,255,0.05)"
                  }}
                >
                  <td
                    style={{
                      padding: "0.6rem 0",
                      fontFamily: "var(--font-code)",
                      fontSize: "12px",
                      color: "var(--text-primary)"
                    }}
                  >
                    {run.model}
                  </td>
                  <td
                    style={{
                      padding: "0.6rem 0",
                      fontFamily: "var(--font-code)",
                      fontSize: "11px",
                      color: "var(--text-muted)"
                    }}
                  >
                    {run.task}
                  </td>
                  <td
                    style={{
                      padding: "0.6rem 0",
                      fontFamily: "var(--font-code)",
                      fontSize: "12px",
                      color:
                        run.score >= 85
                          ? "var(--accent-tertiary)"
                          : run.score >= 70
                          ? "#f59e0b"
                          : "#ef4444",
                      fontWeight: 600
                    }}
                  >
                    {run.score}%
                  </td>
                  <td style={{ padding: "0.6rem 0" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-code)",
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "3px",
                        background: run.pass
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(239,68,68,0.1)",
                        color: run.pass ? "var(--accent-tertiary)" : "#ef4444",
                        border: `1px solid ${run.pass ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`
                      }}
                    >
                      {run.pass ? "PASS" : "FAIL"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .eval-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .eval-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .eval-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
