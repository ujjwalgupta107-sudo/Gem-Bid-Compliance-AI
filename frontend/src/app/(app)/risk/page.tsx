"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RiskAnalysisPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const totalBidders = 32;
  const lowRiskCount = 20;
  const mediumRiskCount = 8;
  const highRiskCount = 4;

  const lowRiskPct = ((lowRiskCount / totalBidders) * 100).toFixed(1);
  const mediumRiskPct = ((mediumRiskCount / totalBidders) * 100).toFixed(1);
  const highRiskPct = ((highRiskCount / totalBidders) * 100).toFixed(1);

  const mockRiskData = [
    {
      id: "BID-1002",
      bidderName: "Sunrise Traders Private Limited",
      riskScore: 89, // Higher is worse risk in this context, or we can use compliance score (34). Let's use compliance score for consistency.
      complianceScore: 34,
      riskLevel: "FAIL",
      topFactors: ["Turnover threshold not met", "Name mismatch on PAN"],
    },
    {
      id: "BID-1003",
      bidderName: "Coastal Industrial Suppliers LLP",
      complianceScore: 68,
      riskLevel: "REVIEW",
      topFactors: ["Missing OEM Auth signature", "Udyam category ambiguous"],
    },
    {
      id: "BID-1005",
      bidderName: "Pinnacle Infra Projects",
      complianceScore: 72,
      riskLevel: "REVIEW",
      topFactors: ["Experience certificate unverified"],
    },
    {
      id: "BID-1001",
      bidderName: "ABC Technologies Pvt Ltd",
      complianceScore: 92,
      riskLevel: "PASS",
      topFactors: ["None"],
    }
  ];

  const filteredData = mockRiskData.filter(d => 
    d.bidderName.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.complianceScore - b.complianceScore); // Lowest compliance score = highest risk, sorted first

  const renderBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return <span className="badge badge-pass"><span className="w-1.5 h-1.5 rounded-full bg-status-pass mr-1"></span>Low</span>;
      case "REVIEW":
        return <span className="badge badge-review"><span className="w-1.5 h-1.5 rounded-full bg-status-review mr-1"></span>Medium</span>;
      case "FAIL":
        return <span className="badge badge-fail"><span className="w-1.5 h-1.5 rounded-full bg-status-fail mr-1"></span>High</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Risk Analysis</h1>
          <p className="text-sm text-slate-500 mt-1">Aggregate risk distribution and top risk factors across all active bids.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 shadow-sm transition">
            Export Analytics
          </button>
        </div>
      </div>

      {totalBidders === 0 ? (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
             <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No verifications run yet</h2>
          <p className="text-slate-500 max-w-md">Risk analysis requires at least one evaluated bidder.</p>
        </div>
      ) : (
        <>
          {/* Risk Distribution Chart/Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Overall Risk Distribution</h2>
            
            <div className="w-full flex h-8 rounded-xl overflow-hidden mb-4 border border-slate-200/50 shadow-inner">
              <div className="bg-status-pass h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${lowRiskPct}%` }}>{lowRiskCount}</div>
              <div className="bg-status-review h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${mediumRiskPct}%` }}>{mediumRiskCount}</div>
              <div className="bg-status-fail h-full flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${highRiskPct}%` }}>{highRiskCount}</div>
            </div>

            <div className="flex justify-between items-center sm:w-2/3 mx-auto mt-6">
              <div className="text-center">
                <p className="text-3xl font-black text-slate-800">{lowRiskPct}%</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-pass"></span>
                  <span className="text-xs font-bold text-slate-500 uppercase">Low Risk</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-slate-800">{mediumRiskPct}%</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-review"></span>
                  <span className="text-xs font-bold text-slate-500 uppercase">Medium Risk</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-slate-800">{highRiskPct}%</p>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-fail"></span>
                  <span className="text-xs font-bold text-slate-500 uppercase">High Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ranked Bidders Table */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Bidder Risk Ranking</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search bidders..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-64 pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-gem-600 focus:ring-1 focus:ring-gem-600 transition shadow-2xs" 
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-white border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4 pl-6 whitespace-nowrap">Bidder Name</th>
                    <th className="p-4 text-center whitespace-nowrap">Risk Category</th>
                    <th className="p-4 text-center whitespace-nowrap">Compliance Score</th>
                    <th className="p-4 whitespace-nowrap w-1/2">Top Risk Factors</th>
                    <th className="p-4 text-right pr-6 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map(bidder => (
                    <tr 
                      key={bidder.id} 
                      onClick={() => router.push(`/evidence/${bidder.id}`)}
                      className="hover:bg-slate-50 transition cursor-pointer group relative"
                    >
                      {bidder.riskLevel === "FAIL" && <td className="absolute left-0 top-0 bottom-0 w-1 bg-status-fail z-10"></td>}
                      <td className="p-4 pl-6 font-bold text-slate-900 border-r border-slate-50">
                        {bidder.bidderName}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{bidder.id}</div>
                      </td>
                      <td className="p-4 text-center border-r border-slate-50">
                        {renderBadge(bidder.riskLevel)}
                      </td>
                      <td className="p-4 text-center border-r border-slate-50">
                        <span className={`font-black ${bidder.complianceScore >= 80 ? 'text-emerald-700' : bidder.complianceScore >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                          {bidder.complianceScore}
                        </span>
                      </td>
                      <td className="p-4">
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                          {bidder.topFactors.map((factor, idx) => (
                            <li key={idx} className={factor === "None" ? "text-slate-400 list-none" : ""}>{factor}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 pr-6 flex items-center justify-end h-full">
                        <span className="text-gem-600 hover:text-gem-800 font-semibold text-xs group-hover:underline inline-flex items-center gap-1">
                          View Dossier <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                        No bidders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
