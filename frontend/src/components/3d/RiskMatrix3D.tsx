"use client";
import React, { useState } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";
import { AlertTriangle } from "lucide-react";

const RISK_LEVELS = [
  { level: "LOW", score: "0 - 15", color: "#10b981", height: 1.5, pos: [-3, 0, 0], desc: "All mandatory certificates verified, active GSTN/PAN, no debarment history.", action: "Recommended for Auto-Approval" },
  { level: "MEDIUM", score: "16 - 45", color: "#3b82f6", height: 2.8, pos: [-1, 0, 0], desc: "Minor formatting discrepancies or missing non-critical undertaking.", action: "Requires Standard Officer Review" },
  { level: "HIGH", score: "46 - 75", color: "#f59e0b", height: 4.2, pos: [1, 0, 0], desc: "Financial turnover near boundary threshold or GST return filing delays.", action: "Flags Raised • Mandatory Escalation" },
  { level: "CRITICAL", score: "76 - 100", color: "#ef4444", height: 5.8, pos: [3, 0, 0], desc: "Entity found in Debarment registry, GSTIN cancelled, or severe document mismatch.", action: "Automatic Disqualification Alert" },
];

export function RiskMatrix3D() {
  const [selectedRisk, setSelectedRisk] = useState(RISK_LEVELS[3]);

  const handleSceneReady = (scene: THREE.Scene) => {
    RISK_LEVELS.forEach((r) => {
      const geom = new THREE.BoxGeometry(1.2, r.height, 1.2);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(r.color),
        metalness: 0.6,
        roughness: 0.2,
        emissive: new THREE.Color(r.color),
        emissiveIntensity: 0.3,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(r.pos[0], r.height / 2 - 2.5, r.pos[2]);
      scene.add(mesh);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-7 relative h-[420px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
        <SpatialCanvas onSceneReady={handleSceneReady} />
        
        {/* Risk Selection Buttons overlaid on canvas */}
        <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-4 gap-2">
          {RISK_LEVELS.map((r, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedRisk(r)}
              className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                selectedRisk.level === r.level
                  ? "bg-slate-800 border-blue-500 text-white shadow-lg"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <div className="text-[10px] font-mono opacity-70">{r.score}</div>
              <div style={{ color: r.color }}>{r.level}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            3D Risk Intelligence
          </span>
          <h3 className="text-3xl font-black text-white mt-3 mb-2 tracking-tight">
            Multi-Factor Risk Assessment
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Synthesizing registry integrity, document extraction quality, and historical debarment data into an actionable 
            risk category for procurement decision-makers.
          </p>
        </div>

        {/* Selected Risk Info Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Selected Category</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ backgroundColor: `${selectedRisk.color}20`, color: selectedRisk.color, border: `1px solid ${selectedRisk.color}50` }}>
              ● {selectedRisk.level} RISK ({selectedRisk.score})
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-1">Trigger Condition</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedRisk.desc}</p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs font-bold" style={{ color: selectedRisk.color }}>
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Action: {selectedRisk.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
