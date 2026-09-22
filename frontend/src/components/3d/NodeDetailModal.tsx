"use client";
import React from "react";
import { NodeDetail } from "./HeroNetwork3D";
import { X, CheckCircle2, ShieldCheck, Cpu, Database, Activity, FileText, Lock } from "lucide-react";

interface NodeDetailModalProps {
  node: NodeDetail | null;
  onClose: () => void;
}

export function NodeDetailModal({ node, onClose }: NodeDetailModalProps) {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header Banner */}
        <div className="relative px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg"
              style={{ backgroundColor: `${node.color}25`, border: `1px solid ${node.color}60` }}
            >
              {node.id === "gstn" && <Database className="w-5 h-5 text-emerald-400" />}
              {node.id === "pan" && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              {node.id === "udyam" && <Activity className="w-5 h-5 text-emerald-400" />}
              {node.id === "documents" && <FileText className="w-5 h-5 text-blue-400" />}
              {node.id === "ai_engine" && <Cpu className="w-5 h-5 text-purple-400" />}
              {node.id === "compliance" && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
              {node.id === "risk_engine" && <Activity className="w-5 h-5 text-amber-400" />}
              {node.id === "audit_trail" && <Lock className="w-5 h-5 text-pink-400" />}
              {node.id === "tender" && <FileText className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-400">
                  {node.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {node.status}
                </span>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">{node.label}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">System Function</h4>
            <p className="text-sm text-slate-200 leading-relaxed">{node.description}</p>
          </div>

          {/* Purpose */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="font-mono text-blue-400 font-bold uppercase tracking-wider block mb-1">Verification Purpose</span>
            <span className="text-slate-300">{node.purpose}</span>
          </div>

          {/* Automated Checks */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">Executed Compliance Checks</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {node.checks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sandbox Live Payload Sample */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Live Verification Payload (JSON)</h4>
            <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
              <pre>
{JSON.stringify(
  {
    node_id: node.id,
    system_label: node.label,
    integration_type: "SANDBOX_DIRECT_FEED",
    status: node.status,
    last_sync_timestamp: new Date().toISOString(),
    verification_hash: `sha256_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    checks_passed: node.checks.length,
    checks_failed: 0,
    confidence_score: 0.985,
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Platform Integration Active • {node.lastSync}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
