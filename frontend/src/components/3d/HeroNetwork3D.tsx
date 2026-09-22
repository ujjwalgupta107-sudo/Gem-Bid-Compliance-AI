"use client";
import React, { useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";

export interface NodeDetail {
  id: string;
  label: string;
  category: string;
  status: "Operational" | "Active" | "Verified" | "Running";
  description: string;
  purpose: string;
  checks: string[];
  lastSync: string;
  color: string;
  position: [number, number, number];
}

export const NETWORK_NODES: NodeDetail[] = [
  {
    id: "tender",
    label: "TENDER VERIFICATION",
    category: "Central Bid Target",
    status: "Active",
    description: "Primary government tender document undergoing automated multi-layer verification.",
    purpose: "Central evaluation source for compliance, eligibility & risk audit.",
    checks: ["RFP Document Structure", "EMD & Security Requirements", "Turnover & Eligibility Thresholds", "Technical Compliance"],
    lastSync: "Real-time",
    color: "#3b82f6",
    position: [0, 0, 0],
  },
  {
    id: "gstn",
    label: "GSTN NETWORK",
    category: "Government Registry",
    status: "Operational",
    description: "Direct API integration & sandbox verification with GST Network portal.",
    purpose: "GSTIN validation & tax filing compliance history checks.",
    checks: ["Registration Status (Active/Cancelled)", "Legal Name Matching", "Return Filing Regularity (GSTR-3B)", "Turnover Benchmarking"],
    lastSync: "2 mins ago",
    color: "#10b981",
    position: [4.5, 3.2, 1.5],
  },
  {
    id: "pan",
    label: "PAN / INCOME TAX",
    category: "Government Registry",
    status: "Operational",
    description: "Income Tax e-Filing database verification for taxpayer identity.",
    purpose: "Validate Bidder PAN, Entity Legal Status, and ITR compliance.",
    checks: ["PAN Validity & Entity Match", "ITR Filing History (Last 3 Years)", "Blacklist / Debarment Cross-check", "Tax Exemption Status"],
    lastSync: "5 mins ago",
    color: "#10b981",
    position: [-4.5, 3.2, 1.2],
  },
  {
    id: "udyam",
    label: "UDYAM MSME",
    category: "Government Registry",
    status: "Operational",
    description: "Ministry of MSME Udyam Registration Portal validation.",
    purpose: "Verify MSME status for tender purchase preference & EMD fee waiver eligibility.",
    checks: ["Udyam Registration Number", "Enterprise Classification (Micro/Small/Medium)", "NIC Code Alignment", "Purchase Preference Qualification"],
    lastSync: "1 min ago",
    color: "#10b981",
    position: [5.2, -1.2, 2.0],
  },
  {
    id: "documents",
    label: "DOCUMENTS OCR",
    category: "Document Intelligence",
    status: "Verified",
    description: "Multi-page OCR extraction and document layout analysis engine.",
    purpose: "Extract text, tables, seals, and certificates from scanned PDFs & images.",
    checks: ["Tender RFP PDF Analysis", "GST & PAN Certificate Extraction", "Financial Audited Balance Sheets", "Work Experience Certificates"],
    lastSync: "Real-time",
    color: "#60a5fa",
    position: [-5.2, -1.2, 1.8],
  },
  {
    id: "ai_engine",
    label: "AI ENGINE",
    category: "Intelligence Core",
    status: "Running",
    description: "RAG + LLM hybrid engine for semantic clause extraction and matching.",
    purpose: "Evaluate complex tender clauses against bidder submitted documentation.",
    checks: ["Requirement-to-Doc Semantic Mapping", "Deviations & Discrepancies Detection", "Ambiguity Flagging", "Automated Summary Generation"],
    lastSync: "Sub-second",
    color: "#8b5cf6",
    position: [0, -4.5, 1.0],
  },
  {
    id: "compliance",
    label: "COMPLIANCE ENGINE",
    category: "Rule Validation",
    status: "Running",
    description: "Deterministic government procurement rule evaluation matrix.",
    purpose: "Execute pass/fail verification rules against extracted tender criteria.",
    checks: ["Mandatory Doc Submission", "Turnover & Net Worth Criteria", "Past Work Order Equivalency", "Blacklist / Debarment Verification"],
    lastSync: "Sub-second",
    color: "#06b6d4",
    position: [3.8, -4.2, -1.0],
  },
  {
    id: "risk_engine",
    label: "RISK ENGINE",
    category: "Risk Intelligence",
    status: "Active",
    description: "Multi-dimensional risk scoring engine detecting anomalies and red flags.",
    purpose: "Synthesize compliance checks into overall risk level (LOW / MED / HIGH / CRITICAL).",
    checks: ["Shell Company Indicators", "Cross-document Name Mismatches", "Missing Mandatory Seals", "High Penalty History"],
    lastSync: "Real-time",
    color: "#f59e0b",
    position: [-3.8, -4.2, -1.0],
  },
  {
    id: "audit_trail",
    label: "AUDIT TRAIL",
    category: "Security & Governance",
    status: "Verified",
    description: "SHA-256 cryptographic chain recording all verification steps.",
    purpose: "Immutably log every verification decision, AI score, and officer action.",
    checks: ["Tamper-evident SHA-256 Hashes", "Timestamped Verification Logs", "Officer Sign-off Provenance", "Legal Admissibility Record"],
    lastSync: "Immutable",
    color: "#ec4899",
    position: [0, 4.8, -2.0],
  },
];

interface HeroNetwork3DProps {
  onSelectNode?: (node: NodeDetail) => void;
}

export function HeroNetwork3D({ onSelectNode }: HeroNetwork3DProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodeMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const pulseSpheresRef = useRef<{ mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; progress: number; speed: number }[]>([]);

  const [hoveredNode, setHoveredNode] = useState<NodeDetail | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleSceneReady = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    nodeMeshesRef.current.clear();
    pulseSpheresRef.current = [];

    const group = new THREE.Group();
    scene.add(group);

    // Build Nodes
    NETWORK_NODES.forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(...node.position);
      nodeGroup.userData = { id: node.id, nodeData: node };

      const color = new THREE.Color(node.color);

      if (node.id === "tender") {
        // Central 3D Octahedron Crystal
        const geom = new THREE.OctahedronGeometry(1.4, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.9,
          roughness: 0.1,
          emissive: color,
          emissiveIntensity: 0.4,
          wireframe: false,
        });
        const mesh = new THREE.Mesh(geom, mat);
        nodeGroup.add(mesh);

        // Wireframe outer shell
        const wireGeom = new THREE.OctahedronGeometry(1.6, 1);
        const wireMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.4 });
        const wireMesh = new THREE.Mesh(wireGeom, wireMat);
        wireMesh.name = "wireframe";
        nodeGroup.add(wireMesh);

        // Rotating Ring 1
        const ringGeom = new THREE.TorusGeometry(2.2, 0.04, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 });
        const ring1 = new THREE.Mesh(ringGeom, ringMat);
        ring1.rotation.x = Math.PI / 3;
        ring1.name = "ring1";
        nodeGroup.add(ring1);

        // Rotating Ring 2
        const ring2 = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 }));
        ring2.rotation.y = Math.PI / 4;
        ring2.name = "ring2";
        nodeGroup.add(ring2);
      } else {
        // Satellite Node Sphere
        const geom = new THREE.IcosahedronGeometry(0.65, 2);
        const mat = new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.7,
          roughness: 0.2,
          emissive: color,
          emissiveIntensity: 0.3,
        });
        const mesh = new THREE.Mesh(geom, mat);
        nodeGroup.add(mesh);

        // Outer Glow Sphere
        const glowGeom = new THREE.SphereGeometry(0.85, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.2,
          wireframe: true,
        });
        const glowMesh = new THREE.Mesh(glowGeom, glowMat);
        glowMesh.name = "glow";
        nodeGroup.add(glowMesh);
      }

      group.add(nodeGroup);
      nodeMeshesRef.current.set(node.id, nodeGroup);
    });

    // Build Laser Connections
    const tenderPos = new THREE.Vector3(0, 0, 0);

    NETWORK_NODES.filter((n) => n.id !== "tender").forEach((node) => {
      const targetPos = new THREE.Vector3(...node.position);

      const points = [tenderPos, targetPos];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineDashedMaterial({
        color: new THREE.Color(node.color),
        dashSize: 0.3,
        gapSize: 0.15,
        opacity: 0.6,
        transparent: true,
      });

      const line = new THREE.Line(lineGeom, lineMat);
      line.computeLineDistances();
      scene.add(line);

      // Data Pulse Particle
      const pulseGeom = new THREE.SphereGeometry(0.1, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
      const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
      scene.add(pulseMesh);

      pulseSpheresRef.current.push({
        mesh: pulseMesh,
        from: tenderPos,
        to: targetPos,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.008,
      });
    });
  };

  const handleRenderFrame = (time: number) => {
    // Animate central node
    const tenderGroup = nodeMeshesRef.current.get("tender");
    if (tenderGroup) {
      tenderGroup.rotation.y = time * 0.4;
      tenderGroup.rotation.x = Math.sin(time * 0.3) * 0.2;

      const ring1 = tenderGroup.getObjectByName("ring1");
      if (ring1) ring1.rotation.z = time * 0.8;

      const ring2 = tenderGroup.getObjectByName("ring2");
      if (ring2) ring2.rotation.z = -time * 0.6;
    }

    // Floating animation for nodes
    NETWORK_NODES.forEach((node, idx) => {
      const g = nodeMeshesRef.current.get(node.id);
      if (g && node.id !== "tender") {
        g.position.y = node.position[1] + Math.sin(time * 1.5 + idx) * 0.15;
        g.rotation.y = time * 0.3;
      }
    });

    // Move data pulses along lines
    pulseSpheresRef.current.forEach((pulse) => {
      pulse.progress += pulse.speed;
      if (pulse.progress > 1) pulse.progress = 0;
      pulse.mesh.position.lerpVectors(pulse.from, pulse.to, pulse.progress);
    });
  };

  // Raycasting for hover & click
  const handlePointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 - 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const objects: THREE.Object3D[] = [];
      nodeMeshesRef.current.forEach((group) => {
        group.children.forEach((child) => objects.push(child));
      });

      const intersects = raycaster.intersectObjects(objects, false);

      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData.nodeData) {
          parent = parent.parent;
        }

        if (parent && parent.userData.nodeData) {
          const nodeData = parent.userData.nodeData as NodeDetail;
          setHoveredNode(nodeData);
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          document.body.style.cursor = "pointer";
          return;
        }
      }

      setHoveredNode(null);
      document.body.style.cursor = "default";
    },
    []
  );

  const handleClick = useCallback(() => {
    if (hoveredNode && onSelectNode) {
      onSelectNode(hoveredNode);
    }
  }, [hoveredNode, onSelectNode]);

  return (
    <div
      className="relative w-full h-[520px] lg:h-[620px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-xl"
      onMouseMove={handlePointerMove}
      onClick={handleClick}
    >
      <SpatialCanvas onSceneReady={handleSceneReady} onRenderFrame={handleRenderFrame} />

      {/* Floating 3D Node Tooltip */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: `${Math.min(tooltipPos.x + 15, window.innerWidth > 768 ? 420 : 200)}px`,
            top: `${Math.max(tooltipPos.y - 40, 20)}px`,
          }}
        >
          <div className="w-72 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-blue-500/40 shadow-2xl shadow-blue-500/10 text-xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-mono font-bold tracking-wider uppercase text-blue-400 text-[10px]">
                {hoveredNode.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ● {hoveredNode.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{hoveredNode.label}</h4>
            <p className="text-slate-300 text-[11px] leading-relaxed mb-2.5">{hoveredNode.description}</p>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
              <span>Sync: {hoveredNode.lastSync}</span>
              <span className="text-blue-400 font-bold group-hover:underline">Click for Live Inspection →</span>
            </div>
          </div>
        </div>
      )}

      {/* Helper Legend */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span> Central Tender
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Registry API
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> AI & Rules
          </span>
        </div>
        <div className="text-slate-500 hidden sm:block">
          💡 Move cursor to rotate 3D view • Hover & click nodes for full audit details
        </div>
      </div>
    </div>
  );
}
