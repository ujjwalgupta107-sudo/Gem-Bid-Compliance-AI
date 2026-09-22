"use client";
import React, { useState } from "react";
import Link from "next/navigation";
import { Shell } from "@/components/Shell";
import DashboardMockup3D from "@/components/3d/DashboardMockup3D";
import { LogoIcon } from "@/components/ui/Logo";
import FeatureOCR3D from "@/components/3d/FeatureOCR3D";
import FeatureHybridEngine3D from "@/components/3d/FeatureHybridEngine3D";
import FeatureAuditChain3D from "@/components/3d/FeatureAuditChain3D";
import { BrandText } from "@/components/ui/BrandText";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const featureDetails: Record<string, { title: string; input: string; process: string; output: string }> = {
    "ocr": {
      title: "LAYOUT-AWARE OCR",
      input: "Vendor documents (PDFs, Images)",
      process: "LayoutLMv3 + PaddleOCR for spatial awareness",
      output: "Structured text, tables, and financial values"
    },
    "hybrid": {
      title: "HYBRID AI ENGINE",
      input: "Deterministic Rules + Semantic Retrieval",
      process: "JSON Logic + pgvector RAG validation",
      output: "Hybrid Compliance Decision (AI reasoning + Hard Rules)"
    },
    "audit": {
      title: "SHA-256 AUDIT CHAIN",
      input: "System Events & Decisions",
      process: "Cryptographic hashing of every action",
      output: "Tamper-proof Verification History for Government Audits"
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white selection:bg-[#00F5FF] selection:text-black font-sans relative overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0070F3] rounded-full mix-blend-screen filter blur-[150px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00F5FF] rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none" />
      <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-emerald-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none" />

      {/* Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F17]/70 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon size="md" />
            <BrandText inline className="text-lg hidden sm:block ml-2" />
            <span className="bg-white/10 text-[#00F5FF] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#00F5FF]/30 ml-2">
              SIH 2026 AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#architecture" className="hover:text-[#00F5FF] transition-colors">Architecture</a>
            <a href="#engine" className="hover:text-[#00F5FF] transition-colors">Hybrid Engine</a>
            <a href="#audit" className="hover:text-[#00F5FF] transition-colors">Audit Trail</a>
            <a href="/login" className="hover:text-[#00F5FF] transition-colors">Live Demo</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-slate-900 text-sm font-bold px-5 py-2 rounded-lg shadow-[0_0_15px_rgba(0,245,255,0.4)] transition-all">
              [ Launch Platform ]
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-16 lg:pt-40 lg:pb-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse"></span>
            Ministry of Petroleum & Natural Gas | CPCL Problem Statement
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="text-xl lg:text-2xl font-bold tracking-widest text-slate-300 block mb-4 uppercase">Government e-Marketplace</span>
            <BrandText className="text-5xl lg:text-6xl" />
          </h1>
          
          <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
            Hybrid deterministic logic + Layout-aware OCR to eradicate tender evaluation delays with zero hallucinations.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="/login" className="w-full sm:w-auto text-center bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-slate-900 font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all hover:scale-105">
              [ Analyze Tender Package ]
            </a>
            <a href="#architecture" className="w-full sm:w-auto text-center bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/10 backdrop-blur-sm transition-all hover:border-[#00F5FF]/50">
              [ View Architecture Flow ]
            </a>
          </div>
        </div>

        {/* Right Column (3D Hologram Mockup) */}
        <div className="relative h-[400px] lg:h-[600px] w-full flex items-center justify-center">
          <DashboardMockup3D />
          
          {/* Mockup Overlays */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-md backdrop-blur-md flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Human-in-the-Loop Override Active</span>
          </div>
        </div>
      </main>

      {/* Feature Section (Bento Grid) */}
      <section id="architecture" className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Features</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A secure, deterministic, and highly accurate verification pipeline built for sovereign government deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up relative">
          
          {/* Animated Connecting Line (Desktop Only) */}
          <div className="absolute top-[30%] left-[15%] w-[70%] h-0.5 hidden md:block pointer-events-none z-0">
            <svg className="w-full h-10 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M 0 5 L 100 5" fill="none" stroke="rgba(0, 245, 255, 0.2)" strokeWidth="0.5" strokeDasharray="2, 2" />
              <path d="M 0 5 L 100 5" fill="none" stroke="#00F5FF" strokeWidth="0.5" strokeDasharray="5, 10">
                <animate attributeName="stroke-dashoffset" from="15" to="0" dur="2s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>

          {/* Card 1 */}
          <div 
            onClick={() => setActiveFeature("ocr")}
            className="group relative bg-[#0B0F17]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:border-[#00F5FF]/50 hover:shadow-[0_0_40px_rgba(0,245,255,0.15)] hover:-translate-y-2 overflow-hidden cursor-pointer z-10 min-h-[400px] flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex-1 w-full relative mb-6 rounded-2xl overflow-hidden border border-white/5 bg-black/20">
              <FeatureOCR3D />
            </div>

            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Layout-Aware OCR</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">
              Powered by LayoutLMv3 and PaddleOCR to precisely extract tabular financial data and spatial structures from complex vendor uploads.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setActiveFeature("hybrid")}
            className="group relative bg-[#0B0F17]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:border-[#0070F3]/50 hover:shadow-[0_0_40px_rgba(0,112,243,0.15)] hover:-translate-y-2 overflow-hidden cursor-pointer delay-100 z-10 min-h-[400px] flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0070F3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex-1 w-full relative mb-6 rounded-2xl overflow-hidden border border-white/5 bg-black/20">
              <FeatureHybridEngine3D />
            </div>

            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Hybrid Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">
              Combines strict JSON Logic Deterministic Rules with semantic RAG using pgvector to eliminate AI hallucinations and ensure precise compliance.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => setActiveFeature("audit")}
            className="group relative bg-[#0B0F17]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:-translate-y-2 overflow-hidden cursor-pointer delay-200 z-10 min-h-[400px] flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex-1 w-full relative mb-6 rounded-2xl overflow-hidden border border-white/5 bg-black/20">
              <FeatureAuditChain3D />
            </div>

            <h3 className="text-xl font-bold text-white mb-3 relative z-10">SHA-256 Audit Chain</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">
              Every automated decision is hashed and chained into a tamper-proof cryptographic log, providing complete transparency for government audits.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Details Modal */}
      {activeFeature && featureDetails[activeFeature] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setActiveFeature(null)} />
          <div className="relative bg-[#0B0F17] border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <button 
              onClick={() => setActiveFeature(null)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h4 className="text-[#00F5FF] text-sm font-bold tracking-widest mb-6 border-b border-white/10 pb-4">
              {featureDetails[activeFeature].title}
            </h4>
            <div className="space-y-6">
              <div>
                <span className="block text-[10px] uppercase text-white/40 font-bold mb-1">Input</span>
                <p className="text-white text-sm font-medium">{featureDetails[activeFeature].input}</p>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-white/40 font-bold mb-1">Processing</span>
                <p className="text-[#0070F3] text-sm font-medium">{featureDetails[activeFeature].process}</p>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-white/40 font-bold mb-1">Output</span>
                <p className="text-emerald-400 text-sm font-medium">{featureDetails[activeFeature].output}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
