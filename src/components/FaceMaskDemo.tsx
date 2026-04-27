'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface Detection {
  box: [number, number, number, number]; // [x1, y1, x2, y2]
  label: string; // 'Mask' or 'No Mask'
  confidence: number;
}

export function FaceMaskDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const requestRef = useRef<number | null>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError('Could not access the camera. Please allow camera permissions.');
      console.error('Error accessing media devices.', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;

    // To prevent sending too many requests, we can throttle here, but let's just 
    // send the next frame once the previous is done.
    if (!isProcessing) {
      setIsProcessing(true);
      
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);

        try {
          // Assuming your python backend is running on localhost:8000
          const response = await fetch('http://localhost:8000/detect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
          });

          if (response.ok) {
            const data: Detection[] = await response.json();
            drawDetections(data);
          }
        } catch (err) {
          console.error('Error sending frame to API', err);
          // Don't spam errors on the UI to avoid flickering, just silently fail and try next frame
        }
      }
      setIsProcessing(false);
    }

    requestRef.current = requestAnimationFrame(processFrame);
  }, [isStreaming, isProcessing]);

  useEffect(() => {
    if (isStreaming) {
      requestRef.current = requestAnimationFrame(processFrame);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isStreaming, processFrame]);

  const drawDetections = (detections: Detection[]) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(det => {
      const [x1, y1, x2, y2] = det.box;
      const width = x2 - x1;
      const height = y2 - y1;
      const isMask = det.label.toLowerCase().includes('mask') && !det.label.toLowerCase().includes('no');
      const color = isMask ? '#00FF00' : '#FF0000'; // Green for mask, Red for no mask

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);

      // Draw label background
      ctx.fillStyle = color;
      const text = `${det.label} (${(det.confidence * 100).toFixed(1)}%)`;
      ctx.font = '16px Arial';
      const textWidth = ctx.measureText(text).width;
      ctx.fillRect(x1, y1 - 25, textWidth + 10, 25);

      // Draw text
      ctx.fillStyle = '#000000';
      ctx.fillText(text, x1 + 5, y1 - 7);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 w-full max-w-3xl mx-auto rounded-xl bg-black/40 border border-neutral-800 backdrop-blur-md">
      <div className="text-center space-y-2 mb-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Real-Time Face Mask Detection</h2>
        <p className="text-neutral-400 text-sm">
          Uses a PyTorch face detection model and an EfficientNetB0 Keras model to classify face masks in real-time.
        </p>
      </div>

      <div className="relative w-full aspect-video bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center border border-neutral-800 shadow-2xl">
        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 z-10 bg-black/60">
            <CameraOff size={48} className="mb-4 opacity-50" />
            <p className="mb-6 font-medium text-sm tracking-wide">CAMERA IS OFFLINE</p>
            <button 
              onClick={startCamera}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "8px",
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "var(--accent-primary)",
                fontFamily: "var(--font-code)",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 0 15px rgba(0,212,255,0.1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,212,255,0.2)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0,212,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,212,255,0.1)";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0,212,255,0.1)";
              }}
            >
              <Camera size={16} /> INITIALIZE FEED
            </button>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 right-4 z-20 bg-red-500/20 text-red-400 p-3 rounded-md flex items-center border border-red-500/30 text-sm">
            <AlertCircle size={16} className="mr-2 shrink-0" />
            {error}
          </div>
        )}

        {/* Video feed */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`absolute inset-0 w-full h-full object-cover ${!isStreaming ? 'hidden' : ''}`}
        />
        
        {/* Canvas for drawing bounding boxes overlay */}
        <canvas 
          ref={canvasRef} 
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${!isStreaming ? 'hidden' : ''}`}
        />
      </div>

      {isStreaming && (
        <div className="flex justify-center w-full mt-4">
          <button 
            onClick={stopCamera}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              borderRadius: "8px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              fontFamily: "var(--font-code)",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            }}
          >
            <CameraOff size={16} /> TERMINATE FEED
          </button>
        </div>
      )}
    </div>
  );
}
