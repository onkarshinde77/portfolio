"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

export function CNNVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Network Architecture Definition
  const layers = [
    { name: "Input Image", type: "input", size: 1, dims: [128, 128], features: ["/profile.jpg"] },
    { name: "Conv1: Edge Detection", type: "conv", size: 4, dims: [64, 64], desc: "Extracting basic structural features" },
    { name: "Pool1: Max Pooling", type: "pool", size: 4, dims: [32, 32], desc: "Spatial downsampling" },
    { name: "Conv2: Textures & Patterns", type: "conv", size: 8, dims: [16, 16], desc: "Combining edges into complex patterns" },
    { name: "Pool2: Max Pooling", type: "pool", size: 8, dims: [8, 8], desc: "Aggregating regional activations" },
    { name: "Flatten", type: "flatten", size: 16, dims: [1, 1], desc: "Vectorizing feature maps" },
    { name: "Dense: High-Level Features", type: "dense", size: 12, dims: [1, 1], desc: "Semantic representation" },
    { name: "Output: Identity", type: "output", size: 1, dims: [1, 1], desc: "Classification: Onkar Shinde (1.00)" }
  ];

  // Draw connections between layers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = containerRef.current!.clientWidth;
      canvas.height = containerRef.current!.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrame: number;
    let time = 0;

    const drawConnections = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      const layerElements = Array.from(document.querySelectorAll(".cnn-layer"));

      for (let i = 0; i < layerElements.length - 1; i++) {
        const currentLayer = layerElements[i];
        const nextLayer = layerElements[i + 1];

        const currentNodes = Array.from(currentLayer.querySelectorAll(".cnn-node"));
        const nextNodes = Array.from(nextLayer.querySelectorAll(".cnn-node"));

        // Draw lines from current nodes to next nodes
        const containerRect = containerRef.current!.getBoundingClientRect();

        currentNodes.forEach((node1, idx1) => {
          const rect1 = node1.getBoundingClientRect();
          const p1: Point = {
            x: rect1.right - containerRect.left,
            y: rect1.top + rect1.height / 2 - containerRect.top
          };

          nextNodes.forEach((node2, idx2) => {
            const rect2 = node2.getBoundingClientRect();
            const p2: Point = {
              x: rect2.left - containerRect.left,
              y: rect2.top + rect2.height / 2 - containerRect.top
            };

            // Calculate activation flow
            const isActiveLayer = isProcessing && (i === activeLayer || i === activeLayer - 1);
            const intensity = isActiveLayer
              ? Math.max(0, Math.sin(time * 3 + (idx1 + idx2) * 0.5))
              : 0.1;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);

            // Bezier curve for smooth flowing connections
            const cpOffset = (p2.x - p1.x) * 0.5;
            ctx.bezierCurveTo(p1.x + cpOffset, p1.y, p2.x - cpOffset, p2.y, p2.x, p2.y);

            if (isActiveLayer) {
              ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 + intensity * 0.5})`;
              ctx.lineWidth = 1 + intensity * 1.5;
              ctx.shadowColor = "rgba(0, 212, 255, 0.8)";
              ctx.shadowBlur = 5 * intensity;
            } else {
              ctx.strokeStyle = "rgba(107, 114, 128, 0.1)"; // text-muted equivalent
              ctx.lineWidth = 1;
              ctx.shadowBlur = 0;
            }

            ctx.stroke();

            // Draw flowing data particles if processing
            if (isActiveLayer && Math.random() > 0.8) {
              const particlePos = (time % 1);
              const px = p1.x * (1 - particlePos) + p2.x * particlePos;
              const py = p1.y * (1 - particlePos) + p2.y * particlePos;

              ctx.beginPath();
              ctx.arc(px, py, 2, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(0, 212, 255, 0.8)";
              ctx.fill();
              ctx.shadowBlur = 10;
            }
          });
        });
      }

      animationFrame = requestAnimationFrame(drawConnections);
    };

    drawConnections();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [activeLayer, isProcessing]);

  // Simulate inference process
  const startInference = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActiveLayer(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= layers.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setActiveLayer(-1);
        }, 2000);
      } else {
        setActiveLayer(currentStep);
      }
    }, 1200);
  };

  return (
    <div
      className="min-h-screen pt-24 pb-12 px-4 md:px-8 flex flex-col items-center"
      style={{ background: "var(--bg-primary)", position: "relative", overflow: "hidden" }}
    >
      <div className="absolute inset-0 grid-overlay z-0 opacity-30"></div>

      <div className="z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-glow">
            Neural Identity<span style={{ color: "var(--accent-primary)" }}>.forward()</span>
          </h1>
          <p className="text-muted font-body max-w-2xl mx-auto mb-8">
            Visualizing the hierarchical feature extraction process of a Convolutional Neural Network 
            interpreting my profile representation in latent space.
          </p> */}
          <br></br>
          <br></br>
          <br></br>
          <button
            onClick={startInference}
            disabled={isProcessing}
            className="btn-primary flex items-center gap-2 mx-auto mt-20"
            style={{ opacity: isProcessing ? 0.7 : 1 }}
          >
            {isProcessing ? (
              <>
                <span className="pulse-dot inline-block w-2 h-2 bg-black rounded-full"></span>
                Processing Inference...
              </>
            ) : (
              "Initialize Forward Pass"
            )}
          </button>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </motion.div>
        {/* Network Visualization Container */}
        <div
          ref={containerRef}
          className="w-full relative flex justify-between items-stretch py-12 px-4 rounded-xl border border-[rgba(0,212,255,0.1)] glass-card"
          style={{ minHeight: "60vh" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ width: "100%", height: "100%" }}
          />
          {layers.map((layer, layerIdx) => {
            const isActive = activeLayer === layerIdx;
            const isPast = activeLayer > layerIdx;

            return (
              <div
                key={layer.name}
                className="cnn-layer flex flex-col justify-center items-center relative z-10"
                style={{ flex: layer.type === "input" || layer.type === "output" ? "0 0 auto" : "1 1 0%" }}
              >
                {/* Layer Label */}
                <div
                  className="absolute -top-16 text-center w-32 left-1/2 -translate-x-1/2 transition-opacity duration-300"
                  style={{
                    opacity: isActive ? 1 : 0.4,
                    color: isActive ? "var(--accent-primary)" : "var(--text-muted)"
                  }}
                >
                  <div className="font-code text-xs font-bold whitespace-nowrap">{layer.name}</div>
                  <div className="font-code text-[10px] mt-1 opacity-70 hidden md:block">{layer.desc}</div>
                </div>

                {/* Nodes Array */}
                <div className="flex flex-col gap-2 md:gap-4 items-center">
                  {Array.from({ length: layer.size }).map((_, nodeIdx) => {
                    const isInputImage = layer.type === "input";
                    const isOutput = layer.type === "output";
                    const isFeatureMap = layer.type === "conv" || layer.type === "pool";

                    return (
                      <motion.div
                        key={nodeIdx}
                        className={`cnn-node relative rounded-md flex items-center justify-center overflow-hidden
                          ${isActive ? "pulse-border glow-cyan" : ""}
                        `}
                        initial={false}
                        animate={{
                          borderColor: isActive
                            ? "rgba(0, 212, 255, 0.8)"
                            : isPast
                              ? "rgba(0, 212, 255, 0.3)"
                              : "rgba(107, 114, 128, 0.2)",
                          scale: isActive ? 1.05 : 1,
                        }}
                        style={{
                          width: isInputImage ? "120px" : isOutput ? "140px" : isFeatureMap ? `${Math.max(20, layer.dims[0] * 1.5)}px` : "16px",
                          height: isInputImage ? "120px" : isOutput ? "40px" : isFeatureMap ? `${Math.max(20, layer.dims[1] * 1.5)}px` : "16px",
                          background: isInputImage ? "transparent" : "rgba(5, 5, 8, 0.8)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          boxShadow: isActive ? "0 0 15px rgba(0, 212, 255, 0.4)" : "none",
                        }}
                      >
                        {isInputImage && (
                          <div className="w-full h-full relative group">
                            <img
                              src="/profile.jpg"
                              alt="Input Profile"
                              className="w-full h-full object-cover rounded-md"
                            />
                            {/* Scanning beam effect */}
                            {isActive && (
                              <motion.div
                                className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                              />
                            )}
                          </div>
                        )}

                        {isFeatureMap && (
                          <div className="w-full h-full opacity-60 mix-blend-screen overflow-hidden relative">
                            {/* Pseudo feature map visualization using noise/filters on the original image */}
                            {(isPast || isActive) && (
                              <img
                                src="/profile.jpg"
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                  filter:
                                    layerIdx === 1 ? `contrast(200%) grayscale(100%) invert(${nodeIdx % 2 * 100}%) hue-rotate(${nodeIdx * 90}deg)` :
                                      layerIdx === 2 ? `blur(1px) contrast(150%) hue-rotate(${nodeIdx * 45}deg)` :
                                        layerIdx === 3 ? `contrast(300%) grayscale(100%) brightness(150%) hue-rotate(${nodeIdx * 30}deg)` :
                                          `blur(2px) sepia(100%) hue-rotate(${nodeIdx * 60}deg)`,
                                  opacity: 0.7 + (Math.random() * 0.3)
                                }}
                                alt="feature map"
                              />
                            )}
                          </div>
                        )}

                        {layer.type === "flatten" || layer.type === "dense" ? (
                          <div
                            className="w-full h-full rounded-full"
                            style={{
                              background: (isPast || isActive)
                                ? `rgba(0, 212, 255, ${0.2 + Math.random() * 0.8})`
                                : "transparent"
                            }}
                          />
                        ) : null}

                        {isOutput && (
                          <div className="font-code text-xs font-bold w-full text-center px-2 flex items-center justify-center h-full">
                            {isActive || isPast ? (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[var(--accent-primary)] text-glow"
                              >
                                {layer.name.split(': ')[1]}
                              </motion.span>
                            ) : (
                              <span className="text-muted">Uncertain</span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Layer dimensions label below */}
                <div className="absolute -bottom-12 text-center text-[10px] font-code text-muted opacity-60 w-32 left-1/2 -translate-x-1/2">
                  {layer.type === 'dense' || layer.type === 'flatten' || layer.type === 'output'
                    ? `[${layer.size}]`
                    : `[${layer.dims[0]}x${layer.dims[1]}x${layer.size}]`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
