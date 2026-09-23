"use client";
import React, { useRef } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";

export default function DashboardMockup3D() {
  const groupRef = useRef<THREE.Group | null>(null);
  const laserRef = useRef<THREE.Mesh | null>(null);
  const pillsRef = useRef<{ mesh: THREE.Group; targetY: number; delay: number }[]>([]);
  const ringRef = useRef<THREE.Mesh | null>(null);

  const handleSceneReady = (scene: THREE.Scene, _camera: THREE.PerspectiveCamera, _renderer: THREE.WebGLRenderer) => {
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Angle the whole mockup
    group.rotation.x = -Math.PI * 0.15;
    group.rotation.y = -Math.PI * 0.1;
    group.position.x = 1.8; // Shifted right for better visibility
    group.position.z = 0;

    // 1. Dashboard Base / Document Plane
    const docGeom = new THREE.PlaneGeometry(6, 4);
    const docMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Slate 900
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x020617,
      transparent: true,
      opacity: 0.9,
    });
    const docMesh = new THREE.Mesh(docGeom, docMat);
    group.add(docMesh);

    // Border for Document
    const edges = new THREE.EdgesGeometry(docGeom);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.3 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    docMesh.add(wireframe);

    // Document mock lines
    for (let i = 0; i < 8; i++) {
      const lineGeom = new THREE.PlaneGeometry(3 + Math.random() * 1.5, 0.05);
      const lMat = new THREE.MeshBasicMaterial({ color: 0x334155 }); // Slate 700
      const lMesh = new THREE.Mesh(lineGeom, lMat);
      lMesh.position.set(-0.5, 1.2 - i * 0.3, 0.01);
      docMesh.add(lMesh);
    }

    // 2. Cyan Scanning Laser
    const laserGeom = new THREE.PlaneGeometry(7, 0.05);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.8 });
    const laser = new THREE.Mesh(laserGeom, laserMat);
    laser.position.z = 0.1;
    group.add(laser);
    laserRef.current = laser;

    // Laser Glow
    const glowGeom = new THREE.PlaneGeometry(7, 0.3);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Mesh(glowGeom, glowMat);
    laser.add(glow);

    // 3. Verification Pills
    const createPill = (text: string, color: number, x: number, targetY: number, delay: number) => {
      const pillGroup = new THREE.Group();
      pillGroup.position.set(x, -3, 0.5); // Start hidden below

      // Pill Background
      const pGeom = new THREE.BoxGeometry(2.2, 0.4, 0.1);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x0b0f17,
        emissive: color,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9,
      });
      const pMesh = new THREE.Mesh(pGeom, pMat);
      
      const pEdges = new THREE.EdgesGeometry(pGeom);
      const pWire = new THREE.LineSegments(pEdges, new THREE.LineBasicMaterial({ color: color, opacity: 0.5, transparent: true }));
      pMesh.add(pWire);
      pillGroup.add(pMesh);

      // Text Sprite
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, 512, 128);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 36px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 256, 64);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const sMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const sprite = new THREE.Sprite(sMat);
      sprite.scale.set(3, 0.75, 1);
      sprite.position.z = 0.1;
      pillGroup.add(sprite);

      group.add(pillGroup);
      pillsRef.current.push({ mesh: pillGroup, targetY, delay });
    };

    createPill("GSTIN: Verified ✓", 0x10b981, 1.8, 1.2, 0);
    createPill("Udyam: Valid ✓", 0x10b981, 1.8, 0.6, 2);
    createPill("Debarment: Clean ✓", 0x10b981, 1.8, 0.0, 4);

    // 4. Circular Radial Score (98.4%)
    const ringGroup = new THREE.Group();
    ringGroup.position.set(1.8, -1.2, 0.2);

    const ringBgGeom = new THREE.RingGeometry(0.5, 0.6, 32);
    const ringBgMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, side: THREE.DoubleSide });
    const ringBg = new THREE.Mesh(ringBgGeom, ringBgMat);
    ringGroup.add(ringBg);

    const ringGeom = new THREE.RingGeometry(0.5, 0.6, 32, 1, 0, Math.PI * 2 * 0.984);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ringGroup.add(ring);
    ringRef.current = ring;

    // Score Text
    const sCanvas = document.createElement("canvas");
    sCanvas.width = 256;
    sCanvas.height = 256;
    const sCtx = sCanvas.getContext("2d");
    if (sCtx) {
      sCtx.fillStyle = "#00f5ff";
      sCtx.font = "bold 64px Inter, sans-serif";
      sCtx.textAlign = "center";
      sCtx.textBaseline = "middle";
      sCtx.fillText("98%", 128, 128);
    }
    const sTex = new THREE.CanvasTexture(sCanvas);
    const ssMat = new THREE.SpriteMaterial({ map: sTex, transparent: true });
    const sSprite = new THREE.Sprite(ssMat);
    sSprite.scale.set(1.2, 1.2, 1);
    ringGroup.add(sSprite);

    group.add(ringGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f5ff, 2, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);
  };

  const handleRenderFrame = (time: number) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.15;
      groupRef.current.rotation.x = -Math.PI * 0.15 + Math.sin(time * 0.5) * 0.02;
    }

    if (laserRef.current) {
      // Scanning motion up and down
      laserRef.current.position.y = Math.sin(time * 1.5) * 1.8;
    }

    if (ringRef.current) {
      // Subtle pulse or rotation
      ringRef.current.rotation.z = -time * 0.2;
    }

    // Animate pills popping up
    pillsRef.current.forEach(pill => {
      if (time > pill.delay) {
        pill.mesh.position.y = THREE.MathUtils.lerp(pill.mesh.position.y, pill.targetY, 0.05);
      }
    });
  };

  return (
    <div className="w-full h-full min-h-[500px] relative pointer-events-none">
      <SpatialCanvas
        onSceneReady={handleSceneReady}
        onRenderFrame={handleRenderFrame}
      />
    </div>
  );
}
