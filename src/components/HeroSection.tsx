"use client";

import { motion } from "framer-motion";
import { Code2, Link, AtSign, ExternalLink, ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/data/site-config";

const NeuralCanvas = dynamic(
  () => import("./NeuralCanvas").then(m => m.NeuralCanvas),
  { ssr: false }
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};

export function HeroSection() {
  return (
    <section
      id="hero"
      className="hero-gradient"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* 3D Canvas - desktop only */}
      <div
        className="hero-3d-canvas"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <NeuralCanvas />
      </div>

      {/* Mobile gradient background */}
      <div
        className="hero-mobile-bg"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.12) 0%, rgba(124,58,237,0.06) 50%, transparent 80%)",
          zIndex: 0
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "680px",
          padding: "0 2rem",
          marginLeft: "clamp(1.5rem, 8vw, 10rem)",
          marginTop: "4rem"
        }}
      >
        {/* Label */}
        <motion.div variants={itemVariants}>
          <span
            className="blink-cursor"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              letterSpacing: "0.2em",
              color: "var(--accent-primary)",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "1.25rem"
            }}
          >
            {siteConfig.title}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          className="text-glow"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 7vw, 6rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            marginBottom: "1.5rem"
          }}
        >
          {siteConfig.name}
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: "500px",
            marginBottom: "2.5rem"
          }}
        >
          {siteConfig.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}
        >
          <a href="#projects" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
            View Systems
          </a>
          <button
            className="btn-outline"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-chatbot"))
            }
          >
            Ask My AI
          </button>
        </motion.div>

        {/* Social icons */}
        <motion.div
          variants={itemVariants}
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
        >
          {[
            { Icon: Code2, href: siteConfig.githubUrl, label: "GitHub" },
            { Icon: Link, href: siteConfig.linkedinUrl, label: "LinkedIn" },
            { Icon: AtSign, href: siteConfig.twitterUrl, label: "Twitter" },
            {
              Icon: ExternalLink,
              href: siteConfig.huggingfaceUrl,
              label: "HuggingFace"
            }
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(0,212,255,0.06)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                transition: "all 0.2s ease",
                textDecoration: "none"
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "var(--accent-primary)";
                el.style.borderColor = "rgba(0,212,255,0.4)";
                el.style.boxShadow = "0 0 15px rgba(0,212,255,0.2)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "var(--text-muted)";
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          color: "var(--text-muted)",
          fontSize: "11px",
          fontFamily: "var(--font-display)",
          letterSpacing: "0.1em"
        }}
      >
        <span>SCROLL</span>
        <ArrowDown size={16} />
      </motion.div>
    </section>
  );
}
