"use client";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";

export default function FeatureHybridEngine3D() {
  const groupRef = useRef<THREE.Group | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const leftNodeRef = useRef<THREE.Mesh | null>(null);
  const rightNodeRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<{ mesh: THREE.Mesh; side: "left"|"right"; progress: number; speed: number; }[]>([]);
  const hoverValue = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleSceneReady = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;
    group.scale.set(0.6, 0.6, 0.6);

    // 1. Center Core (Hybrid)
    const coreGeom = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0070f3, wireframe: true, emissive: 0x0070f3, emissiveIntensity: 0.8, transparent: true, opacity: 0.9
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    group.add(core);
    coreRef.current = core;

    const coreInnerGeom = new THREE.IcosahedronGeometry(0.8, 0);
    const coreInnerMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 0.5
    });
    const coreInner = new THREE.Mesh(coreInnerGeom, coreInnerMat);
    core.add(coreInner);

    // 2. Left Node (Deterministic Rules) - JSON Block shape
    const leftGeom = new THREE.BoxGeometry(1, 1, 1);
    const leftMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, wireframe: true, emissive: 0x10b981, emissiveIntensity: 0.5
    });
    const leftNode = new THREE.Mesh(leftGeom, leftMat);
    leftNode.position.set(-3.5, 2, -1);
    group.add(leftNode);
    leftNodeRef.current = leftNode;

    // 3. Right Node (RAG Vector) - Sphere shape
    const rightGeom = new THREE.SphereGeometry(0.8, 16, 16);
    const rightMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7, wireframe: true, emissive: 0xa855f7, emissiveIntensity: 0.5
    });
    const rightNode = new THREE.Mesh(rightGeom, rightMat);
    rightNode.position.set(3.5, 2, -1);
    group.add(rightNode);
    rightNodeRef.current = rightNode;

    // 4. Connecting Lines
    const createLine = (start: THREE.Vector3, end: THREE.Vector3, color: number) => {
      const points = [];
      points.push(start);
      // Add a slight curve
      points.push(new THREE.Vector3((start.x + end.x)/2, (start.y + end.y)/2 - 0.5, (start.z + end.z)/2));
      points.push(end);
      const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
      const pts = curve.getPoints(50);
      const lGeom = new THREE.BufferGeometry().setFromPoints(pts);
      const lMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.3 });
      group.add(new THREE.Line(lGeom, lMat));
      return curve;
    };

    const leftCurve = createLine(leftNode.position, core.position, 0x10b981);
    const rightCurve = createLine(rightNode.position, core.position, 0xa855f7);

    // 5. Particles Flowing
    const createParticle = (side: "left" | "right", color: number) => {
      const pGeom = new THREE.SphereGeometry(0.1, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
      const pMesh = new THREE.Mesh(pGeom, pMat);
      group.add(pMesh);
      particlesRef.current.push({
        mesh: pMesh,
        side,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.005
      });
    };

    for(let i=0; i<15; i++) {
      createParticle("left", 0x10b981);
      createParticle("right", 0xa855f7);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x0070f3, 3, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);
  };

  const handleRenderFrame = (time: number) => {
    const targetHover = isHovered ? 1 : 0;
    hoverValue.current = THREE.MathUtils.lerp(hoverValue.current, targetHover, 0.05);
    const h = hoverValue.current;

    if (groupRef.current) {
      groupRef.current.position.y = -0.5 + Math.sin(time * 1.2) * 0.15;
      groupRef.current.rotation.y = time * 0.1 + h * 0.2;
    }

    if (coreRef.current) {
      coreRef.current.rotation.x = time * (0.5 + h);
      coreRef.current.rotation.y = time * (0.3 + h);
      const scale = 1 + h * 0.3 + Math.sin(time * 5) * 0.05;
      coreRef.current.scale.setScalar(scale);
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8 + h * 0.8 + Math.sin(time * 10) * 0.2;
    }

    if (leftNodeRef.current && rightNodeRef.current) {
      leftNodeRef.current.rotation.x = time * 0.4;
      leftNodeRef.current.rotation.y = time * 0.6;
      
      rightNodeRef.current.rotation.x = time * 0.5;
      rightNodeRef.current.rotation.y = time * 0.5;
    }

    // Animate Particles
    particlesRef.current.forEach(p => {
      const speedMult = 1 + (h * 3); // Faster on hover
      p.progress += p.speed * speedMult;
      if (p.progress > 1) p.progress = 0;

      const start = p.side === "left" ? new THREE.Vector3(-3.5, 2, -1) : new THREE.Vector3(3.5, 2, -1);
      const end = new THREE.Vector3(0, 0, 0); // Core
      
      // Interpolate position along a slight curve
      const mid = new THREE.Vector3((start.x + end.x)/2, (start.y + end.y)/2 - 0.5, (start.z + end.z)/2);
      
      // Quadratic bezier manually
      const t = p.progress;
      const x = (1-t)*(1-t)*start.x + 2*(1-t)*t*mid.x + t*t*end.x;
      const y = (1-t)*(1-t)*start.y + 2*(1-t)*t*mid.y + t*t*end.y;
      const z = (1-t)*(1-t)*start.z + 2*(1-t)*t*mid.z + t*t*end.z;
      
      p.mesh.position.set(x, y, z);
      
      // Pulse size based on progress
      p.mesh.scale.setScalar(Math.sin(p.progress * Math.PI) * (1 + h));
    });
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
