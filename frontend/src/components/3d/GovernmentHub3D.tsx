"use client";
import React from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";
import { Building2, CheckCircle2, RefreshCw } from "lucide-react";

const REGISTRIES = [
  { name: "GSTN", label: "GST Network Portal", status: "Active API Feed", pos: [4, 2, 0], color: 0x10b981 },
  { name: "PAN / ITR", label: "Income Tax e-Filing", status: "Active API Feed", pos: [-4, 2, 0], color: 0x10b981 },
  { name: "UDYAM", label: "MSME Portal", status: "Active API Feed", pos: [4, -2, 0], color: 0x10b981 },
  { name: "MCA21", label: "Ministry of Corporate Affairs", status: "Sandbox Feed", pos: [-4, -2, 0], color: 0x3b82f6 },
  { name: "CPPP", label: "Central Public Procurement", status: "Debarment Mirror", pos: [0, 3.5, 0], color: 0xec4899 },
];

export function GovernmentHub3D() {
  const handleSceneReady = (scene: THREE.Scene) => {
    // Center Core (Bid Compliance Platform)
    const coreGeom = new THREE.IcosahedronGeometry(1.2, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    // Orbit Ring
    const ringGeom = new THREE.TorusGeometry(4.2, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Connectors
    REGISTRIES.forEach((reg) => {
      const regGeom = new THREE.SphereGeometry(0.5, 16, 16);
      const regMat = new THREE.MeshStandardMaterial({
        color: reg.color,
        metalness: 0.6,
        roughness: 0.2,
        emissive: reg.color,
        emissiveIntensity: 0.3,
      });
      const regMesh = new THREE.Mesh(regGeom, regMat);
      regMesh.position.set(reg.pos[0], reg.pos[1], reg.pos[2]);
      scene.add(regMesh);

      // Connection Line
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...reg.pos)];
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: reg.color, transparent: true, opacity: 0.5 });
      const line = new THREE.Line(lineGeom, lineMat);
      scene.add(line);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Government Registry Network
          </span>
          <h3 className="text-3xl font-black text-white mt-3 mb-2 tracking-tight">
            Direct & Sandbox Registry Integrations
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Automatic verification against official government registry feeds ensures bidders are active, tax compliant, 
            and free from debarment before contract award.
          </p>
        </div>

        <div className="space-y-3">
          {REGISTRIES.map((reg, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">{reg.name}</h4>
                  <p className="text-[11px] text-slate-400">{reg.label}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {reg.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-7 relative h-[420px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
        <SpatialCanvas onSceneReady={handleSceneReady} />
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-emerald-400 font-mono flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Real-time Sandbox Registry Synchronization</span>
        </div>
      </div>
    </div>
  );
}
