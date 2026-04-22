"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Hash, Code2, Link, ExternalLink, Download, MessageSquare } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { projects } from "@/data/projects";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const commands: CommandItem[] = [
    ...projects.map(p => ({
      id: `project-${p.slug}`,
      label: p.name,
      description: p.tagline,
      icon: <Hash size={14} />,
      action: () => {
        window.location.href = `/projects/${p.slug}`;
        setOpen(false);
      },
      category: "Projects"
    })),
    {
      id: "nav-about",
      label: "Go to About",
      description: "View profile and bio",
      icon: <Hash size={14} />,
      action: () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation"
    },
    {
      id: "nav-skills",
      label: "Go to Skills",
      icon: <Hash size={14} />,
      action: () => {
        document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation"
    },
    {
      id: "nav-projects",
      label: "Go to Deployed Systems",
      icon: <Hash size={14} />,
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation"
    },
    {
      id: "nav-eval",
      label: "Go to Eval Dashboard",
      icon: <Hash size={14} />,
      action: () => {
        document.getElementById("eval")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation"
    },
    {
      id: "nav-contact",
      label: "Go to Contact",
      icon: <Hash size={14} />,
      action: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
      },
      category: "Navigation"
    },
    {
      id: "open-chatbot",
      label: "Open AI Chatbot",
      description: "Ask anything about Onkar",
      icon: <MessageSquare size={14} />,
      action: () => {
        window.dispatchEvent(new CustomEvent("open-chatbot"));
        setOpen(false);
      },
      category: "Actions"
    },
    {
      id: "download-resume",
      label: "Download Resume",
      icon: <Download size={14} />,
      action: () => {
        window.open(siteConfig.resumeUrl, "_blank");
        setOpen(false);
      },
      category: "Actions"
    },
    {
      id: "github",
      label: "Open GitHub",
      description: siteConfig.githubUrl,
      icon: <Code2 size={14} />,
      action: () => {
        window.open(siteConfig.githubUrl, "_blank");
        setOpen(false);
      },
      category: "Links"
    },
    {
      id: "linkedin",
      label: "Open LinkedIn",
      description: siteConfig.linkedinUrl,
      icon: <Link size={14} />,
      action: () => {
        window.open(siteConfig.linkedinUrl, "_blank");
        setOpen(false);
      },
      category: "Links"
    },
    {
      id: "huggingface",
      label: "Open HuggingFace",
      description: siteConfig.huggingfaceUrl,
      icon: <ExternalLink size={14} />,
      action: () => {
        window.open(siteConfig.huggingfaceUrl, "_blank");
        setOpen(false);
      },
      category: "Links"
    }
  ];

  const filtered = query.trim()
    ? commands.filter(
        c =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    },
    {}
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(o => !o);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", () => setOpen(true));
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 50000
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: "15vh",
              left: "50%",
              transform: "translateX(-50%)",
              width: "clamp(320px, 90vw, 620px)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflow: "hidden",
              zIndex: 50001,
              boxShadow: "0 0 60px rgba(0,212,255,0.12), 0 30px 80px rgba(0,0,0,0.8)"
            }}
          >
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--border)"
              }}
            >
              <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search projects, navigate, open links..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "15px"
                }}
              />
              <kbd
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontFamily: "var(--font-code)",
                  fontSize: "11px",
                  color: "var(--text-muted)"
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: "400px", overflowY: "auto", padding: "0.5rem" }}>
              {Object.entries(grouped).map(([cat, cmds]) => (
                <div key={cat}>
                  <div
                    style={{
                      fontFamily: "var(--font-code)",
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "0.5rem 0.75rem 0.25rem"
                    }}
                  >
                    {cat}
                  </div>
                  {cmds.map(cmd => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "0.6rem 0.75rem",
                        borderRadius: "8px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        color: "var(--text-primary)",
                        transition: "background 0.1s ease"
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,212,255,0.08)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = "none";
                      }}
                    >
                      <span style={{ color: "var(--accent-primary)" }}>{cmd.icon}</span>
                      <span>
                        <div
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            color: "var(--text-primary)"
                          }}
                        >
                          {cmd.label}
                        </div>
                        {cmd.description && (
                          <div
                            style={{
                              fontFamily: "var(--font-code)",
                              fontSize: "11px",
                              color: "var(--text-muted)"
                            }}
                          >
                            {cmd.description}
                          </div>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <div
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    fontFamily: "var(--font-code)",
                    fontSize: "13px",
                    color: "var(--text-muted)"
                  }}
                >
                  No results for &quot;{query}&quot;
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
