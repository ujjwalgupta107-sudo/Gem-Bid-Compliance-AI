"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { DashboardSummary } from "@/lib/types";
import ComplianceIntelligenceCore3D from "@/components/3d/ComplianceIntelligenceCore3D";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredKpi, setHoveredKpi] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<DashboardSummary>("/dashboard/summary")
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Failed to load dashboard summary", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const compliantCount = data?.compliant_bids ?? 0;
  const reviewCount = data?.bids_under_review ?? 0;
  const nonCompliantCount = data?.high_risk_bids ?? 0;
  const totalBids = compliantCount + reviewCount + nonCompliantCount;
  
  const passRate = totalBids > 0 ? ((compliantCount / totalBids) * 100).toFixed(1) : "0.0";
  const reviewRate = totalBids > 0 ? ((reviewCount / totalBids) * 100).toFixed(1) : "0.0";
  const failRate = totalBids > 0 ? ((nonCompliantCount / totalBids) * 100).toFixed(1) : "0.0";

  const kpiCards = [
    {
      id: "total",
      label: "Total Bids",
      value: totalBids,
      href: "/matrix",
      color: "gem",
      bgClass: "bg-[#00F5FF]/10",
      borderClass: "border-[#00F5FF]/20",
      textClass: "text-[#00F5FF]",
      iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      trend: `${data?.active_tenders ?? 0} active tenders`,
    },
    {
      id: "compliant",
      label: "Verified Compliant",
      value: compliantCount,
      href: "/matrix?status=PASS",
      color: "emerald",
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
      textClass: "text-emerald-400",
      iconPath: "M5 13l4 4L19 7",
      trend: `${passRate}% pass rate`,
    },
    {
      id: "review",
      label: "Under Officer Review",
      value: reviewCount,
      href: "/matrix?status=REVIEW",
      color: "amber",
      bgClass: "bg-amber-500/10",
      borderClass: "border-amber-500/20",
      textClass: "text-amber-400",
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      trend: "Requires manual verification",
    },
    {
      id: "flagged",
      label: "Flagged / High Risk",
      value: nonCompliantCount,
      href: "/matrix?status=FAIL",
      color: "rose",
      bgClass: "bg-rose-500/10",
      borderClass: "border-rose-500/20",
      textClass: "text-rose-400",
      iconPath: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
      trend: `${failRate}% fail rate`,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Bid Compliance Overview</h1>
          <p className="text-sm text-slate-300 mt-1">Monitor tender verification, statutory compliance and bidder risk in real time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export Report
          </button>
          <button 
            onClick={() => router.push("/tenders")}
            className="btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            New Verification
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-[#0F172A]/40 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-sm animate-pulse h-32">
              <div className="h-4 bg-white/10 rounded w-24 mb-3" />
              <div className="h-8 bg-white/10 rounded w-16" />
            </div>
          ))}
        </div>
      ) : totalBids === 0 ? (
        <div className="w-full bg-[#0F172A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(0,245,255,0.03)] animate-fade-in-up">
          <div className="w-16 h-16 bg-[#00F5FF]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#00F5FF]/20 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
             <svg className="w-8 h-8 text-[#00F5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No bids evaluated yet</h2>
          <p className="text-slate-300 max-w-md">Connect your first tender to start automatically evaluating bidder compliance and extracting AI insights.</p>
          <button onClick={() => router.push("/tenders")} className="mt-6 btn-primary py-2.5">
            Import Tender
          </button>
        </div>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in-up delay-100">
            {kpiCards.map((kpi) => (
              <Link
                key={kpi.id}
                href={kpi.href}
                className="bg-[#0F172A]/40 backdrop-blur-md rounded-2xl p-5 border border-white/10 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,245,255,0.1)] hover:border-[#00F5FF]/30 hover:-translate-y-0.5 transition-all cursor-pointer"
                onMouseEnter={() => setHoveredKpi(kpi.id)}
                onMouseLeave={() => setHoveredKpi(null)}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[3rem] ${kpi.bgClass} opacity-40 group-hover:opacity-60 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${kpi.bgClass} flex items-center justify-center border ${kpi.borderClass} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                      <svg className={`w-4 h-4 ${kpi.textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={kpi.iconPath} />
                      </svg>
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{kpi.label}</p>
                  </div>
                  <p className="text-4xl font-black text-white tracking-tight">{kpi.value}</p>
                  
                  {/* Expanded info on hover */}
                  <div className={`mt-2 overflow-hidden transition-all duration-300 ${hoveredKpi === kpi.id ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className={`text-xs font-semibold ${kpi.textClass}`}>{kpi.trend}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* COMPLIANCE STATUS + 3D COMMAND CENTER */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in-up delay-200">
            
            {/* LEFT COLUMN: DONUT & CONNECTORS TEXT */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              
              {/* COMPLIANCE DONUT CHART */}
              <div className="bg-[#0F172A]/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.2)] p-6 hover:border-white/20 transition-colors h-full flex flex-col">
                <h2 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]"></span>
                  Compliance Status
                </h2>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-40 h-40 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <path className="text-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${passRate}, 100`} strokeLinecap="round" strokeWidth="3" />
                      <path className="text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${reviewRate}, 100`} strokeDashoffset={`-${passRate}`} strokeWidth="3" />
                      <path className="text-rose-500 drop-shadow-[0_0_3px_rgba(244,63,94,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${failRate}, 100`} strokeDashoffset={`-${parseFloat(passRate) + parseFloat(reviewRate)}`} strokeWidth="3" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-white">{totalBids}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 mt-1">Total Bids</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm font-medium w-full">
                    <Link href="/matrix?status=PASS" className="flex justify-between items-center bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition cursor-pointer group">
                      <span className="flex items-center gap-2 text-emerald-400 group-hover:text-emerald-300 transition-colors"><svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Compliant</span>
                      <span className="font-bold text-white">{compliantCount} <span className="text-emerald-400/80 ml-1 font-normal">({passRate}%)</span></span>
                    </Link>
                    <Link href="/matrix?status=REVIEW" className="flex justify-between items-center bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition cursor-pointer group">
                      <span className="flex items-center gap-2 text-amber-400 group-hover:text-amber-300 transition-colors">
                        <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/>
                        </svg> 
                        Under Review
                      </span>
                      <span className="font-bold text-white">{reviewCount} <span className="text-amber-400/80 ml-1 font-normal">({reviewRate}%)</span></span>
                    </Link>
                    <Link href="/matrix?status=FAIL" className="flex justify-between items-center bg-rose-500/10 p-3.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 transition cursor-pointer group">
                      <span className="flex items-center gap-2 text-rose-400 group-hover:text-rose-300 transition-colors"><svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Flagged</span>
                      <span className="font-bold text-white">{nonCompliantCount} <span className="text-rose-400/80 ml-1 font-normal">({failRate}%)</span></span>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* GOVERNMENT CONNECTORS STATUS (Compact) */}
              <div className="bg-[#0F172A]/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col hover:border-white/20 transition-colors">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h2 className="text-sm font-bold text-white">Registries</h2>
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-bold px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Live
                  </div>
                </div>
                <div className="flex-1 divide-y divide-white/5">
                  {[
                    { code: "UDYAM", status: "Operational", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { code: "GSTN", status: "Operational", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { code: "PAN", status: "Operational", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { code: "CPPP", status: "Degraded", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                  ].map((conn) => (
                    <button key={conn.code} onClick={() => router.push('/government-connectors')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-mono text-[9px] font-bold border ${conn.bg} ${conn.color} ${conn.border} group-hover:scale-105 transition-transform`}>
                          {conn.code}
                        </div>
                        <p className="text-xs font-semibold text-white group-hover:text-[#00F5FF] transition-colors">{conn.code}</p>
                      </div>
                      <span className={`w-1.5 h-1.5 rounded-full ${conn.color === 'text-emerald-400' ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.8)]'}`}></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 3D INTELLIGENCE CORE */}
            <div className="xl:col-span-2 flex flex-col h-full">
               <ComplianceIntelligenceCore3D />
            </div>

          </div>

          {/* RECENT ACTIVITY FEED */}
          {data?.recent_activity && data.recent_activity.length > 0 && (
            <div className="bg-[#0F172A]/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden animate-fade-in-up delay-300">
              <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0070F3]"></span>
                    Recent Activity
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">Latest system events and verifications</p>
                </div>
                <Link href="/audit-trail" className="text-[11px] uppercase tracking-wider font-bold text-[#00F5FF] hover:text-white transition-colors">
                  View Full Audit Trail →
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {data.recent_activity.slice(0, 8).map((event, idx) => (
                  <div key={idx} className="px-5 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-default">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]">
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        <span className="font-bold text-[#00F5FF]">{event.actor}</span> {event.action}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">{event.entity_type}</p>
                    </div>
                    <span className="text-xs text-slate-300 font-mono shrink-0">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECENT TENDERS */}
          {data?.recent_tenders && data.recent_tenders.length > 0 && (
            <div className="bg-[#0F172A]/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden animate-fade-in-up delay-400">
              <div className="p-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]"></span>
                    Priority Tenders
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">Active tenders requiring attention</p>
                </div>
                <Link href="/tenders" className="text-[11px] uppercase tracking-wider font-bold text-[#00F5FF] hover:text-white transition-colors">
                  View All Tenders →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] font-bold text-slate-300 uppercase tracking-wider border-b border-white/10">
                      <th className="px-5 py-4">Tender</th>
                      <th className="px-5 py-4">Organization</th>
                      <th className="px-5 py-4 hidden md:table-cell">Category</th>
                      <th className="px-5 py-4 text-right hidden sm:table-cell">Value</th>
                      <th className="px-5 py-4 text-right">Bids</th>
                      <th className="px-5 py-4 text-right">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {data.recent_tenders.map((tender) => (
                      <tr key={tender.id} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => router.push(`/tenders/${tender.id}`)}>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white group-hover:text-[#00F5FF] transition-colors truncate max-w-[200px]">{tender.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tender.tender_number}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{tender.organization}</td>
                        <td className="px-5 py-4 text-slate-400 hidden md:table-cell">{tender.category}</td>
                        <td className="px-5 py-4 text-right font-mono text-[#00F5FF] hidden sm:table-cell">
                          ₹{(tender.estimated_value / 10000000).toFixed(1)}Cr
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-white">{tender.bid_count}</td>
                        <td className="px-5 py-4 text-right">
                          {tender.max_risk ? (
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                              tender.max_risk === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              tender.max_risk === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>{tender.max_risk}</span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
