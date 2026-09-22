"use client";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";

export default function FeatureAuditChain3D() {
  const groupRef = useRef<THREE.Group | null>(null);
  const blocksRef = useRef<{ group: THREE.Group; core: THREE.Mesh; text: THREE.Sprite }[]>([]);
  const lineRef = useRef<THREE.Line | null>(null);
  const signalRef = useRef<THREE.Mesh | null>(null);
  
  const hoverValue = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleSceneReady = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;
    group.scale.set(0.7, 0.7, 0.7);
    group.position.set(0, -0.5, 0);

    const labels = ["[BID]", "[VERIFY]", "[RESULT]", "[AUDIT]"];
    const blockPositions = [
      new THREE.Vector3(-3.5, 3.5, -2),
      new THREE.Vector3(-1.5, 2, -1),
      new THREE.Vector3(1.5, 0.5, 0),
      new THREE.Vector3(3.5, -1, 1),
    ];

    // Create Path for Signal
    const curve = new THREE.CatmullRomCurve3(blockPositions);
    const pts = curve.getPoints(100);
    const lGeom = new THREE.BufferGeometry().setFromPoints(pts);
    const lMat = new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.3 });
    const line = new THREE.Line(lGeom, lMat);
    group.add(line);
    lineRef.current = line;

    // Signal Particle
    const sigGeom = new THREE.SphereGeometry(0.2, 16, 16);
    const sigMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const signal = new THREE.Mesh(sigGeom, sigMat);
    group.add(signal);
    signalRef.current = signal;

    // Create Blocks
    blockPositions.forEach((pos, idx) => {
      const blockGroup = new THREE.Group();
      blockGroup.position.copy(pos);

      // Outer Glass Box
      const outGeom = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const outMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.1,
        transmission: 0.9, // glass effect
        opacity: 1,
        transparent: true,
      });
      const outMesh = new THREE.Mesh(outGeom, outMat);
      
      const outEdges = new THREE.EdgesGeometry(outGeom);
      const outWire = new THREE.LineSegments(outEdges, new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.5 }));
      outMesh.add(outWire);
      blockGroup.add(outMesh);

      // Inner Core
      const coreGeom = new THREE.BoxGeometry(0.6, 0.6, 0.6);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.2
      });
      const coreMesh = new THREE.Mesh(coreGeom, coreMat);
      blockGroup.add(coreMesh);

      // Text Sprite
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, 256, 128);
        ctx.fillStyle = "#00f5ff";
        ctx.font = "bold 32px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labels[idx], 128, 64);
        
        ctx.fillStyle = "#10b981";
        ctx.font = "20px monospace";
        ctx.fillText("SHA-256 ✓", 128, 96);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const sMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(sMat);
      sprite.scale.set(2, 1, 1);
      sprite.position.y = 1.2; // Above block
      blockGroup.add(sprite);

      group.add(blockGroup);
      blocksRef.current.push({ group: blockGroup, core: coreMesh, text: sprite });
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f5ff, 2, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);
  };

  const handleRenderFrame = (time: number) => {
    const targetHover = isHovered ? 1 : 0;
    hoverValue.current = THREE.MathUtils.lerp(hoverValue.current, targetHover, 0.05);
    const h = hoverValue.current;

    if (groupRef.current) {
      groupRef.current.position.y = -0.5 + Math.sin(time) * 0.2;
      groupRef.current.rotation.y = time * 0.1;
      
      // On hover, tilt forward slightly
      groupRef.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI * 0.1, h);
    }

    // Animate Signal along curve
    if (signalRef.current && lineRef.current) {
      const speed = 0.5 + h; // Faster on hover
      const progress = (time * speed) % 1;
      
      // Re-create curve since we don't have it saved globally in this scope easily without ref,
      // but we know it's a fixed path. For performance, we'll just lerp through blocks.
      const totalBlocks = blocksRef.current.length;
      const idx = Math.floor(progress * (totalBlocks - 1));
      const nextIdx = Math.min(idx + 1, totalBlocks - 1);
      
      const p1 = blocksRef.current[idx].group.position;
      const p2 = blocksRef.current[nextIdx].group.position;
      
      const localProgress = (progress * (totalBlocks - 1)) - idx;
      signalRef.current.position.lerpVectors(p1, p2, localProgress);
      
      // Make it glow
      const sMat = signalRef.current.material as THREE.MeshBasicMaterial;
      sMat.color.setHex(0x10b981);
      
      // Highlight blocks when signal is near
      blocksRef.current.forEach((b, bIdx) => {
        const dist = signalRef.current!.position.distanceTo(b.group.position);
        const intensity = Math.max(0, 1 - dist);
        
        const cMat = b.core.material as THREE.MeshStandardMaterial;
        cMat.emissiveIntensity = 0.2 + intensity * 2 + h * 0.5;
        
        b.core.rotation.x = time + bIdx;
        b.core.rotation.y = time * 1.5 + bIdx;

        // Bring hovered blocks forward on global hover
        b.group.position.z = bIdx === 1 ? -1 + (h * 1) : bIdx === 2 ? 0 + (h * 1) : b.group.position.z;
        b.text.material.opacity = 0.5 + intensity * 0.5 + h * 0.5;
      });
    }
  };

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-auto"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <SpatialCanvas
        onSceneReady={handleSceneReady}
        onRenderFrame={handleRenderFrame}
      />
    </div>
  );
}
