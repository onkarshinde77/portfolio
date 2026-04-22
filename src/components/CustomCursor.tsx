"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    const raf = requestAnimationFrame(animate);

    const links = document.querySelectorAll("a, button, [role='button']");
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.transform = "translate(-50%, -50%) scale(1.5)";
      if (ringRef.current) ringRef.current.style.transform = "translate(-50%, -50%) scale(1.5)";
    };
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.transform = "translate(-50%, -50%) scale(1)";
      if (ringRef.current) ringRef.current.style.transform = "translate(-50%, -50%) scale(1)";
    };

    links.forEach(el => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: "8px",
          height: "8px",
          background: "var(--accent-primary)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.1s ease, background 0.2s ease",
          boxShadow: "0 0 10px var(--accent-primary)"
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          width: "28px",
          height: "28px",
          border: "1px solid rgba(0, 212, 255, 0.4)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.15s ease"
        }}
      />
    </>
  );
}
