"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const vertexShader = `
uniform float uProgress;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uViewport;
uniform vec2 uOffset;
uniform float uAspect;

attribute vec3 randomPosition;
attribute vec2 imageUV;

varying vec2 vUv;
varying float vProgress;

void main() {
  vUv = imageUV;
  
  // Initial random position scattered in 3D
  vec3 pos = randomPosition;
  
  // Add floating motion to scattered positions
  pos.x += sin(uTime * 0.5 + pos.y * 2.0) * 0.5;
  pos.y += cos(uTime * 0.3 + pos.x * 2.0) * 0.5;
  pos.z += sin(uTime * 0.4 + pos.z * 2.0) * 0.5;

  // Target position forms the image plane
  vec3 targetPos = vec3(
    (imageUV.x - 0.5) * 6.0 * uAspect + uOffset.x, 
    (imageUV.y - 0.5) * 6.0 + uOffset.y, 
    0.0
  );

  // Staggered assembly effect (smoother transition)
  float delay = (1.0 - imageUV.x) * 0.3 + fract(sin(dot(imageUV, vec2(12.9898, 78.233))) * 43758.5453) * 0.1;
  float p = clamp((uProgress - delay * 0.5) / 0.85, 0.0, 1.0);
  p = smoothstep(0.0, 1.0, p);

  // Mouse hover pixel spreading effect
  if (uProgress > 0.9) {
    vec2 mouseWorld = vec2(uMouse.x * uViewport.x * 0.5, uMouse.y * uViewport.y * 0.5);
    float dist = distance(mouseWorld, targetPos.xy);
    
    float hoverRadius = 4.0;
    if (dist < hoverRadius) {
      vec2 dir = normalize(targetPos.xy - mouseWorld);
      float strength = pow(1.0 - (dist / hoverRadius), 2.5);
      
      // Disperse the particles back to their scattered state
      p = mix(p, 0.0, strength * 0.85);
      
      // Add a cinematic outward blast
      targetPos.xy += dir * strength * 1.5;
      targetPos.z += strength * 2.5;
    }
  }

  vProgress = p;

  vec3 finalPos = mix(pos, targetPos, p);

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Particle size varies by depth and assembly progress
  gl_PointSize = (12.0 / -mvPosition.z) * mix(0.5, 1.5, p);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uProgress;
uniform float uTime;

varying vec2 vUv;
varying float vProgress;

void main() {
  // Make particles circular
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;

  // Sample image
  vec4 texColor = texture2D(uTexture, vUv);
  
  // Neon Cyberpunk colors
  vec3 neonBlue = vec3(0.0, 0.83, 1.0); // #00d4ff
  vec3 neonPurple = vec3(0.48, 0.22, 0.93); // #7c3aed
  
  // Base glowing color based on UV
  vec3 baseGlow = mix(neonBlue, neonPurple, vUv.y + sin(uTime) * 0.1);
  
  // Final color transitions from neon glow to actual image colors
  vec3 finalColor = mix(baseGlow, texColor.rgb, vProgress * 0.8);
  
  // Add pulsing glow intensity
  float pulse = 1.0 + 0.2 * sin(uTime * 2.0 + vUv.x * 10.0);
  finalColor *= mix(2.0, 1.2 * pulse, vProgress);
  
  // Alpha fading at edges of circle
  float alpha = smoothstep(0.5, 0.2, dist) * mix(0.6, 1.0, vProgress);
  
  gl_FragColor = vec4(finalColor, alpha * texColor.a);
}
`;

const Particles = () => {
  const texture = useTexture("/profile.jpg");
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const mouseRef = useRef(new THREE.Vector2(-10, -10)); // Start far off-screen

  // Determine aspect ratio from texture
  const aspect = texture.image ? (texture.image as any).width / (texture.image as any).height : 1.0;

  // Position offset (right side for desktop, center for mobile)
  const isMobile = viewport.width < 10;
  const targetXOffset = isMobile ? 0 : viewport.width * 0.25;

  // Resolution of particle grid
  const width = 200;
  const height = 200;
  const count = width * height;

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const randomPositions = new Float32Array(count * 3);
    const imageUVs = new Float32Array(count * 2);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const index = i * height + j;

        // UVs
        const u = i / width;
        const v = j / height;
        imageUVs[index * 2] = u;
        imageUVs[index * 2 + 1] = v;

        // Scattered start positions (spherical cloud)
        const radius = 15 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        randomPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        randomPositions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        randomPositions[index * 3 + 2] = radius * Math.cos(phi);

        // Init zero
        positions[index * 3] = 0;
        positions[index * 3 + 1] = 0;
        positions[index * 3 + 2] = 0;
      }
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("randomPosition", new THREE.BufferAttribute(randomPositions, 3));
    geom.setAttribute("imageUV", new THREE.BufferAttribute(imageUVs, 2));

    return geom;
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(-10, -10) },
    uViewport: { value: new THREE.Vector2(viewport.width, viewport.height) },
    uOffset: { value: new THREE.Vector2(targetXOffset, 0) },
    uAspect: { value: aspect }
  }), [texture, aspect, targetXOffset, viewport.width, viewport.height]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uOffset.value.x = targetXOffset;
      materialRef.current.uniforms.uViewport.value.set(viewport.width, viewport.height);
    }
  }, [targetXOffset, viewport]);

  // Handle Mouse Hover
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Map to Normalized Device Coordinates (-1 to +1)
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP Assembly Animation
  useEffect(() => {
    if (!materialRef.current) return;

    // Start scattered, assemble into image
    gsap.fromTo(materialRef.current.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration: 1.5,
        ease: "power2.inOut",
        delay: 0
      }
    );
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly interpolate mouse position for fluid pixel displacement
      materialRef.current.uniforms.uMouse.value.lerp(mouseRef.current, 0.15);
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export function ParticleHeroCanvas() {
  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: false, alpha: true }}>
        <color attach="background" args={["#050508"]} />
        <ambientLight intensity={0.5} />
        <React.Suspense fallback={null}>
          <Particles />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
