"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Code2, ChevronDown, ChevronUp, ExternalLink, Cpu, Battery, Zap, Radio, Target, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "@/data/projects";
import s from "./page.module.css";

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
export default function CollisionDetectionPage() {
  const p = getProjectBySlug("collision-detection-robot");

  if (!p) return <div>Project not found.</div>;

  const prototypeImages = p.images?.filter(img => img.includes("/prototype/")) || [];
  const cumminsImages = p.images?.filter(img => img.includes("/CUMMINS/")) || [];
  const pictImages = p.images?.filter(img => img.includes("/PICT/")) || [];

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
          <div className={s.badge}>{p.category}</div>
          <h1 className={s.heroTitle}>
            {rest} <span>{lastWord}</span>
          </h1>
          <p className={s.tagline}>{p.tagline}</p>
          <div className={s.heroBtns}>
            <a href={p.github} target="_blank" rel="noopener noreferrer" className={s.btnPrimary}>
              <Code2 size={15} /> View Source Code
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className={s.statsRow} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          {[
            { label: "Latency", value: p.stats.latency ?? "—" },
            { label: "Accuracy", value: p.stats.evalScore ?? "—" },
            { label: "Testing", value: p.stats.datasetSize ?? "—" },
            { label: "Processing", value: p.stats.costPerCall ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className={s.stat}>
              <div className={s.statVal}>{value}</div>
              <div className={s.statKey}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ─── TWO-COLUMN MAIN ─── */}
        <div className={s.grid2}>

          {/* LEFT: Info */}
          <div className={s.colLeft}>
            {/* Overview */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className={s.cardTitle}>System Overview</div>
              {p.description.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: i === 0 ? "var(--text-primary)" : "var(--text-muted)", lineHeight: 1.85, marginBottom: "0.875rem" }}>{para}</p>
              ))}
            </motion.div>

            {/* Hardware Components */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className={s.cardTitle}>Hardware Components</div>
              <div className={s.componentsGrid}>
                <div className={s.componentBox}>
                  <Cpu className={s.compIcon} style={{ color: "#0ea5e9" }} />
                  <div>
                    <div className={s.compName}>Arduino Uno</div>
                    <div className={s.compDesc}>ATmega328P Microcontroller</div>
                  </div>
                </div>
                <div className={s.componentBox}>
                  <Radio className={s.compIcon} style={{ color: "#10b981" }} />
                  <div>
                    <div className={s.compName}>HC-SR04</div>
                    <div className={s.compDesc}>Ultrasonic Sensor (Sonar)</div>
                  </div>
                </div>
                <div className={s.componentBox}>
                  <Zap className={s.compIcon} style={{ color: "#f59e0b" }} />
                  <div>
                    <div className={s.compName}>L298N</div>
                    <div className={s.compDesc}>Dual-Channel Motor Driver</div>
                  </div>
                </div>
                <div className={s.componentBox}>
                  <Battery className={s.compIcon} style={{ color: "#8b5cf6" }} />
                  <div>
                    <div className={s.compName}>Li-ion Power</div>
                    <div className={s.compDesc}>Rechargeable Battery Pack</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Architecture */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className={s.cardTitle}>Logic Flow & Architecture</div>
              <pre className={s.archPre}>{p.architectureDiagram}</pre>
            </motion.div>

            {/* Highlights */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className={s.cardTitle}>Key Features</div>
              {p.highlights.map((h, i) => (
                <div key={i} className={s.highlightItem}>
                  <div className={s.dot} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{h}</span>
                </div>
              ))}
            </motion.div>

            {/* Failure Analysis */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Accordion title="Hardware Debugging & Fixes">
                {p.failureCases.map((f, i) => (
                  <div key={i} className={s.failureItem}>
                    <span style={{ color: "#ef4444", marginRight: 8 }}>[{String(i + 1).padStart(2, "0")}]</span>{f}
                  </div>
                ))}
              </Accordion>
            </motion.div>

            {/* What I Learned */}
            {p.whatILearned && p.whatILearned.length > 0 && (
              <motion.div className={s.card} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className={s.cardTitle}>Knowledge Acquired</div>
                {p.whatILearned.map((item, i) => (
                  <div key={i} className={s.learnItem}>
                    <span className={s.learnNum}>[{String(i + 1).padStart(2, "0")}]</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{item}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* RIGHT: Visuals & Logic Flow */}
          <div className={s.colRight}>

            {/* Robot Animation / Logic Visualization */}
            <motion.div className={s.card} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className={s.cardTitle}>Live Sonar Detection Flow</div>
              <div className={s.robotViz}>
                <div className={s.sonarRing} />
                <div className={s.sonarRing} />
                <div className={s.sonarRing} />
                <div className={s.robotBody}>🤖</div>
                <div className={s.obstacle}>🧱</div>
                <div className={s.distLabel}>Distance &lt; 20cm → AVOIDING</div>
              </div>
              <div className={s.flowGrid} style={{ marginTop: "2rem" }}>
                <div className={s.flowStep}>
                  <div className={s.flowIcon}><Radio size={18} color="var(--accent-primary)" /></div>
                  <div className={s.flowContent}>
                    <div className={s.flowTitle}>1. Emit Sonar Pulse</div>
                    <div className={s.flowDesc}>HC-SR04 sends out a 40kHz ultrasonic wave.</div>
                  </div>
                </div>
                <div className={s.flowStep}>
                  <div className={s.flowIcon}><Target size={18} color="#f59e0b" /></div>
                  <div className={s.flowContent}>
                    <div className={s.flowTitle}>2. Detect Obstacle</div>
                    <div className={s.flowDesc}>Wave reflects back; Arduino calculates distance.</div>
                  </div>
                </div>
                <div className={s.flowStep}>
                  <div className={s.flowIcon}><AlertTriangle size={18} color="#ef4444" /></div>
                  <div className={s.flowContent}>
                    <div className={s.flowTitle}>3. Collision Avoidance</div>
                    <div className={s.flowDesc}>If &lt; 20cm, trigger buzzer, stop motors, reverse, and turn.</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Prototype Gallery */}
            {prototypeImages.length > 0 && (
              <motion.div className={s.card} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className={s.cardTitle}>Hardware Prototype</div>
                <div className={`${s.galleryGrid} ${s.galleryGrid2}`}>
                  {prototypeImages.map((img, i) => (
                    <div key={i} className={`${s.galleryItem} ${s.galleryItemStatic} ${s.wide}`}>
                      <Image src={img} alt="Prototype" fill style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                      <div className={s.galleryOverlay}>
                        <div className={s.galleryOverlayText}>PROTOTYPE BUILD</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* ─── EXHIBITION GALLERY ─── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginTop: "5rem" }}>
          <h2 className={s.gallerySectionTitle}>College Exhibitions</h2>
          <p className={s.gallerySectionSub}>Showcasing the collision detection robot at prestigious engineering events.</p>

          {/* Cummins College */}
          {cumminsImages.length > 0 && (
            <div className={s.collegeSection}>
              <div className={s.collegeLabel}>
                <div className={s.collegeBadge} style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", color: "#ec4899" }}>EXHIBITION</div>
                <div>
                  <div className={s.collegeName}>Cummins College of Engineering</div>
                  <div className={s.collegeMeta}>April 2025 • Hardware & AI Showcase</div>
                </div>
              </div>
              <div className={`${s.galleryGrid} ${s.galleryGrid3}`}>
                {cumminsImages.map((img, i) => (
                  <div key={i} className={`${s.galleryItem} ${i % 3 === 0 ? s.wide : s.square}`}>
                    <Image src={img} alt="Cummins Exhibition" fill style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                    <div className={s.galleryOverlay}>
                      <div className={s.galleryOverlayText}>CUMMINS EVENT</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PICT College */}
          {pictImages.length > 0 && (
            <div className={s.collegeSection}>
              <div className={s.collegeLabel}>
                <div className={s.collegeBadge} style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981" }}>EXHIBITION</div>
                <div>
                  <div className={s.collegeName}>PICT College of Engineering</div>
                  <div className={s.collegeMeta}>March 2025 • Tech Symposium</div>
                </div>
              </div>
              <div className={`${s.galleryGrid} ${s.galleryGrid3}`}>
                {pictImages.map((img, i) => (
                  <div key={i} className={`${s.galleryItem} ${s.wide}`}>
                    <Image src={img} alt="PICT Exhibition" fill style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                    <div className={s.galleryOverlay}>
                      <div className={s.galleryOverlayText}>PICT SYMPOSIUM</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
