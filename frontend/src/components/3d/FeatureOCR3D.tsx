"use client";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";

export default function FeatureOCR3D() {
  const groupRef = useRef<THREE.Group | null>(null);
  const documentRef = useRef<THREE.Group | null>(null);
  const laserRef = useRef<THREE.Mesh | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const boxesRef = useRef<{ mesh: THREE.Group; type: string; baseZ: number; speed: number; phase: number }[]>([]);
  const hoverValue = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleSceneReady = (scene: THREE.Scene) => {
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;
    
    // Scale down to fit card
    group.scale.set(0.6, 0.6, 0.6);
    group.position.set(0, -0.5, 0);

    // 1. Core / AI Brain (Top right)
    const coreGeom = new THREE.OctahedronGeometry(0.8, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f5ff, wireframe: true, emissive: 0x00f5ff, emissiveIntensity: 0.5
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.position.set(2, 2, -1);
    group.add(core);
    coreRef.current = core;

    // 2. Document Group
    const docGroup = new THREE.Group();
    docGroup.rotation.x = -Math.PI * 0.1;
    docGroup.position.set(-1, -1, 0);
    group.add(docGroup);
    documentRef.current = docGroup;

    // Document Base Plane
    const docGeom = new THREE.PlaneGeometry(3, 4);
    const docMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, metalness: 0.5, roughness: 0.5, transparent: true, opacity: 0.8
    });
    const docMesh = new THREE.Mesh(docGeom, docMat);
    docGroup.add(docMesh);

    // Document Grid / Lines
    const edges = new THREE.EdgesGeometry(docGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x334155 });
    docMesh.add(new THREE.LineSegments(edges, lineMat));

    // Bounding Boxes / Extracted Elements
    const createBox = (y: number, w: number, h: number, color: number) => {
      const boxGroup = new THREE.Group();
      boxGroup.position.set(0, y, 0.05);
      
      const bGeom = new THREE.PlaneGeometry(w, h);
      const bMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
      const bMesh = new THREE.Mesh(bGeom, bMat);
      
      const bEdges = new THREE.EdgesGeometry(bGeom);
      const bWire = new THREE.LineSegments(bEdges, new THREE.LineBasicMaterial({ color }));
      bMesh.add(bWire);
      boxGroup.add(bMesh);
      
      docGroup.add(boxGroup);
      boxesRef.current.push({ mesh: boxGroup, type: "data", baseZ: 0.05, speed: Math.random() * 2 + 1, phase: Math.random() * Math.PI * 2 });
    };

    // Text lines
    createBox(1.2, 2, 0.2, 0x00f5ff); // Header
    createBox(0.8, 1.5, 0.15, 0x0070f3);
    createBox(0.5, 2.5, 0.15, 0x0070f3);
    createBox(0.2, 2.2, 0.15, 0x0070f3);
    // Table
    createBox(-0.5, 2.6, 1.2, 0x10b981); // Table block
    createBox(-1.5, 1, 0.2, 0x00f5ff); // Footer amount

    // 3. Scanning Laser
    const laserGeom = new THREE.PlaneGeometry(4, 0.05);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const laser = new THREE.Mesh(laserGeom, laserMat);
    laser.position.z = 0.1;
    docGroup.add(laser);
    laserRef.current = laser;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f5ff, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);
  };

  const handleRenderFrame = (time: number) => {
    // Lerp hover value
    const targetHover = isHovered ? 1 : 0;
    hoverValue.current = THREE.MathUtils.lerp(hoverValue.current, targetHover, 0.05);
    const h = hoverValue.current;

    if (groupRef.current) {
      groupRef.current.position.y = -0.5 + Math.sin(time * 1.5) * 0.1; // Gentle float
    }

    if (documentRef.current) {
      // Tilt toward user on hover
      documentRef.current.rotation.x = THREE.MathUtils.lerp(-Math.PI * 0.1, 0, h);
      documentRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.1, h);
    }

    if (laserRef.current) {
      // Laser scan up and down
      const speed = 1.5 + (h * 2); // Faster scan on hover
      laserRef.current.position.y = Math.sin(time * speed) * 1.8;
      laserRef.current.material.opacity = 0.5 + (Math.sin(time * 10) * 0.2); // Flicker
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = time * (0.5 + h);
      coreRef.current.rotation.x = time * (0.3 + h);
      coreRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.05 * h);
    }

    // Boxes pop out and float toward core on hover
    boxesRef.current.forEach(box => {
      // Pop out z-axis
      box.mesh.position.z = box.baseZ + (h * (0.2 + Math.sin(time * box.speed + box.phase) * 0.1));
      
      // If fully hovered, occasionally emit a particle toward the core
      // (For simplicity and performance, we'll just vibrate them slightly)
      if (h > 0.5) {
        box.mesh.position.x = Math.sin(time * 10 + box.phase) * 0.02 * h;
      } else {
        box.mesh.position.x = 0;
      }
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
