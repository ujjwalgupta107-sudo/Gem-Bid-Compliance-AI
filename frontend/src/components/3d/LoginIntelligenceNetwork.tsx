"use client";
import React, { useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";
import NodeDetailModal from "./NodeDetailModal";

const NODES = [
  { id: "gstn", label: "GSTN", description: "Government Registry Verification\nStatus: Operational", color: "#10b981", pos: [-3, 2, 0] },
  { id: "pan", label: "PAN", description: "Identity / Tax Verification", color: "#3b82f6", pos: [-4, -1, 1] },
  { id: "udyam", label: "UDYAM", description: "MSME Verification\nStatus: Operational", color: "#f59e0b", pos: [-2, -3, 0] },
  { id: "docs", label: "DOCUMENTS", description: "Requirement extraction & OCR", color: "#8b5cf6", pos: [3, 2.5, 1] },
  { id: "ai", label: "AI ENGINE", description: "Mismatch detection & Rule processing", color: "#ec4899", pos: [4.5, 0, -1] },
  { id: "risk", label: "RISK", description: "Anomaly & Risk analysis", color: "#ef4444", pos: [3, -2.5, 0] },
  { id: "audit", label: "AUDIT", description: "Tamper-evident verification history", color: "#64748b", pos: [0, -3.5, 2] },
];

export default function LoginIntelligenceNetwork() {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  
  const nodesRef = useRef<{ id: string; mesh: THREE.Group; pos: THREE.Vector3; baseAngle: number; radius: number }[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  const particlesRef = useRef<{ mesh: THREE.Mesh; fromId: string; progress: number; speed: number }[]>([]);

  const [hoveredNode, setHoveredNode] = useState<{ label: string; description: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleSceneReady = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    nodesRef.current = [];
    linesRef.current = [];
    particlesRef.current = [];

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Center Core (Bid Compliance Engine)
    const coreGeom = new THREE.OctahedronGeometry(1.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    group.add(coreMesh);

    const wireGeom = new THREE.IcosahedronGeometry(1.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.2 });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    coreMesh.add(wireMesh);

    // Orbital Nodes
    NODES.forEach((nodeData, idx) => {
      const nodeGroup = new THREE.Group();
      const vecPos = new THREE.Vector3(...nodeData.pos);
      nodeGroup.position.copy(vecPos);
      nodeGroup.userData = { id: nodeData.id, label: nodeData.label, description: nodeData.description };

      const radius = vecPos.length();
      const baseAngle = Math.atan2(vecPos.z, vecPos.x);

      // Node Sphere
      const geom = new THREE.SphereGeometry(0.4, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: nodeData.color,
        emissive: nodeData.color,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(geom, mat);
      nodeGroup.add(mesh);

      // Node Label (Sprite)
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(nodeData.label, 128, 40);
      }
      const tex = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(3, 0.75, 1);
      sprite.position.y = -0.8;
      nodeGroup.add(sprite);

      group.add(nodeGroup);
      nodesRef.current.push({ id: nodeData.id, mesh: nodeGroup, pos: vecPos, baseAngle, radius });

      // Connection Line to Center
      const points = [new THREE.Vector3(0, 0, 0), vecPos];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: nodeData.color, transparent: true, opacity: 0.3 });
      const line = new THREE.Line(lineGeom, lineMat);
      group.add(line);
      linesRef.current.push(line);

      // Data Particles traveling
      for (let i = 0; i < 2; i++) {
        const pGeom = new THREE.SphereGeometry(0.08, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pMesh = new THREE.Mesh(pGeom, pMat);
        group.add(pMesh);
        particlesRef.current.push({
          mesh: pMesh,
          fromId: nodeData.id,
          progress: i * 0.5,
          speed: 0.005 + Math.random() * 0.005,
        });
      }
    });

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x38bdf8, 2, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);
  };

  const handleRenderFrame = (time: number) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
      
      const core = groupRef.current.children[0];
      if (core) {
        core.rotation.x = time * 0.2;
        core.rotation.y = time * 0.3;
      }
    }

    // Animate lines and particles
    nodesRef.current.forEach((node, idx) => {
      // Gentle orbit variation
      node.mesh.position.y = node.pos.y + Math.sin(time + idx) * 0.3;
      
      const line = linesRef.current[idx];
      if (line) {
        const posAttr = line.geometry.attributes.position as THREE.BufferAttribute;
        posAttr.setXYZ(1, node.mesh.position.x, node.mesh.position.y, node.mesh.position.z);
        posAttr.needsUpdate = true;
      }
    });

    particlesRef.current.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1) p.progress = 0;

      const node = nodesRef.current.find(n => n.id === p.fromId);
      if (node) {
        // Ping pong from center to node
        const t = (Math.sin(p.progress * Math.PI * 2) + 1) / 2;
        p.mesh.position.lerpVectors(new THREE.Vector3(0,0,0), node.mesh.position, t);
      }
    });
  };

  const handlePointerMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current || !cameraRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 - 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const objects: THREE.Object3D[] = [];
    nodesRef.current.forEach((n) => {
      n.mesh.children.forEach(c => objects.push(c));
    });

    const intersects = raycaster.intersectObjects(objects, false);
    if (intersects.length > 0) {
      let parent = intersects[0].object.parent;
      while (parent && !parent.userData.id) {
        parent = parent.parent;
      }
      if (parent && parent.userData.id) {
        setHoveredNode({ label: parent.userData.label, description: parent.userData.description });
        setTooltipPos({ x: e.clientX, y: e.clientY });
        document.body.style.cursor = "pointer";
        return;
      }
    }
    setHoveredNode(null);
    document.body.style.cursor = "auto";
  }, []);

  const handlePointerLeave = () => {
    setHoveredNode(null);
    document.body.style.cursor = "auto";
  };

  return (
    <div className="absolute inset-0 z-0" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <SpatialCanvas
        onSceneReady={handleSceneReady}
        onRenderFrame={handleRenderFrame}
      />
      {hoveredNode && (
        <div
          className="fixed z-50 bg-slate-900/90 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none transform -translate-x-1/2 -translate-y-[120%]"
          style={{ left: tooltipPos.x, top: tooltipPos.y, minWidth: "200px" }}
        >
          <div className="text-xs font-bold text-amber-400 mb-1 tracking-wider uppercase">
            {hoveredNode.label}
          </div>
          <div className="text-sm text-slate-200 whitespace-pre-line leading-relaxed">
            {hoveredNode.description}
          </div>
        </div>
      )}
    </div>
  );
}
