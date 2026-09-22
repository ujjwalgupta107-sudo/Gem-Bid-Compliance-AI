"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ComplianceMatrixPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");
  const [activeTab, setActiveTab] = useState(initialStatus || "ALL");

  const requirements = [
    { code: "TR01", label: "Financial Turnover" },
    { code: "TR02", label: "OEM Authorization" },
    { code: "TR03", label: "Past Experience" },
    { code: "TR04", label: "Local Content" },
  ];

  const bidders = [
    {
      id: "BID-1001",
      name: "ABC Technologies Pvt Ltd",
      status: "PASS",
      score: 92,
      risk: "LOW",
      evaluations: { TR01: "PASS", TR02: "PASS", TR03: "PASS", TR04: "N-A" }
    },
    {
      id: "BID-1002",
      name: "Sunrise Traders Private Limited",
      status: "FAIL",
      score: 34,
      risk: "HIGH",
      evaluations: { TR01: "FAIL", TR02: "PASS", TR03: "FAIL", TR04: "PASS" },
      flagged: true
    },
    {
      id: "BID-1003",
      name: "Coastal Industrial Suppliers LLP",
      status: "REVIEW",
      score: 68,
      risk: "MEDIUM",
      evaluations: { TR01: "PASS", TR02: "REVIEW", TR03: "PASS", TR04: "PASS" }
    },
    {
      id: "BID-1004",
      name: "Nexus Electronics India",
      status: "PASS",
      score: 88,
      risk: "LOW",
      evaluations: { TR01: "PASS", TR02: "PASS", TR03: "PASS", TR04: "PASS" }
    },
  ];

  const filteredBidders = activeTab === "ALL" 
    ? bidders 
    : bidders.filter(b => b.status === activeTab);

  const renderBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return <span className="badge badge-pass"><span className="w-1.5 h-1.5 rounded-full bg-status-pass mr-1"></span>PASS</span>;
      case "REVIEW":
        return <span className="badge badge-review"><span className="w-1.5 h-1.5 rounded-full bg-status-review mr-1"></span>REVIEW</span>;
      case "FAIL":
        return <span className="badge badge-fail"><span className="w-1.5 h-1.5 rounded-full bg-status-fail mr-1"></span>FAIL</span>;
      default:
        return <span className="badge badge-na">N-A</span>;
    }
  };

  const renderGridCell = (status: string, bidderId: string) => {
    let bg = "bg-slate-50";
    let icon = null;
    
    if (status === "PASS") { bg = "bg-status-passBg"; icon = <svg className="w-4 h-4 text-status-pass" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>; }
    else if (status === "REVIEW") { bg = "bg-status-reviewBg"; icon = <svg className="w-4 h-4 text-status-review" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/></svg>; }
    else if (status === "FAIL") { bg = "bg-status-failBg"; icon = <svg className="w-4 h-4 text-status-fail" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>; }
    else { icon = <span className="text-[10px] text-slate-400 font-bold">N/A</span>; }

    return (
      <Link href={`/evidence/${bidderId}`} className={`w-8 h-8 mx-auto flex items-center justify-center rounded ${bg} border border-white/50 cursor-pointer hover:ring-2 hover:ring-gem-400 transition`}>
        {icon}
      </Link>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Tender: GEM/2026/B/543210</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Compliance Matrix</h1>
          <p className="text-sm text-slate-500 mt-1">Cross-reference all bidders against mandatory tender requirements.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs">Density: Compact</button>
          <button className="px-3 py-1.5 text-xs font-semibold bg-gem-700 text-white rounded-lg hover:bg-gem-800 shadow-sm flex items-center gap-2">
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Export Matrix
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {["ALL", "PASS", "REVIEW", "FAIL"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition relative ${activeTab === tab ? "text-gem-700" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gem-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Data Table (Compact Density) */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 pl-6 font-bold text-slate-700 w-1/4 whitespace-nowrap">Bidder Name</th>
                <th className="p-3 font-bold text-slate-700 whitespace-nowrap w-24">Overall Status</th>
                <th className="p-3 font-bold text-slate-700 text-center w-20">Score</th>
                {requirements.map(req => (
                  <th key={req.code} className="p-3 text-center border-l border-slate-100 min-w-[80px]">
                    <div className="text-[10px] uppercase font-bold text-slate-500 truncate" title={req.label}>{req.code}</div>
                    <div className="text-[9px] text-slate-400 truncate max-w-[80px] mx-auto" title={req.label}>{req.label}</div>
                  </th>
                ))}
                <th className="p-3 text-right pr-6 font-bold text-slate-700 w-16">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBidders.length === 0 ? (
                <tr>
                  <td colSpan={5 + requirements.length} className="p-12 text-center text-slate-500">
                    No bidders found for this filter.
                  </td>
                </tr>
              ) : (
                filteredBidders.map(bidder => (
                  <tr key={bidder.id} className="hover:bg-slate-50 transition relative group">
                    {/* Persistent high risk visual treatment */}
                    {bidder.flagged && <td className="absolute left-0 top-0 bottom-0 w-1 bg-status-fail z-10"></td>}
                    
                    <td className="p-3 pl-6 font-semibold text-slate-900 border-r border-slate-50">
                      <div className="flex items-center gap-2">
                        {bidder.name}
                        {bidder.flagged && <span className="bg-status-fail text-white text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">Flagged</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{bidder.id}</div>
                    </td>
                    <td className="p-3 border-r border-slate-50">
                      {renderBadge(bidder.status)}
                    </td>
                    <td className="p-3 text-center border-r border-slate-50">
                      <span className={`font-black ${bidder.score >= 80 ? 'text-emerald-700' : bidder.score >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                        {bidder.score}
                      </span>
                    </td>
                    
                    {/* Requirements Grid */}
                    {requirements.map(req => (
                      <td key={req.code} className="p-2 border-l border-slate-100 text-center">
                        {renderGridCell(bidder.evaluations[req.code as keyof typeof bidder.evaluations], bidder.id)}
                      </td>
                    ))}

                    <td className="p-3 text-right pr-6 border-l border-slate-100">
                      <Link href={`/evidence/${bidder.id}`} className="text-xs font-semibold text-gem-600 hover:text-gem-800 hover:underline inline-flex items-center gap-1">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
