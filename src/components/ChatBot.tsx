"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const starters = [
  "What projects have you built?",
  "What's your tech stack?",
  "How can I contact you?"
];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm an AI version of Onkar. Ask me anything about my projects, skills, or background."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, []);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages
        })
      });

      if (!res.ok || !res.body) throw new Error("Failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "" }
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split("\n");
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantContent += parsed.text;
                setMessages(prev => [
                  ...prev.slice(0, -1),
                  { role: "assistant", content: assistantContent }
                ]);
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please check back soon or email Onkar directly at onkar@example.com."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setOpen(true)}
        title="Ask anything about my portfolio"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "var(--accent-primary)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
          zIndex: 9000,
          boxShadow: "0 0 20px rgba(0,212,255,0.4), 0 0 60px rgba(0,212,255,0.15)",
          transition: "all 0.2s ease"
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 30px rgba(0,212,255,0.6), 0 0 80px rgba(0,212,255,0.25)"
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={22} />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 60, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 60, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="chat-panel"
            style={{
              position: "fixed",
              bottom: "2rem",
              right: "1.5rem",
              width: "clamp(320px, 90vw, 420px)",
              height: "560px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              zIndex: 9001,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(0,212,255,0.04)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bot size={16} style={{ color: "var(--accent-primary)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text-primary)"
                  }}
                >
                  AI Onkar
                </span>
                <span
                  className="live-dot"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent-tertiary)"
                  }}
                />
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "0.6rem 0.9rem",
                      borderRadius:
                        msg.role === "user"
                          ? "12px 12px 4px 12px"
                          : "12px 12px 12px 4px",
                      background:
                        msg.role === "user"
                          ? "rgba(0,212,255,0.15)"
                          : "rgba(124, 58, 237, 0.08)",
                      border:
                        msg.role === "user"
                          ? "1px solid rgba(0,212,255,0.25)"
                          : "1px solid rgba(124, 58, 237, 0.2)",
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color:
                        msg.role === "user"
                          ? "var(--accent-primary)"
                          : "rgba(255, 255, 255, 0.9)",
                      whiteSpace: msg.role === "user" ? "pre-wrap" : "normal"
                    }}
                  >
                    {msg.content ? (
                      msg.role === "user" ? (
                        msg.content
                      ) : (
                        <div className="markdown-body">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ node, ...props }) => <p style={{ margin: "0 0 8px 0", whiteSpace: "pre-wrap" }} {...props} />,
                              ul: ({ node, ...props }) => <ul style={{ margin: "0 0 8px 0", paddingLeft: "20px" }} {...props} />,
                              ol: ({ node, ...props }) => <ol style={{ margin: "0 0 8px 0", paddingLeft: "20px" }} {...props} />,
                              li: ({ node, ...props }) => <li style={{ marginBottom: "4px" }} {...props} />,
                              a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-primary)", textDecoration: "underline", wordBreak: "break-all" }} {...props} />,
                              strong: ({ node, ...props }) => <strong style={{ color: "var(--accent-secondary)", fontWeight: 600 }} {...props} />,
                              h1: ({ node, ...props }) => <h1 style={{ fontSize: "1.1em", fontWeight: 700, margin: "12px 0 8px 0", color: "var(--accent-tertiary)" }} {...props} />,
                              h2: ({ node, ...props }) => <h2 style={{ fontSize: "1.05em", fontWeight: 600, margin: "10px 0 6px 0", color: "var(--accent-tertiary)" }} {...props} />,
                              h3: ({ node, ...props }) => <h3 style={{ fontSize: "1em", fontWeight: 600, margin: "8px 0 4px 0" }} {...props} />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )
                    ) : (
                      <span style={{ opacity: 0.5 }}>
                        <span className="blink-cursor" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Starter chips */}
            {messages.length === 1 && (
              <div
                style={{
                  padding: "0 1rem 0.5rem",
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap"
                }}
              >
                {starters.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: "rgba(0,212,255,0.06)",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-code)",
                      fontSize: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-primary)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.3)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              style={{
                padding: "0.75rem 1rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: "8px"
              }}
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Ask about my projects, skills, background..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  outline: "none",
                  transition: "border-color 0.2s ease"
                }}
                onFocus={e => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(0,212,255,0.4)";
                }}
                onBlur={e => {
                  (e.currentTarget as HTMLInputElement).style.borderColor = "var(--border)";
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  background: "var(--accent-primary)",
                  border: "none",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  transition: "opacity 0.2s ease",
                  flexShrink: 0
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
