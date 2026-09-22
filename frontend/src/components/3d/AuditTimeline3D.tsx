"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Lock } from "lucide-react";

const TIMELINE_STEPS = [
  { step: "01", title: "Tender Submitted", detail: "Vendor submits PDF RFP bid package", time: "0.0s", status: "Completed" },
  { step: "02", title: "Documents Processed", detail: "File layout validation & page splitting", time: "0.2s", status: "Completed" },
  { step: "03", title: "OCR Completed", detail: "Text & table extraction from images/PDFs", time: "0.8s", status: "Completed" },
  { step: "04", title: "GST Verified", detail: "GSTIN query via sandbox GSTN API", time: "1.2s", status: "Completed" },
  { step: "05", title: "PAN Verified", detail: "Income Tax API validation & status check", time: "1.5s", status: "Completed" },
  { step: "06", title: "AI Analysis", detail: "Hybrid RAG clause compliance evaluation", time: "2.1s", status: "Completed" },
  { step: "07", title: "Risk Calculation", detail: "Multi-factor penalty & score synthesis", time: "2.3s", status: "Completed" },
  { step: "08", title: "Officer Review", detail: "Human-in-the-loop decision dashboard", time: "2.5s", status: "Completed" },
  { step: "09", title: "Audit Record Sealed", detail: "SHA-256 hash appended to immutable chain", time: "2.6s", status: "Completed" },
];

export function AuditTimeline3D() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % TIMELINE_STEPS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-pink-500/10 text-pink-400 border border-pink-500/20">
          3D Audit Trail Journey
        </span>
        <h3 className="text-3xl font-black text-white tracking-tight">
          End-to-End Immutable Verification Timeline
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Watch every digital verification transaction flow through the spatial pipeline in under 3 seconds.
        </p>
      </div>

      {/* Horizontal Spatial Timeline Track */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-x-auto">
        <div className="min-w-[800px] flex items-center justify-between relative z-10">
          {TIMELINE_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            const isPast = idx < activeStep;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`group cursor-pointer flex flex-col items-center text-center transition-all duration-300 ${
                  isActive ? "scale-110" : "opacity-70 hover:opacity-100"
                }`}
                style={{ width: `${100 / TIMELINE_STEPS.length}%` }}
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs mb-3 transition-all ${
                    isActive
                      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/40 ring-4 ring-pink-500/20 scale-110"
                      : isPast
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {isPast ? <CheckCircle2 className="w-5 h-5" /> : step.step}
                </div>

                {/* Step Title */}
                <h4 className="text-xs font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">
                  {step.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Glowing Line Behind Steps */}
        <div className="absolute top-11 left-12 right-12 h-0.5 bg-slate-800 z-0">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-pink-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${(activeStep / (TIMELINE_STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Step Details Highlight */}
      <div className="max-w-xl mx-auto p-5 rounded-2xl bg-slate-900/90 border border-pink-500/30 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-pink-400 font-bold uppercase">
              Step {TIMELINE_STEPS[activeStep].step} Active Details
            </div>
            <h4 className="text-sm font-bold text-white">{TIMELINE_STEPS[activeStep].title}</h4>
            <p className="text-xs text-slate-300">{TIMELINE_STEPS[activeStep].detail}</p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-400 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold block mb-1">
            ● Verified
          </span>
          <span>{TIMELINE_STEPS[activeStep].time}</span>
        </div>
      </div>
    </div>
  );
}
