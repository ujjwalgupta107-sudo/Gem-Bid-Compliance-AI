"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ComplianceReportsPage() {
  const [search, setSearch] = useState("");

  const mockReports = [
    {
      id: "REP-9921",
      bidderName: "ABC Technologies Pvt Ltd",
      tenderRef: "GEM/2026/B/543210",
      score: 92,
      risk: "PASS",
      dateGenerated: "2026-09-22T14:30:00Z"
    },
    {
      id: "REP-9922",
      bidderName: "Sunrise Traders Private Limited",
      tenderRef: "GEM/2026/B/543210",
      score: 34,
      risk: "FAIL",
      dateGenerated: "2026-09-22T15:10:00Z"
    },
    {
      id: "REP-9923",
      bidderName: "Coastal Industrial Suppliers LLP",
      tenderRef: "GEM/2026/B/543210",
      score: 68,
      risk: "REVIEW",
      dateGenerated: "2026-09-22T16:45:00Z"
    }
  ];

  const filteredReports = mockReports.filter(r => 
    r.bidderName.toLowerCase().includes(search.toLowerCase()) || 
    r.tenderRef.toLowerCase().includes(search.toLowerCase())
  );

  const renderBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return <span className="badge badge-pass"><span className="w-1.5 h-1.5 rounded-full bg-status-pass mr-1"></span>Low Risk</span>;
      case "REVIEW":
        return <span className="badge badge-review"><span className="w-1.5 h-1.5 rounded-full bg-status-review mr-1"></span>Medium Risk</span>;
      case "FAIL":
        return <span className="badge badge-fail"><span className="w-1.5 h-1.5 rounded-full bg-status-fail mr-1"></span>High Risk</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Compliance Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Official CVC/CAG-ready verification reports for evaluated bidders.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gem-700 text-white text-sm font-semibold rounded-lg hover:bg-gem-800 shadow-md transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Generate New Report
          </button>
        </div>
      </div>

      {mockReports.length === 0 ? (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
             <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No compliance reports generated yet</h2>
          <p className="text-slate-500 max-w-md">Run a bidder verification to generate official compliance documents.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search reports..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-64 pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-gem-600 focus:ring-1 focus:ring-gem-600 transition shadow-2xs" 
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filter
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 whitespace-nowrap">Report ID</th>
                  <th className="p-4 whitespace-nowrap">Bidder Name</th>
                  <th className="p-4 whitespace-nowrap">Tender Ref</th>
                  <th className="p-4 text-center whitespace-nowrap">Compliance Score</th>
                  <th className="p-4 text-center whitespace-nowrap">Risk Level</th>
                  <th className="p-4 whitespace-nowrap">Date Generated</th>
                  <th className="p-4 text-right pr-6 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50 transition group">
                    <td className="p-4 pl-6 font-mono text-slate-500 font-semibold text-xs">{report.id}</td>
                    <td className="p-4 font-bold text-slate-900">{report.bidderName}</td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{report.tenderRef}</td>
                    <td className="p-4 text-center">
                      <span className={`font-black ${report.score >= 80 ? 'text-emerald-700' : report.score >= 50 ? 'text-amber-700' : 'text-rose-700'}`}>
                        {report.score}
                      </span>
                    </td>
                    <td className="p-4 text-center">{renderBadge(report.risk)}</td>
                    <td className="p-4 text-slate-500 text-xs">
                      {new Date(report.dateGenerated).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4 pr-6 flex items-center justify-end gap-3">
                      <button className="text-gem-600 hover:text-gem-800 font-semibold text-xs hover:underline">View</button>
                      <button className="text-slate-500 hover:text-slate-800 transition p-1.5 rounded bg-slate-100 hover:bg-slate-200" title="Download PDF">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 text-sm">
                      No reports match your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
