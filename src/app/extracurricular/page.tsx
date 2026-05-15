"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import s from "./page.module.css";

/* ─── Lightbox ─── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      className={s.lb}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button className={s.lbClose} onClick={onClose}><X size={18} /></button>
      <motion.div
        className={s.lbInner}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <Image src={src} alt="Full view" width={1600} height={1100} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Gallery Item ─── */
function GItem({ src, label, aspect, onClick }: { src: string; label: string; aspect: string; onClick: () => void }) {
  return (
    <div className={`${s.galleryItem} ${aspect}`} onClick={onClick}>
      <Image src={src} alt={label} fill style={{ objectFit: "contain", width: "100%", height: "100%" }} />
      <div className={s.overlay}>
        <span className={s.overlayText}>{label}</span>
      </div>
    </div>
  );
}

/* ─── Data ─── */
const CET_IMAGES = [
  "/projects/extracurricular/CET/2J2A9192.JPG",
  "/projects/extracurricular/CET/2J2A9232.JPG",
];

const CPMC_DSA = [
  "/projects/extracurricular/CPMC/DSA_Teach1.jpg",
  "/projects/extracurricular/CPMC/DSA_Teach2.jpg",
  "/projects/extracurricular/CPMC/DSA_Teach3.jpg",
];

const CPMC_HACKATHON = [
  "/projects/extracurricular/CPMC/Hackathon1.jpg",
  "/projects/extracurricular/CPMC/Hackathon2.JPG",
  "/projects/extracurricular/CPMC/Hackathon3.JPG",
];

const VIIT_IMAGES = [
  "/projects/extracurricular/VIIT/VIIT.jpeg",
  "/projects/extracurricular/VIIT/IMG20250218124123.jpg",
  "/projects/extracurricular/VIIT/IMG20250301112336.jpg",
  "/projects/extracurricular/VIIT/IMG20250301151830.jpg",
  "/projects/extracurricular/VIIT/IMG20250301160745.jpg",
  "/projects/extracurricular/VIIT/IMG20250301180647.jpg",
  "/projects/extracurricular/VIIT/IMG20250302105538.jpg",
  "/projects/extracurricular/VIIT/IMG20250302143706.jpg",
  "/projects/extracurricular/VIIT/IMG20250302160500.jpg",
  "/projects/extracurricular/VIIT/IMG20250302171439.jpg",
];

/* ─── Page ─── */
export default function ExtracurricularPage() {
  const [lbSrc, setLbSrc] = useState<string | null>(null);

  const open = (src: string) => setLbSrc(src);
  const close = () => setLbSrc(null);

  return (
    <motion.div className={s.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <AnimatePresence>
        {lbSrc && <Lightbox src={lbSrc} onClose={close} />}
      </AnimatePresence>

      <div className={s.container}>
        {/* Back */}
        <Link href="/" className={s.backBtn}>
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Hero */}
        <motion.div className={s.hero} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className={s.badge}>Beyond the Code</div>
          <h1 className={s.heroTitle}>
            Extracurricular <span>Activities</span>
          </h1>
          <p className={s.heroSub}>
            A collection of moments from workshops, hackathons, technical sessions, and events across colleges — where learning extended far beyond the classroom.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div className={s.statsRow} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <div className={s.stat}>
            <div className={s.statVal}>3</div>
            <div className={s.statKey}>Colleges</div>
          </div>
          <div className={s.stat}>
            <div className={s.statVal}>18</div>
            <div className={s.statKey}>Events & Sessions</div>
          </div>
          <div className={s.stat}>
            <div className={s.statVal}>2025</div>
            <div className={s.statKey}>Academic Year</div>
          </div>
        </motion.div>

        {/* ─── CET SECTION ─── */}
        <motion.div className={s.section} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <div className={s.sectionHeader}>
            <div className={s.sectionIcon} style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)" }}>🏛️</div>
            <div className={s.sectionMeta}>
              <div className={s.sectionBadge} style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }}>MHT-CET</div>
              <div className={s.sectionTitle}>MHT-CET — Maharashtra Common Entrance Test</div>
              <div className={s.sectionDesc}>
                Achieved exceptional percentile scores in the Maharashtra Common Entrance Test (MHT-CET), placing among the top candidates in the state. These results secured admission into a premier engineering college and reflect a strong foundation in mathematics and physical sciences.
              </div>
              <div className={s.cetStats}>
                <div className={s.cetStat}>
                  <span className={s.cetStatVal}>98.65</span>
                  <span className={s.cetStatLabel}>Mathematics Percentile</span>
                </div>
                <div className={s.cetDivider} />
                <div className={s.cetStat}>
                  <span className={s.cetStatVal}>95.65</span>
                  <span className={s.cetStatLabel}>PCM Percentile</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${s.galleryGrid} ${s.grid2}`}>
            {CET_IMAGES.map((img, i) => (
              <GItem key={i} src={img} label={`CET Event · ${i + 1}`} aspect={s.aspect43} onClick={() => open(img)} />
            ))}
          </div>
        </motion.div>

        {/* ─── CPMC SECTION ─── */}
        <motion.div className={s.section} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <div className={s.sectionHeader}>
            <div className={s.sectionIcon} style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.2)" }}>🎓</div>
            <div className={s.sectionMeta}>
              <div className={s.sectionBadge} style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.25)", color: "#ec4899" }}>CPMC</div>
              <div className={s.sectionTitle}>CPMC — Teaching & Hackathons</div>
              <div className={s.sectionDesc}>Conducted DSA teaching sessions for students and participated in competitive hackathon challenges, collaborating on innovative solutions under pressure.</div>
            </div>
          </div>

          {/* DSA Teaching */}
          <div className={s.subsection}>
            <div className={s.subsectionLabel}>DSA Teaching Sessions</div>
            <div className={`${s.galleryGrid} ${s.grid3}`}>
              {CPMC_DSA.map((img, i) => (
                <GItem key={i} src={img} label={`Teaching Session · ${i + 1}`} aspect={s.aspect43} onClick={() => open(img)} />
              ))}
            </div>
          </div>

          {/* Hackathon */}
          <div className={s.subsection}>
            <div className={s.subsectionLabel}>Hackathon</div>
            <div className={`${s.galleryGrid} ${s.grid3}`}>
              {CPMC_HACKATHON.map((img, i) => (
                <GItem key={i} src={img} label={`Hackathon · ${i + 1}`} aspect={s.aspect43} onClick={() => open(img)} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── VIIT SECTION ─── */}
        <motion.div className={s.section} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <div className={s.sectionHeader}>
            <div className={s.sectionIcon} style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>🌐</div>
            <div className={s.sectionMeta}>
              <div className={s.sectionBadge} style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>VIIT</div>
              <div className={s.sectionTitle}>Vishwakarma Institute of Information Technology</div>
              <div className={s.sectionDesc}>Participated in a multi-day technical symposium and workshop series held in February–March 2025, engaging with peers and faculty across disciplines.</div>
            </div>
          </div>

          {/* Featured first image wide */}
          <div style={{ marginBottom: "1rem" }}>
            <GItem src={VIIT_IMAGES[0]} label="VIIT · Featured" aspect={s.aspect169} onClick={() => open(VIIT_IMAGES[0])} />
          </div>

          {/* Remaining 9 in 3-col grid */}
          <div className={`${s.galleryGrid} ${s.grid3}`}>
            {VIIT_IMAGES.slice(1).map((img, i) => (
              <GItem key={i} src={img} label={`VIIT · Day ${Math.floor(i / 3) + 1} · ${(i % 3) + 1}`} aspect={s.aspect43} onClick={() => open(img)} />
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
