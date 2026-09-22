"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { DashboardSummary } from "@/lib/types";

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
      bgClass: "bg-gem-50",
      borderClass: "border-gem-200",
      textClass: "text-gem-700",
      iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      trend: `${data?.active_tenders ?? 0} active tenders`,
    },
    {
      id: "compliant",
      label: "Verified Compliant",
      value: compliantCount,
      href: "/matrix?status=PASS",
      color: "emerald",
      bgClass: "bg-emerald-50",
      borderClass: "border-emerald-200",
      textClass: "text-emerald-700",
      iconPath: "M5 13l4 4L19 7",
      trend: `${passRate}% pass rate`,
    },
    {
      id: "review",
      label: "Under Officer Review",
      value: reviewCount,
      href: "/matrix?status=REVIEW",
      color: "amber",
      bgClass: "bg-amber-50",
      borderClass: "border-amber-200",
      textClass: "text-amber-700",
      iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      trend: "Requires manual verification",
    },
    {
      id: "flagged",
      label: "Flagged / High Risk",
      value: nonCompliantCount,
      href: "/matrix?status=FAIL",
      color: "rose",
      bgClass: "bg-rose-50",
      borderClass: "border-rose-200",
      textClass: "text-rose-700",
      iconPath: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
      trend: `${failRate}% fail rate`,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bid Compliance Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor tender verification, statutory compliance and bidder risk in real time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-secondary">
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
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm animate-pulse h-32">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : totalBids === 0 ? (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm animate-fade-in-up">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
             <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No bids evaluated yet</h2>
          <p className="text-slate-500 max-w-md">Connect your first tender to start automatically evaluating bidder compliance and extracting AI insights.</p>
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
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                onMouseEnter={() => setHoveredKpi(kpi.id)}
                onMouseLeave={() => setHoveredKpi(null)}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[3rem] ${kpi.bgClass} opacity-40 group-hover:opacity-60 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg ${kpi.bgClass} flex items-center justify-center border ${kpi.borderClass}`}>
                      <svg className={`w-4 h-4 ${kpi.textClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={kpi.iconPath} />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{kpi.value}</p>
                  
                  {/* Expanded info on hover */}
                  <div className={`mt-2 overflow-hidden transition-all duration-300 ${hoveredKpi === kpi.id ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className={`text-xs font-semibold ${kpi.textClass}`}>{kpi.trend}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* COMPLIANCE STATUS + CONNECTORS */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in-up delay-200">
            {/* COMPLIANCE DONUT CHART */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-6">Compliance Status Distribution</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-44 h-44 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-status-pass" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${passRate}, 100`} strokeLinecap="round" strokeWidth="3" />
                    <path className="text-status-review" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${reviewRate}, 100`} strokeDashoffset={`-${passRate}`} strokeWidth="3" />
                    <path className="text-status-fail" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${failRate}, 100`} strokeDashoffset={`-${parseFloat(passRate) + parseFloat(reviewRate)}`} strokeWidth="3" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900">{totalBids}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Total Bids</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm font-medium flex-1 w-full">
                  <Link href="/matrix?status=PASS" className="flex justify-between items-center bg-status-passBg p-3 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition cursor-pointer">
                    <span className="flex items-center gap-2 text-emerald-800"><svg className="w-4 h-4 text-status-pass" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Compliant</span>
                    <span className="font-bold text-emerald-700">{compliantCount} <span className="text-emerald-500/80 ml-1 font-normal">({passRate}%)</span></span>
                  </Link>
                  <Link href="/matrix?status=REVIEW" className="flex justify-between items-center bg-status-reviewBg p-3 rounded-lg border border-amber-200 hover:bg-amber-100 transition cursor-pointer">
                    <span className="flex items-center gap-2 text-amber-900">
                      <svg className="w-4 h-4 text-status-review" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/>
                      </svg> 
                      Under Review
                    </span>
                    <span className="font-bold text-amber-800">{reviewCount} <span className="text-amber-600/80 ml-1 font-normal">({reviewRate}%)</span></span>
                  </Link>
                  <Link href="/matrix?status=FAIL" className="flex justify-between items-center bg-status-failBg p-3 rounded-lg border border-rose-200 hover:bg-rose-100 transition cursor-pointer">
                    <span className="flex items-center gap-2 text-rose-900"><svg className="w-4 h-4 text-status-fail" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Flagged</span>
                    <span className="font-bold text-rose-800">{nonCompliantCount} <span className="text-rose-600/80 ml-1 font-normal">({failRate}%)</span></span>
                  </Link>
                </div>
              </div>
            </div>

            {/* GOVERNMENT CONNECTORS STATUS */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Government Connectors</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Registry health status</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Operational
                </div>
              </div>
              <div className="flex-1 divide-y divide-slate-100">
                {[
                  { name: "Udyam (MSME)", code: "UDYAM", status: "Operational", color: "text-status-pass", bg: "bg-status-passBg", border: "border-emerald-200", sync: "2 mins ago" },
                  { name: "GSTN", code: "GST", status: "Operational", color: "text-status-pass", bg: "bg-status-passBg", border: "border-emerald-200", sync: "5 mins ago" },
                  { name: "Income Tax (PAN)", code: "PAN", status: "Operational", color: "text-status-pass", bg: "bg-status-passBg", border: "border-emerald-200", sync: "10 mins ago" },
                  { name: "CPPP API", code: "CPPP", status: "Degraded", color: "text-status-review", bg: "bg-status-reviewBg", border: "border-amber-200", sync: "1 hour ago" },
                ].map((conn) => (
                  <button key={conn.code} onClick={() => router.push('/government-connectors')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-mono text-[10px] font-bold border ${conn.bg} ${conn.color} ${conn.border}`}>
                        {conn.code}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{conn.name}</p>
                        <p className="text-[10px] text-slate-400">{conn.sync}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${conn.bg} ${conn.color} ${conn.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${conn.color === 'text-status-pass' ? 'bg-status-pass' : 'bg-status-review'}`}></span>
                      {conn.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY FEED */}
          {data?.recent_activity && data.recent_activity.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up delay-300">
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Latest system events and verifications</p>
                </div>
                <Link href="/audit-trail" className="text-xs font-semibold text-gem-600 hover:text-gem-800 transition">
                  View Full Audit Trail →
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {data.recent_activity.slice(0, 8).map((event, idx) => (
                  <div key={idx} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 font-medium truncate">
                        <span className="font-bold">{event.actor}</span> {event.action}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{event.entity_type}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium shrink-0">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECENT TENDERS */}
          {data?.recent_tenders && data.recent_tenders.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up delay-400">
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Priority Tenders</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Active tenders requiring attention</p>
                </div>
                <Link href="/tenders" className="text-xs font-semibold text-gem-600 hover:text-gem-800 transition">
                  View All Tenders →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <th className="px-5 py-3">Tender</th>
                      <th className="px-5 py-3">Organization</th>
                      <th className="px-5 py-3 hidden md:table-cell">Category</th>
                      <th className="px-5 py-3 text-right hidden sm:table-cell">Value</th>
                      <th className="px-5 py-3 text-right">Bids</th>
                      <th className="px-5 py-3 text-right">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {data.recent_tenders.map((tender) => (
                      <tr key={tender.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => router.push(`/tenders/${tender.id}`)}>
                        <td className="px-5 py-3">
                          <p className="font-semibold text-slate-900 truncate max-w-[200px]">{tender.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{tender.tender_number}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{tender.organization}</td>
                        <td className="px-5 py-3 text-slate-500 hidden md:table-cell">{tender.category}</td>
                        <td className="px-5 py-3 text-right font-mono text-slate-700 hidden sm:table-cell">
                          ₹{(tender.estimated_value / 10000000).toFixed(1)}Cr
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-slate-700">{tender.bid_count}</td>
                        <td className="px-5 py-3 text-right">
                          {tender.max_risk ? (
                            <span className={`badge ${
                              tender.max_risk === 'LOW' ? 'risk-low' :
                              tender.max_risk === 'MEDIUM' ? 'risk-medium' : 'risk-high'
                            }`}>{tender.max_risk}</span>
                          ) : (
                            <span className="badge badge-na">N/A</span>
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
