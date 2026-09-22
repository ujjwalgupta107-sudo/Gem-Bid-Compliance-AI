"use client";
import React from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";
import { Shield, Lock, Key, FileCheck, Database } from "lucide-react";

const REAL_SECURITY_FEATURES = [
  { title: "SHA-256 Audit Chain", desc: "Cryptographic hash chaining prevents retrospective log tampering.", icon: Lock },
  { title: "Role-Based Access Control", desc: "Granular permissions for evaluators, officers, and auditors.", icon: Key },
  { title: "Immutable Audit Log", desc: "Timestamped record of every document upload, OCR pass, and rule execution.", icon: Database },
  { title: "Verification Evidence Store", desc: "Original uploaded PDFs preserved alongside extracted facts.", icon: FileCheck },
];

export function SecurityVault3D() {
  const handleSceneReady = (scene: THREE.Scene) => {
    // 3D Shield / Vault Mesh
    const shieldGeom = new THREE.CylinderGeometry(1.6, 1.2, 0.4, 6);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x0369a1,
      emissiveIntensity: 0.4,
    });
    const shieldMesh = new THREE.Mesh(shieldGeom, shieldMat);
    shieldMesh.rotation.x = Math.PI / 2;
    scene.add(shieldMesh);

    // Orbiting Lock Nodes
    const count = 4;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 3.5;
      const y = Math.sin(angle) * 3.5;

      const keyGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const keyMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
      const keyMesh = new THREE.Mesh(keyGeom, keyMat);
      keyMesh.position.set(x, y, 0);
      scene.add(keyMesh);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Security & Auditability
          </span>
          <h3 className="text-3xl font-black text-white mt-3 mb-2 tracking-tight">
            Cryptographic Integrity & Tamper-Evident Governance
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Built on a zero-trust architecture where every verification check, AI score, and officer sign-off is linked via SHA-256 cryptographic hashes.
          </p>
        </div>

        <div className="space-y-3">
          {REAL_SECURITY_FEATURES.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{sec.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">{sec.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-7 relative h-[420px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
        <SpatialCanvas onSceneReady={handleSceneReady} />
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-sky-400 flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-400" />
          <span>SHA-256 Verification Chain Active • 100% Immutable</span>
        </div>
      </div>
    </div>
  );
}
