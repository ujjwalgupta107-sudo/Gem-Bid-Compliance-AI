"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AiInsightsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const mockInsights = [
    {
      id: "INS-001",
      bidderId: "BID-1002",
      bidderName: "Sunrise Traders Private Limited",
      tenderRef: "GEM/2026/B/543210",
      type: "CONTRADICTION",
      confidence: 89,
      requirementRef: "TR02 (OEM Auth)",
      title: "Name Mismatch Detected",
      description: "The company name on the uploaded PAN card is 'Sunrise Traders', but the registered GeM profile name is 'Sunrise Traders Private Limited'.",
      timestamp: "2026-09-22T15:10:00Z"
    },
    {
      id: "INS-002",
      bidderId: "BID-1003",
      bidderName: "Coastal Industrial Suppliers LLP",
      tenderRef: "GEM/2026/B/543210",
      type: "ANOMALY",
      confidence: 94,
      requirementRef: "TR01 (Financials)",
      title: "Unusual Revenue Spike",
      description: "FY24 revenue shows a 450% YoY increase compared to FY23, which is highly anomalous for this sector. Requires auditor scrutiny.",
      timestamp: "2026-09-22T16:45:00Z"
    },
    {
      id: "INS-003",
      bidderId: "BID-1005",
      bidderName: "Pinnacle Infra Projects",
      tenderRef: "GEM/2026/B/543210",
      type: "SEMANTIC_MATCH",
      confidence: 98,
      requirementRef: "TR03 (Past Experience)",
      title: "Experience Context Alignment",
      description: "Tender requires 'heavy machinery supply'. Bidder evidence describes 'industrial equipment leasing'. AI confirms semantic equivalence.",
      timestamp: "2026-09-21T09:20:00Z"
    }
  ];

  const filteredInsights = mockInsights.filter(ins => {
    const matchesSearch = ins.bidderName.toLowerCase().includes(search.toLowerCase()) || ins.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || ins.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch(type) {
      case "CONTRADICTION": return "bg-rose-50 border-rose-200 text-rose-800";
      case "ANOMALY": return "bg-amber-50 border-amber-200 text-amber-800";
      case "SEMANTIC_MATCH": return "bg-emerald-50 border-emerald-200 text-emerald-800";
      default: return "bg-slate-50 border-slate-200 text-slate-800";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-gem-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            AI Insights Feed
          </h1>
          <p className="text-sm text-slate-500 mt-1">Review RAG-generated findings, semantic matches, and anomaly detections.</p>
        </div>
      </div>

      {mockInsights.length === 0 ? (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 text-gem-600">
             <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No AI findings yet</h2>
          <p className="text-slate-500 max-w-md">Run a verification to generate intelligent insights across your bidders.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search bidders or findings..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-gem-600 focus:ring-1 focus:ring-gem-600 transition shadow-2xs" 
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <select 
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 px-4 py-2 outline-none shadow-2xs"
            >
              <option value="ALL">All Types</option>
              <option value="CONTRADICTION">Contradictions</option>
              <option value="ANOMALY">Anomalies</option>
              <option value="SEMANTIC_MATCH">Semantic Matches</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredInsights.map(ins => (
              <div key={ins.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                <div className={`w-1.5 shrink-0 ${
                  ins.type === 'CONTRADICTION' ? 'bg-rose-500' : 
                  ins.type === 'ANOMALY' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></div>
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getTypeColor(ins.type)}`}>
                          {ins.type.replace('_', ' ')}
                        </span>
                        <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <svg className="w-3 h-3 text-gem-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                          {ins.confidence}% Confidence
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{ins.title}</h3>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-slate-700">{ins.bidderName}</p>
                       <p className="text-[10px] text-slate-400 font-mono mt-0.5">{ins.tenderRef} • {ins.requirementRef}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {ins.description}
                  </p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-400 font-medium">{new Date(ins.timestamp).toLocaleString()}</span>
                    <button 
                      onClick={() => router.push(`/evidence/${ins.bidderId}`)}
                      className="text-xs font-semibold px-3 py-1.5 bg-gem-50 text-gem-700 border border-gem-200 rounded-lg hover:bg-gem-100 transition flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View Evidence
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredInsights.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm bg-white border border-slate-200 rounded-xl">
                No insights match your filters.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
