"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/data/site-config";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Systems", href: "#projects" },
  { label: "Metrics", href: "#eval" },
  { label: "Contact", href: "#contact" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [ragStatus] = useState<"online" | "offline">("online");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(5, 5, 8, 0.9)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "all 0.3s ease"
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "18px",
            color: "var(--text-primary)",
            letterSpacing: "0.05em"
          }}
        >
          OS<span style={{ color: "var(--accent-primary)" }}>://</span>
        </span>
      </Link>

      {/* Center links - hidden on mobile */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center"
        }}
        className="hidden-mobile"
      >
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "12px",
              letterSpacing: "0.08em",
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "color 0.2s ease",
              textTransform: "uppercase"
            }}
            onMouseEnter={e => {
              (e.target as HTMLAnchorElement).style.color =
                "var(--accent-primary)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLAnchorElement).style.color = "var(--text-muted)";
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right side: RAG status + Cmd+K hint */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {/* RAG status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-code)",
            fontSize: "11px",
            color: "var(--text-muted)"
          }}
          className="hidden-mobile"
        >
          <span
            className="live-dot"
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background:
                ragStatus === "online"
                  ? "var(--accent-tertiary)"
                  : "var(--text-muted)",
              display: "inline-block"
            }}
          />
          RAG · {ragStatus}
        </div>

        {/* Cmd+K hint */}
        <button
          onClick={() =>
            window.dispatchEvent(new CustomEvent("open-command-palette"))
          }
          style={{
            background: "rgba(0, 212, 255, 0.06)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontFamily: "var(--font-code)",
            fontSize: "11px",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "rgba(0,212,255,0.3)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--accent-primary)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-muted)";
          }}
        >
          ⌘K
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
