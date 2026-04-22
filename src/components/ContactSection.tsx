"use client";

import { motion } from "framer-motion";
import { Mail, Code2, Link, ExternalLink, AtSign, Download } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export function ContactSection() {
  return (
    <section
      id="contact"
      style={{
        padding: "6rem 2rem",
        maxWidth: "700px",
        margin: "0 auto",
        textAlign: "center",
        position: "relative"
      }}
    >
      <div className="section-divider" style={{ marginBottom: "5rem" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass-card"
        style={{ padding: "3rem 2.5rem" }}
      >
        {/* Label */}
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
          // Connect
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "1.25rem"
          }}
        >
          Initialize Contact
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: "480px",
            margin: "0 auto 2.5rem"
          }}
        >
          Available for full-time AI engineering roles, research collaborations, and open source projects. I typically respond within 24 hours.
        </p>

        {/* Email CTA */}
        <a
          href={`mailto:${siteConfig.email}`}
          className="btn-primary"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "2rem"
          }}
        >
          <Mail size={16} />
          {siteConfig.email}
        </a>

        {/* Social links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2rem"
          }}
        >
          {[
            { Icon: Code2, href: siteConfig.githubUrl, label: "GitHub" },
            { Icon: Link, href: siteConfig.linkedinUrl, label: "LinkedIn" },
            { Icon: ExternalLink, href: siteConfig.huggingfaceUrl, label: "HuggingFace" },
            { Icon: AtSign, href: siteConfig.twitterUrl, label: "Twitter" }
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--text-muted)",
                textDecoration: "none",
                fontFamily: "var(--font-code)",
                fontSize: "12px",
                transition: "color 0.2s ease",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)"
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-primary)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,212,255,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
              }}
            >
              <Icon size={14} />
              {label}
            </a>
          ))}
        </div>

        {/* Resume download */}
        <div
          style={{
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)"
          }}
        >
          <a
            href={siteConfig.resumeUrl}
            download
            className="btn-outline"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Download size={15} />
            Download Resume
          </a>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{
          marginTop: "3rem",
          fontFamily: "var(--font-code)",
          fontSize: "11px",
          color: "var(--text-muted)",
          letterSpacing: "0.05em"
        }}
      >
        Built with Next.js 14 · React Three Fiber · Framer Motion · TypeScript
        <br />
        <span style={{ opacity: 0.5 }}>
          <span suppressHydrationWarning>© {new Date().getFullYear()} {siteConfig.name}</span>
        </span>
      </motion.div>
    </section>
  );
}
