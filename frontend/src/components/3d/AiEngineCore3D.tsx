"use client";
import React from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";
import { Cpu, Zap, Search, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";

const AI_FEATURES = [
  { title: "OCR Parsing", desc: "Extract text from scanned PDFs & seals", icon: Sparkles },
  { title: "Requirement Extraction", desc: "Isolate mandatory RFP qualification criteria", icon: Search },
  { title: "Document Comparison", desc: "Cross-check submitted docs against RFP rules", icon: Zap },
  { title: "Mismatch Detection", desc: "Detect name, date & turnover discrepancies", icon: ShieldAlert },
  { title: "RAG Semantic Retrieval", desc: "Hybrid vector search across tender clauses", icon: Cpu },
  { title: "Compliance Scoring", desc: "Automated mathematical evaluation index", icon: CheckCircle },
];

export function AiEngineCore3D() {
  const handleSceneReady = (scene: THREE.Scene) => {
    // AI Core Sphere
    const coreGeom = new THREE.IcosahedronGeometry(1.5, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.6,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    // Orbiting Satellite Spheres
    const radius = 4.2;
    AI_FEATURES.forEach((feat, idx) => {
      const angle = (idx / AI_FEATURES.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const satGeom = new THREE.SphereGeometry(0.45, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x7e22ce,
        emissiveIntensity: 0.5,
      });
      const satMesh = new THREE.Mesh(satGeom, satMat);
      satMesh.position.set(x, y, 0);
      scene.add(satMesh);

      // Line
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, 0)];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.4 });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-7 relative h-[420px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
        <SpatialCanvas onSceneReady={handleSceneReady} />
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono font-bold text-purple-400">
          ⚡ 3D HYBRID RAG & RULE INFERENCE CORE
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
            AI Compliance Engine
          </span>
          <h3 className="text-3xl font-black text-white mt-3 mb-2 tracking-tight">
            Hybrid AI & Deterministic Verification
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Combining LLM semantic clause understanding with strict mathematical rule execution eliminates human evaluation error 
            and speeds up verification from days to seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AI_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-xs font-bold text-white mb-0.5">{feat.title}</h4>
                <p className="text-[11px] text-slate-400 leading-tight">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
