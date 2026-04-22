"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Node {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
}

function NeuralGraph() {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<Node[]>([]);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const NODE_COUNT = 80;
  const EDGE_PROBABILITY = 0.3;

  // Generate nodes
  const nodes = useMemo<Node[]>(() => {
    return Array.from({ length: NODE_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.3) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.001
      ),
      color: Math.random() > 0.5 ? "#00d4ff" : "#7c3aed"
    }));
  }, []);

  nodesRef.current = nodes;

  // Generate edges
  const edges = useMemo(() => {
    const pairs: [number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < 6 && Math.random() < EDGE_PROBABILITY) {
          pairs.push([i, j]);
        }
      }
    }
    return pairs;
  }, [nodes]);

  // Points geometry
  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(NODE_COUNT * 3);

    nodes.forEach((node, i) => {
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;

      const c = new THREE.Color(node.color);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    });

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [nodes]);

  // Lines geometry
  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 6);

    edges.forEach(([i, j], idx) => {
      positions[idx * 6] = nodes[i].position.x;
      positions[idx * 6 + 1] = nodes[i].position.y;
      positions[idx * 6 + 2] = nodes[i].position.z;
      positions[idx * 6 + 3] = nodes[j].position.x;
      positions[idx * 6 + 4] = nodes[j].position.y;
      positions[idx * 6 + 5] = nodes[j].position.z;
    });

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodes, edges]);

  // Animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04;
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.08;
    }

    // Pulsing node sizes done via shader time — use scale trick
    if (pointsRef.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.15;
      (pointsRef.current.material as THREE.PointsMaterial).size =
        scale * 0.12;
    }

    // Update line positions for drift
    nodesRef.current.forEach(node => {
      node.position.add(node.velocity);
      if (Math.abs(node.position.x) > 10) node.velocity.x *= -1;
      if (Math.abs(node.position.y) > 7) node.velocity.y *= -1;
      if (Math.abs(node.position.z) > 5) node.velocity.z *= -1;
    });

    if (pointsRef.current) {
      const posArr = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      nodesRef.current.forEach((node, i) => {
        posArr[i * 3] = node.position.x;
        posArr[i * 3 + 1] = node.position.y;
        posArr[i * 3 + 2] = node.position.z;
      });
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (linesRef.current) {
      const posArr = linesRef.current.geometry.attributes.position
        .array as Float32Array;
      edges.forEach(([i, j], idx) => {
        posArr[idx * 6] = nodesRef.current[i].position.x;
        posArr[idx * 6 + 1] = nodesRef.current[i].position.y;
        posArr[idx * 6 + 2] = nodesRef.current[i].position.z;
        posArr[idx * 6 + 3] = nodesRef.current[j].position.x;
        posArr[idx * 6 + 4] = nodesRef.current[j].position.y;
        posArr[idx * 6 + 5] = nodesRef.current[j].position.z;
      });
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[3, 0, 0]}>
      <points ref={pointsRef} geometry={pointsGeometry}>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.12}
        />
      </lineSegments>
    </group>
  );
}

export function NeuralCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 60 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <NeuralGraph />
    </Canvas>
  );
}
