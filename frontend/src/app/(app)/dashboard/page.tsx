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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bid Compliance Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor tender verification, statutory compliance and bidder risk in real time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 shadow-sm transition">
            Export Report
          </button>
          <button 
            onClick={() => router.push("/tenders")}
            className="px-4 py-2 bg-gem-700 text-white text-sm font-semibold rounded-lg hover:bg-gem-800 shadow-md transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            New Verification
          </button>
        </div>
      </div>

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gem-200 border-t-gem-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Loading dashboard data...</p>
          </div>
        </div>
      ) : totalBids === 0 ? (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
             <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No bids evaluated yet</h2>
          <p className="text-slate-500 max-w-md">Connect your first tender to start automatically evaluating bidder compliance and extracting AI insights.</p>
          <button onClick={() => router.push("/tenders")} className="mt-6 px-4 py-2 bg-gem-700 text-white font-semibold rounded-lg hover:bg-gem-800 shadow-md">
            Import Tender
          </button>
        </div>
      ) : (
        <>
          {/* KPI CARDS (Clickable, linking to filtered matrix) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link href="/matrix" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bids</h3>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{totalBids}</span>
              </div>
              <div className="mt-3 text-xs text-slate-500 font-medium">
                100% evaluated
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full w-full"></div>
              </div>
            </Link>

            <Link href="/matrix?status=PASS" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-status-passBg text-status-pass flex items-center justify-center border border-emerald-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliant</h3>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{compliantCount}</span>
              </div>
              <div className="mt-3 text-xs text-status-pass font-bold">
                {passRate}% pass rate
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-status-pass h-full rounded-full" style={{ width: `${passRate}%` }}></div>
              </div>
            </Link>

            <Link href="/matrix?status=REVIEW" className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm relative overflow-hidden group bg-gradient-to-b from-amber-50/50 to-white hover:border-amber-400 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-status-reviewBg text-status-review flex items-center justify-center border border-amber-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Under Review</h3>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{reviewCount}</span>
              </div>
              <div className="mt-3 text-xs text-status-review font-bold">
                {reviewRate}% requires officer action
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-status-review h-full rounded-full" style={{ width: `${reviewRate}%` }}></div>
              </div>
            </Link>

            <Link href="/matrix?status=FAIL" className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm relative overflow-hidden group bg-gradient-to-b from-rose-50/50 to-white hover:border-rose-400 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-status-failBg text-status-fail flex items-center justify-center border border-rose-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider">Flagged</h3>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-800 tracking-tight">{nonCompliantCount}</span>
              </div>
              <div className="mt-3 text-xs text-status-fail font-bold">
                {failRate}% non-compliant
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-status-fail h-full rounded-full" style={{ width: `${failRate}%` }}></div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COMPLIANCE STATUS DONUT */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div className="flex flex-col items-center">
                <h2 className="text-base font-bold text-slate-900 self-start w-full">Compliance Status</h2>
                <div className="relative flex items-center justify-center my-8">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background */}
                    <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    {/* PASS (Green) */}
                    <path className="text-status-pass" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${passRate}, 100`} strokeLinecap="round" strokeWidth="3" />
                    {/* REVIEW (Amber) - Offset by Pass */}
                    <path className="text-status-review" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${reviewRate}, 100`} strokeDashoffset={`-${passRate}`} strokeWidth="3" />
                    {/* FAIL (Red) - Offset by Pass+Review */}
                    <path className="text-status-fail" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${failRate}, 100`} strokeDashoffset={`-${parseFloat(passRate) + parseFloat(reviewRate)}`} strokeWidth="3" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900">{totalBids}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Total Bids</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm font-medium">
                <Link href="/matrix?status=PASS" className="flex justify-between items-center bg-status-passBg p-2 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition cursor-pointer">
                  <span className="flex items-center gap-2 text-emerald-800"><svg className="w-4 h-4 text-status-pass" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Compliant</span>
                  <span className="font-bold text-emerald-700">{compliantCount} <span className="text-emerald-500/80 ml-1 font-normal">({passRate}%)</span></span>
                </Link>
                <Link href="/matrix?status=REVIEW" className="flex justify-between items-center bg-status-reviewBg p-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition cursor-pointer">
                  <span className="flex items-center gap-2 text-amber-900">
                    <svg className="w-4 h-4 text-status-review" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/>
                    </svg> 
                    Under Review
                  </span>
                  <span className="font-bold text-amber-800">{reviewCount} <span className="text-amber-600/80 ml-1 font-normal">({reviewRate}%)</span></span>
                </Link>
                <Link href="/matrix?status=FAIL" className="flex justify-between items-center bg-status-failBg p-2 rounded-lg border border-rose-200 hover:bg-rose-100 transition cursor-pointer">
                  <span className="flex items-center gap-2 text-rose-900"><svg className="w-4 h-4 text-status-fail" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Flagged</span>
                  <span className="font-bold text-rose-800">{nonCompliantCount} <span className="text-rose-600/80 ml-1 font-normal">({failRate}%)</span></span>
                </Link>
              </div>
            </div>

            {/* GOVERNMENT CONNECTORS STATUS (replaces static text) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Government Connectors Status</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time health of external registries</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  All Systems Operational
                </div>
              </div>
              <div className="flex-1 p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <th className="p-4 whitespace-nowrap">Registry</th>
                      <th className="p-4 whitespace-nowrap">Status</th>
                      <th className="p-4 whitespace-nowrap hidden sm:table-cell">Last Sync</th>
                      <th className="p-4 whitespace-nowrap text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {[
                      { name: "Udyam (MSME)", code: "UDYAM", status: "Operational", color: "text-status-pass", bg: "bg-status-passBg", border: "border-emerald-200", sync: "2 mins ago" },
                      { name: "GSTN", code: "GST", status: "Operational", color: "text-status-pass", bg: "bg-status-passBg", border: "border-emerald-200", sync: "5 mins ago" },
                      { name: "Income Tax (PAN)", code: "PAN", status: "Operational", color: "text-status-pass", bg: "bg-status-passBg", border: "border-emerald-200", sync: "10 mins ago" },
                      { name: "CPPP API", code: "CPPP", status: "Degraded", color: "text-status-review", bg: "bg-status-reviewBg", border: "border-amber-200", sync: "1 hour ago" },
                    ].map((conn) => (
                      <tr key={conn.code} className="hover:bg-slate-50 transition group">
                        <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center font-mono text-[10px] font-bold border ${conn.bg} ${conn.color} ${conn.border}`}>
                            {conn.code}
                          </div>
                          {conn.name}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${conn.bg} ${conn.color} ${conn.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${conn.color === 'text-status-pass' ? 'bg-status-pass' : 'bg-status-review'}`}></span>
                            {conn.status}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-500 font-medium hidden sm:table-cell">{conn.sync}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => router.push('/government-connectors')} className="text-xs font-semibold text-gem-600 hover:text-gem-800 hover:underline">View Log</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
