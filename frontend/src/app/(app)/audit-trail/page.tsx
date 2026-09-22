"use client";
import React, { useState } from "react";

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mockAuditEvents = [
    {
      id: "EVT-004",
      timestamp: "2026-09-22T16:15:22Z",
      type: "OFFICER_OVERRIDE",
      actor: "Arvind Krishnan (CPCL_PROC_01)",
      target: "BID-1002",
      description: "Officer overrode FAIL status to ACCEPT WITH CONDITIONS. Reason: Minor name mismatch verified via physical affidavit.",
      hash: "a8f9c21b3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
      prevHash: "b7e8d9c0b1a293847564534231201928374655647382910abcdfef1234567890",
      payload: {
        decision: "ACCEPT_WITH_CONDITIONS",
        reason: "Minor name mismatch verified via physical affidavit.",
        ruleRef: "TR02"
      }
    },
    {
      id: "EVT-003",
      timestamp: "2026-09-22T15:10:05Z",
      type: "AI_FINDING_GENERATED",
      actor: "Gem_Compliance_AI (v2.1.0)",
      target: "BID-1002",
      description: "Detected contradiction in entity name between PAN and GeM profile.",
      hash: "b7e8d9c0b1a293847564534231201928374655647382910abcdfef1234567890",
      prevHash: "c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
      payload: {
        confidence: 89,
        type: "CONTRADICTION",
        finding: "Name Mismatch Detected"
      }
    },
    {
      id: "EVT-002",
      timestamp: "2026-09-22T15:10:02Z",
      type: "RULE_EVALUATION",
      actor: "System",
      target: "BID-1002",
      description: "Evaluated rule TR01: Financial Turnover. Result: FAIL.",
      hash: "c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7",
      prevHash: "d5c6b7a89091827364534231201928374655647382910abcdfef1234567890",
      payload: {
        extractedValue: 12050000,
        requiredValue: 30000000,
        result: "FAIL"
      }
    },
    {
      id: "EVT-001",
      timestamp: "2026-09-22T15:09:50Z",
      type: "SOURCE_SYNC",
      actor: "API_Gateway",
      target: "GSTN",
      description: "Fetched GSTN compliance status for 07AAAAA0000A1Z5. Result: ACTIVE.",
      hash: "d5c6b7a89091827364534231201928374655647382910abcdfef1234567890",
      prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
      payload: {
        endpoint: "/v2/taxpayer/status",
        latencyMs: 142,
        status: "ACTIVE"
      }
    }
  ];

  const filteredEvents = mockAuditEvents.filter(evt => 
    evt.description.toLowerCase().includes(search.toLowerCase()) || 
    evt.target.toLowerCase().includes(search.toLowerCase()) ||
    evt.actor.toLowerCase().includes(search.toLowerCase())
  );

  const getEventIcon = (type: string) => {
    switch(type) {
      case "OFFICER_OVERRIDE": return <div className="w-8 h-8 rounded-full bg-gem-100 text-gem-700 flex items-center justify-center border border-gem-200 z-10"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>;
      case "AI_FINDING_GENERATED": return <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200 z-10"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg></div>;
      case "RULE_EVALUATION": return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 z-10"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>;
      case "SOURCE_SYNC": return <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 z-10"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div>;
      default: return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center border border-slate-200 z-10"></div>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Audit Trail
          </h1>
          <p className="text-sm text-slate-500 mt-1">Immutable cryptographic log of all system actions, evaluations, and officer overrides.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 shadow-sm transition">
            Export JSON
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
         <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search by ID, actor, or description..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-gem-600 focus:ring-1 focus:ring-gem-600 transition shadow-2xs" 
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
         </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm bg-white border border-slate-200 rounded-xl">
          No audit events found.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-hidden">
          <div className="relative">
            {/* The chain line */}
            <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200 z-0"></div>

            <div className="space-y-8">
              {filteredEvents.map((evt, idx) => (
                <div key={evt.id} className="relative flex gap-6 group">
                  {getEventIcon(evt.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div 
                      className={`border rounded-lg p-4 transition-all cursor-pointer hover:border-slate-300 ${expandedId === evt.id ? 'border-slate-300 bg-slate-50 shadow-inner' : 'border-slate-200 bg-white shadow-2xs'}`}
                      onClick={() => setExpandedId(expandedId === evt.id ? null : evt.id)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold text-slate-500">{evt.type.replace(/_/g, ' ')}</span>
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{evt.id}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 leading-snug">{evt.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-medium text-slate-500">{new Date(evt.timestamp).toLocaleString()}</p>
                          <p className="text-[10px] font-semibold text-gem-700 mt-0.5">Actor: {evt.actor}</p>
                        </div>
                      </div>
                      
                      {/* Cryptographic Link Visual */}
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-mono">
                        <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        <div className="truncate text-slate-400" title={evt.hash}>SHA-256: {evt.hash.substring(0, 16)}...</div>
                        <span className="text-slate-300">&larr;</span>
                        <div className="truncate text-slate-400" title={evt.prevHash}>Prev: {evt.prevHash.substring(0, 8)}...</div>
                      </div>

                      {/* Expanded Payload Details */}
                      {expandedId === evt.id && (
                        <div className="mt-4 pt-4 border-t border-slate-200 animate-in slide-in-from-top-2 duration-200">
                           <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Event Payload</p>
                           <pre className="bg-slate-800 text-slate-300 p-3 rounded text-[11px] font-mono overflow-x-auto">
                             {JSON.stringify(evt.payload, null, 2)}
                           </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
