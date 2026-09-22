"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/Navbar";
import { LandingFooter } from "@/components/landing/Footer";
import { HeroNetwork3D, NodeDetail } from "@/components/3d/HeroNetwork3D";
import { NodeDetailModal } from "@/components/3d/NodeDetailModal";
import { DocumentScanner3D } from "@/components/3d/DocumentScanner3D";
import { GovernmentHub3D } from "@/components/3d/GovernmentHub3D";
import { AiEngineCore3D } from "@/components/3d/AiEngineCore3D";
import { SecurityVault3D } from "@/components/3d/SecurityVault3D";
import { RiskMatrix3D } from "@/components/3d/RiskMatrix3D";
import { AuditTimeline3D } from "@/components/3d/AuditTimeline3D";
import { ComplexitySection } from "@/components/landing/ComplexitySection";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Mesh Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* Navigation Bar */}
      <LandingNavbar />

      {/* ═══════════════════════════════════════════════════════════════
         1. 3D HERO SECTION — COMPLIANCE INTELLIGENCE NETWORK
         ═══════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Brand Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>SIH 2026 INNOVATION</span>
              </div>

              {/* Large Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                NEXT-GEN <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                  BID VERIFICATION
                </span>
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                AI-powered tender verification, government registry validation, document intelligence and risk-aware compliance analysis.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/tenders"
                  className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <span>LAUNCH WORKSPACE</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all hover:border-slate-600"
                >
                  EXPLORE PLATFORM
                </a>
              </div>

              {/* Platform Highlights */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-lg font-black text-white">100%</div>
                  <div className="text-slate-400 text-[11px]">SHA-256 Audit</div>
                </div>
                <div>
                  <div className="text-lg font-black text-emerald-400">&lt; 3.0s</div>
                  <div className="text-slate-400 text-[11px]">Verification Time</div>
                </div>
                <div>
                  <div className="text-lg font-black text-purple-400">5 Feeds</div>
                  <div className="text-slate-400 text-[11px]">Registry APIs</div>
                </div>
              </div>
            </div>

            {/* Right / Center 3D Spatial Network */}
            <div className="lg:col-span-7">
              <HeroNetwork3D onSelectNode={(node) => setSelectedNode(node)} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         2. TRUST & INFRASTRUCTURE BANNER
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-slate-900/50 border-y border-slate-800/80 backdrop-blur-md z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Target Domain</div>
              <div className="text-sm font-bold text-white">Government e-Marketplace (GeM)</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Registry Validation</div>
              <div className="text-sm font-bold text-emerald-400">GSTN • PAN • Udyam • MCA</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Intelligence Core</div>
              <div className="text-sm font-bold text-purple-400">Hybrid LLM RAG + Rule DSL</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Audit Security</div>
              <div className="text-sm font-bold text-pink-400">Cryptographic Hash Ledger</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         3. 3D HOW IT WORKS — SPATIAL JOURNEY
         ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              3D Product Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              From PDF Upload to Immutable Award Sign-off
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Step through the 3D pipeline showing how raw bidder document submissions are verified against real government registries.
            </p>
          </div>

          <AuditTimeline3D />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         4. 3D DOCUMENT INTELLIGENCE SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section id="document-ocr" className="py-20 bg-slate-900/30 border-y border-slate-800/80 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DocumentScanner3D />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         5. 3D GOVERNMENT REGISTRY NETWORK
         ═══════════════════════════════════════════════════════════════ */}
      <section id="registries" className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GovernmentHub3D />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         6. 3D AI COMPLIANCE ENGINE SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section id="ai-engine" className="py-20 bg-slate-900/30 border-y border-slate-800/80 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AiEngineCore3D />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         7. 3D RISK INTELLIGENCE SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section id="risk" className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RiskMatrix3D />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         8. 3D SECURITY & VAULT SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section id="security" className="py-20 bg-slate-900/30 border-y border-slate-800/80 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SecurityVault3D />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         9. TECHNICAL PROJECT COMPLEXITY SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section id="complexity" className="py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComplexitySection />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         10. FINAL CALL TO ACTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 z-10 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-purple-900/60 border border-blue-500/30 text-center space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH 2026 GOVERNMENT TENDER AI</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Accelerate Tender Compliance Verification?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Experience automated document intelligence, sandbox registry verification, and AI-assisted officer decision making live on the workspace.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/tenders"
                className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>ENTER WORKSPACE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
              >
                PROCUREMENT OFFICER LOGIN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Node Inspection Modal */}
      <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
