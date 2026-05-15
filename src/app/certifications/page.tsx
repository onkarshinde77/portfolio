"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

/* ─── Lightbox ─── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        cursor: "zoom-out"
      }}
    >
      <button 
        onClick={onClose}
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "18px",
          transition: "all 0.2s",
          zIndex: 10000
        }}
      >
        <X size={18} />
      </button>
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "90vw",
          height: "88vh",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 0 80px rgba(124,58,237,0.15)",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative"
        }}
      >
        <Image src={src} alt="Full view" width={1600} height={1100} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
      </motion.div>
    </motion.div>
  );
}

const certificates = [
  { file: "35.png", name: "Achievement Certificate", type: "image", platform: "Verified Credential" },
  { file: "AIDS DYPCOE.jpg", name: "AIDS DYPCOE", type: "image", platform: "Institution" },
  { file: "Onkar Shinde_certificate (1).png", name: "Machine Learning / AI", type: "image", platform: "Verified Credential" },
  { file: "Onkar_Appasahaheb_Shinde.png", name: "Python / Data Science", type: "image", platform: "Verified Credential" },
  { file: "CPMC.png", name: "Technical Certification", type: "image", platform: "Verified Credential" },
  { file: "certificate_Shinde onkar .png", name: "Skill Certification", type: "image", platform: "Verified Credential" },
  { file: "jspm.jfif", name: "JSPM", type: "image", platform: "Institution" },
  { file: "DSA_completion.jpg", name: "DSA Completion", type: "image", platform: "Course Certificate" },
  { file: "NVIDIA.jpg", name: "NVIDIA DLI", type: "image", platform: "NVIDIA" },
  { file: "SQL.jpg", name: "SQL Intermediate", type: "image", platform: "HackerRank" },
];

export default function CertificationsPage() {
  const [lbSrc, setLbSrc] = useState<string | null>(null);

  const open = (src: string) => setLbSrc(src);
  const close = () => setLbSrc(null);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "120px 2rem 4rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <AnimatePresence>
        {lbSrc && <Lightbox src={lbSrc} onClose={close} />}
      </AnimatePresence>

      <div style={{ maxWidth: "1200px", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-primary)", boxShadow: "0 0 10px var(--accent-primary)" }} />
            <span style={{ color: "var(--accent-primary)", fontFamily: "var(--font-code)", fontSize: "14px" }}>
              VERIFIED_CREDENTIALS
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "3rem"
            }}
          >
            Certifications Gallery
          </h1>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.file}
              onClick={() => open(`/certificates/${cert.file}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              style={{
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-primary)";
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 212, 255, 0.1)";
                const img = e.currentTarget.querySelector('.cert-image') as HTMLElement;
                if (img) img.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                const img = e.currentTarget.querySelector('.cert-image') as HTMLElement;
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "rgba(0,0,0,0.5)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cert.type === "image" ? (
                  <Image
                    src={`/certificates/${cert.file}`}
                    alt={cert.name}
                    fill
                    className="cert-image"
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                  />
                ) : (
                  <div className="cert-image" style={{ fontSize: "4rem", transition: "transform 0.5s ease" }}>📄</div>
                )}

                {/* Overlay badge */}
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-code)",
                  color: "var(--text-primary)",
                  textTransform: "uppercase"
                }}>
                  {cert.type}
                </div>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                  {cert.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-secondary)" }} />
                  <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-code)", fontSize: "0.85rem" }}>
                    {cert.platform}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
