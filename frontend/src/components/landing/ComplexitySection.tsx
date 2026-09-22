"use client";
import React, { useState } from "react";
import { BrandText } from "@/components/ui/BrandText";
import { Cpu, ShieldCheck, Database, FileSearch, Layers, Activity, Lock, UserCheck } from "lucide-react";

interface CapabilityModule {
  id: string;
  title: string;
  badge: "IMPLEMENTED" | "DEMO/SANDBOX" | "PARTIAL" | "PLANNED";
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  techStack: string[];
  description: string;
  architecturalRole: string;
}

const CAPABILITIES: CapabilityModule[] = [
  {
    id: "multi_system",
    title: "Multi-System Integration",
    badge: "IMPLEMENTED",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: Layers,
    techStack: ["FastAPI", "Next.js 14", "Async Connectors", "Pydantic Schemas"],
    description: "Orchestrates concurrent async requests across diverse government external registries and internal database engines.",
    architecturalRole: "Base infrastructure unifying document ingestion, AI processing, and API verification feeds.",
  },
  {
    id: "doc_intel",
    title: "Document Intelligence (OCR & Parsing)",
    badge: "IMPLEMENTED",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: FileSearch,
    techStack: ["PyPDF2 / PDFMiner", "EasyOCR / Tesseract", "Regex Extractor", "Table Parsing"],
    description: "Transforms unstructured PDFs, scanned registration certificates, and work experience documents into canonical data JSON.",
    architecturalRole: "Standardizes raw bidder uploads into typed data models before evaluation.",
  },
  {
    id: "ai_rules",
    title: "Hybrid AI + Rule Engine",
    badge: "IMPLEMENTED",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: Cpu,
    techStack: ["RAG Engine", "Gemini 1.5 / OpenAI", "Rule DSL", "Deterministic Evaluation"],
    description: "Combines semantic LLM clause parsing with strict mathematical rule execution to prevent AI hallucinations.",
    architecturalRole: "Calculates pass/fail compliance flags against exact RFP threshold criteria.",
  },
  {
    id: "registry_verif",
    title: "Government Registry Verification",
    badge: "DEMO/SANDBOX",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: Database,
    techStack: ["GSTN Sandbox", "PAN ITR Mock API", "Udyam Registry Feed", "MCA Mirror"],
    description: "Queries simulated & live sandbox government portals to confirm entity active status, GST filing, and MSME validity.",
    architecturalRole: "Protects procurement authorities from awarding bids to shell or defaulting companies.",
  },
  {
    id: "cross_doc",
    title: "Cross-Document Validation",
    badge: "IMPLEMENTED",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: ShieldCheck,
    techStack: ["Entity Matching", "Fuzzy Name Distance", "Financial Consistency", "Date Bounds"],
    description: "Cross-references vendor name, GSTIN, PAN, and address consistency across ALL submitted certificates to detect discrepancies.",
    architecturalRole: "Identifies fraudulent or mismatched documents submitted under different legal entity titles.",
  },
  {
    id: "risk_analysis",
    title: "Risk Scoring Engine",
    badge: "IMPLEMENTED",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: Activity,
    techStack: ["Multi-Factor Weighting", "Penalty Matrix", "Anomaly Classifier", "Confidence Metrics"],
    description: "Synthesizes document missing flags, registry failures, and financial thresholds into a composite risk score (LOW to CRITICAL).",
    architecturalRole: "Provides procurement officers with prioritized alert flags for risky bid submissions.",
  },
  {
    id: "auditability",
    title: "SHA-256 Cryptographic Auditability",
    badge: "IMPLEMENTED",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: Lock,
    techStack: ["SHA-256 Hash Chain", "Audit Ledger DB", "Timestamping", "Exportable PDF Reports"],
    description: "Every decision step, OCR extraction result, and rule evaluation is immutably hashed to guarantee legal auditability.",
    architecturalRole: "Ensures complete transparency for CVC / CAG audit scrutiny.",
  },
  {
    id: "hitl",
    title: "Human-in-the-Loop Officer Interface",
    badge: "IMPLEMENTED",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: UserCheck,
    techStack: ["Officer Decision Matrix", "Override Logging", "Disqualification Letter Generator"],
    description: "AI never makes auto-rejection decisions autonomously. Full decision power remains with authorized procurement officers.",
    architecturalRole: "Guarantees administrative accountability and human oversight in government tender awards.",
  },
];

export function ComplexitySection() {
  const [activeTab, setActiveTab] = useState<CapabilityModule>(CAPABILITIES[0]);

  return (
    <div className="space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
          Architecture & Engineering Complexity
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Why <BrandText inline /> Is Technically Advanced
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Government tender compliance requires zero tolerance for errors. Explore the 8 core engineering modules powering the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Capability Module Selector Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            const isSelected = activeTab.id === cap.id;
            return (
              <button
                key={cap.id}
                onClick={() => setActiveTab(cap)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? "bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10"
                    : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 group-hover:text-white"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono border ${cap.badgeColor}`}>
                    {cap.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {cap.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
                  {cap.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Capability Deep-Dive Inspector */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <activeTab.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider block">
                  Capability Module
                </span>
                <h3 className="text-lg font-black text-white">{activeTab.title}</h3>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${activeTab.badgeColor}`}>
              {activeTab.badge}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Module Function</h4>
            <p className="text-sm text-slate-200 leading-relaxed">{activeTab.description}</p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Architectural Role</h4>
            <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
              {activeTab.architecturalRole}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Technology Stack</h4>
            <div className="flex flex-wrap gap-2">
              {activeTab.techStack.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-300 font-mono text-xs font-bold">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
