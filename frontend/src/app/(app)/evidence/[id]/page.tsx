"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EvidenceViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const [overrideReason, setOverrideReason] = useState("");
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const bidder = {
    id: id || "BID-1002",
    name: "Sunrise Traders Private Limited",
    status: "FAIL",
    score: 34,
    risk: "HIGH",
    flagged: true
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 bg-[#f8fafc] animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/matrix" className="text-slate-400 hover:text-slate-700 transition flex items-center gap-1 text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back to Matrix
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900">{bidder.name}</h1>
              {bidder.flagged && <span className="bg-status-fail text-white text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">Flagged</span>}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{bidder.id} • Tender GEM/2026/B/543210</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-status-failBg border border-rose-200 text-status-fail px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Score: {bidder.score}
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: PDF / Evidence Viewer */}
        <div className="w-1/2 bg-slate-100/50 border-r border-slate-200 flex flex-col relative overflow-hidden">
          <div className="bg-white border-b border-slate-200 p-2 flex items-center justify-between shrink-0 shadow-xs z-10 relative">
            <select className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded p-1.5 outline-none">
              <option>Audited_Financials_FY25.pdf</option>
              <option>ISO_Certificate.pdf</option>
              <option>Local_Content_Declaration.pdf</option>
            </select>
            <div className="flex items-center gap-2 text-slate-500">
              <button className="p-1 hover:bg-slate-100 rounded transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg></button>
              <span className="text-xs font-mono">Page 4 of 12</span>
              <button className="p-1 hover:bg-slate-100 rounded transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-200/50 relative">
             {/* Mock PDF Document */}
             <div className="w-[600px] bg-white shadow-lg p-12 text-slate-800 font-serif text-sm relative">
                <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-2 text-center">INDEPENDENT AUDITOR&apos;S REPORT</h2>
                <p className="mb-4 text-justify leading-relaxed">
                  We have audited the financial statements of Sunrise Traders Private Limited, which comprise the balance sheet as at March 31, 2025, and the statement of profit and loss...
                </p>
                <p className="mb-4 text-justify leading-relaxed">
                  In our opinion and to the best of our information and according to the explanations given to us, the aforesaid financial statements give the information required by the Act...
                </p>
                <div className="mt-8 border-t border-b border-slate-300 py-4 mb-4">
                  <table className="w-full text-left font-sans text-xs">
                    <tbody>
                      <tr><td className="font-bold py-1">Revenue from Operations</td><td className="text-right py-1">₹ 1,20,50,000</td></tr>
                      <tr className="bg-rose-100/50"><td className="font-bold py-1 relative">
                        {/* Highlight Box representing OCR Bounding Box */}
                        <div className="absolute inset-0 border-2 border-status-fail bg-status-fail/10 rounded-sm -m-1 pointer-events-none"></div>
                        Total Turnover
                      </td><td className="text-right py-1 font-bold text-status-fail relative z-10">₹ 1,20,50,000</td></tr>
                      <tr><td className="font-bold py-1">Net Profit</td><td className="text-right py-1">₹ 15,20,000</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-justify leading-relaxed">
                  The Company&apos;s management is responsible for the preparation of these financial statements...
                </p>
             </div>
          </div>
        </div>

        {/* Right Side: Data, Findings, Decisions */}
        <div className="w-1/2 flex flex-col bg-white overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Deterministic Rule Result */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Extracted Fields & Verification</h3>
              <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-sm relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-status-fail"></div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-100 text-slate-600 p-1 rounded">
                       <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-900">Financial Turnover Rule</span>
                  </div>
                  <span className="badge badge-fail"><span className="w-1.5 h-1.5 rounded-full bg-status-fail mr-1"></span>FAIL</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">Requirement: Minimum ₹ 3,00,00,000 (3 Cr) average turnover in last 3 years.</p>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Extracted Value</span>
                    <p className="text-sm font-mono text-status-fail font-bold">₹ 1,20,50,000</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Source: Audited_Financials_FY25.pdf (Page 4)</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">Required Value</span>
                    <p className="text-sm font-mono text-slate-900 font-bold">≥ ₹ 3,00,00,000</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Source: Tender TR01</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Findings Panel */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gem-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                AI Insights & Discrepancies
              </h3>
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 shadow-sm relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-900">Name Mismatch Detected</span>
                  </div>
                  <span className="bg-white border border-amber-200 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs">89% Confidence</span>
                </div>
                <p className="text-xs text-amber-800/80 mb-3 leading-relaxed">
                  The company name on the uploaded PAN card is &quot;Sunrise Traders&quot;, but the registered GeM profile name is &quot;Sunrise Traders Private Limited&quot;.
                </p>
                <div className="flex gap-2">
                   <button className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded shadow-2xs hover:bg-slate-50">View PAN Card</button>
                   <button className="text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded shadow-2xs hover:bg-slate-50">View GeM Profile</button>
                </div>
              </div>
            </div>

          </div>

          {/* Officer Decision Panel (Sticky Bottom) */}
          <div className="bg-white border-t border-slate-200 p-6 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-20">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Officer Decision</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {["Accept", "Accept with Conditions", "Seek Clarification", "Reject"].map((decision) => (
                <button
                  key={decision}
                  onClick={() => setSelectedDecision(decision)}
                  className={`px-3 py-2 text-xs font-semibold border rounded-lg transition-all ${
                    selectedDecision === decision 
                      ? "bg-gem-50 border-gem-600 text-gem-700 shadow-sm ring-1 ring-gem-600"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {decision}
                </button>
              ))}
            </div>
            
            {selectedDecision && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Mandatory Reason for {selectedDecision}
                </label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-800 outline-none focus:border-gem-600 focus:ring-1 focus:ring-gem-600 bg-slate-50 focus:bg-white transition resize-none h-20 shadow-2xs"
                  placeholder="Provide explicit justification for this decision. This will be permanently recorded in the audit trail..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                />
                <div className="mt-3 flex justify-end">
                  <button 
                    disabled={!overrideReason.trim()}
                    className="px-5 py-2 bg-gem-700 text-white text-sm font-semibold rounded-lg hover:bg-gem-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition"
                  >
                    Confirm & Record to Audit Trail
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
