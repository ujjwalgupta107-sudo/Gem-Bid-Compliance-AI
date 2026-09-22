"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SpatialCanvas } from "./SpatialCanvas";
import { FileText, Scan, CheckCircle } from "lucide-react";

const DOCUMENTS = [
  { id: "tender_rfp", title: "Tender RFP Document", type: "PDF Specification", color: "#3b82f6", pos: [-3.5, 1.2, 0] },
  { id: "gst_cert", title: "GST Certificate", type: "Tax Registration", color: "#10b981", pos: [-1.2, -1.0, 1.5] },
  { id: "pan_card", title: "PAN Card / Tax ID", type: "Identity Proof", color: "#10b981", pos: [1.2, 1.2, 0.5] },
  { id: "udyam_cert", title: "Udyam Certificate", type: "MSME Registration", color: "#f59e0b", pos: [3.5, -1.0, 0] },
];

export function DocumentScanner3D() {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const docMeshesRef = useRef<THREE.Mesh[]>([]);
  const laserRef = useRef<THREE.Mesh | null>(null);
  const [activeDoc, setActiveDoc] = useState(0);

  const handleSceneReady = (scene: THREE.Scene) => {
    sceneRef.current = scene;
    docMeshesRef.current = [];

    // Create 3D Document Plane geometries
    DOCUMENTS.forEach((doc, idx) => {
      const geom = new THREE.PlaneGeometry(1.8, 2.4);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(doc.color),
        roughness: 0.3,
        metalness: 0.4,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(doc.color),
        emissiveIntensity: 0.2,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(doc.pos[0], doc.pos[1], doc.pos[2]);
      mesh.rotation.y = Math.PI * 0.05 * (idx % 2 === 0 ? 1 : -1);

      // Add border wireframe
      const wireGeom = new THREE.PlaneGeometry(1.85, 2.45);
      const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3 });
      const wire = new THREE.Mesh(wireGeom, wireMat);
      mesh.add(wire);

      scene.add(mesh);
      docMeshesRef.current.push(mesh);
    });

    // Scanning Laser Beam Line
    const laserGeom = new THREE.BoxGeometry(10, 0.05, 0.05);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const laser = new THREE.Mesh(laserGeom, laserMat);
    laser.position.set(0, 0, 1);
    scene.add(laser);
    laserRef.current = laser;
  };

  const handleRenderFrame = (time: number) => {
    docMeshesRef.current.forEach((mesh, idx) => {
      mesh.position.y = DOCUMENTS[idx].pos[1] + Math.sin(time * 1.8 + idx) * 0.12;
      mesh.rotation.x = Math.sin(time * 0.8 + idx) * 0.05;
    });

    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(time * 2.5) * 2.2;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDoc((prev) => (prev + 1) % DOCUMENTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* 3D Visualizer Canvas */}
      <div className="lg:col-span-7 relative h-[400px] sm:h-[480px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
        <SpatialCanvas onSceneReady={handleSceneReady} onRenderFrame={handleRenderFrame} />

        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono font-bold text-sky-400 flex items-center gap-2">
          <Scan className="w-4 h-4 animate-spin text-sky-400" />
          <span>3D LASER OCR SCANNER • LIVE PIPELINE</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex justify-between items-center">
          <span className="font-mono text-[11px] text-sky-400">Processing: {DOCUMENTS[activeDoc].title}</span>
          <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold border border-sky-500/30">
            Scanning 100% Accuracy
          </span>
        </div>
      </div>

      {/* OCR Transformation Story Details */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Document Intelligence
          </span>
          <h3 className="text-3xl font-black text-white mt-3 mb-2 tracking-tight">
            Spatial 3D Document Parsing & OCR
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Multi-page government tender documents, financial balance sheets, and statutory certificates are transformed into 
            structured JSON data schemas in real-time.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">1. Multi-Format Ingestion</h4>
              <p className="text-xs text-slate-400">PDFs, scanned images, work order certificates & statutory forms.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Scan className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">2. High-Precision OCR & Layout Parsing</h4>
              <p className="text-xs text-slate-400">Detects tabular data, GSTIN stamps, digital signatures & legal seals.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-0.5">3. Canonical Schema Normalization</h4>
              <p className="text-xs text-slate-400">Converts unstructured text into verified facts for rule matching.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
