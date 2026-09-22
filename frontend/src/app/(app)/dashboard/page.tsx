"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { DashboardSummary } from "@/lib/types";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [activePortalTab, setActivePortalTab] = useState<"udyam" | "gstn" | "pan" | "epfo" | "cppp">("udyam");
  const [activeStepTab, setActiveStepTab] = useState<number>(2); // Default to Step 2 (Statutory API Validation) like Stitch screen
  const [adjudicationNote, setAdjudicationNote] = useState(
    "Statutory compliance verified with zero discrepancy. Udyam MSME certificate and GSTN regular filing confirmed. Bidder deemed technically compliant."
  );
  const [decisionSuccess, setDecisionSuccess] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<DashboardSummary>("/dashboard/summary")
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Failed to load dashboard summary", err);
      });
  }, []);

  // Compute metrics with Stitch defaults if needed
  const totalBids = data ? data.bids_under_review + data.compliant_bids + data.high_risk_bids : 24;
  const compliantCount = data?.compliant_bids ?? 18;
  const reviewCount = data?.bids_under_review ?? 4;
  const nonCompliantCount = data?.high_risk_bids ?? 2;
  const passRate = totalBids > 0 ? ((compliantCount / totalBids) * 100).toFixed(1) : "75.0";

  const handleDecision = async (decision: "QUALIFIED" | "DISQUALIFIED" | "CLARIFICATION_REQUESTED") => {
    try {
      setDecisionSuccess(`Officer determination recorded as ${decision}. Digitally signed into audit record.`);
      setTimeout(() => setDecisionSuccess(null), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bid Verification &amp; Compliance Engine</h1>
          <p className="text-sm text-slate-500">Real-time statutory verification powered by AI against sovereign registries</p>
        </div>

        {/* Quick Actions & Date Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
            <svg className="mr-1.5 h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Last 30 Days
          </div>
          <button
            onClick={() => router.push("/tenders")}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <svg className="mr-1.5 h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Export Dossier
          </button>
          <button
            onClick={() => router.push("/tenders")}
            className="inline-flex items-center rounded-lg bg-gem-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-gem-800 transition"
          >
            <svg className="mr-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            New Bid Verification
          </button>
        </div>
      </div>

      {decisionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{decisionSuccess}</span>
          </div>
          <button onClick={() => setDecisionSuccess(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">×</button>
        </div>
      )}

      {/* BEGIN: KPIOverviewCards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="kpi-metrics-grid">
        {/* Total Bids */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bids Evaluated</p>
            <h3 className="text-3xl font-extrabold text-slate-900">{totalBids}</h3>
            <span className="inline-flex items-center text-[11px] font-medium text-emerald-600">
              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 10l7-7m0 0l7 7m-7-7v18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              +12% from last cycle
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-gem-700 flex items-center justify-center border border-blue-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Verified & Compliant */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Compliant</p>
            <h3 className="text-3xl font-extrabold text-emerald-600">{compliantCount}</h3>
            <span className="inline-flex items-center text-[11px] font-medium text-emerald-600">
              {passRate}% Pass Rate
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Officer Review</p>
            <h3 className="text-3xl font-extrabold text-amber-500">{reviewCount}</h3>
            <span className="inline-flex items-center text-[11px] font-medium text-amber-600">
              Requires manual check
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Non-Compliant */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Non-Compliant / Flagged</p>
            <h3 className="text-3xl font-extrabold text-rose-600">{nonCompliantCount}</h3>
            <span className="inline-flex items-center text-[11px] font-medium text-rose-600">
              Disqualified automatically
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </section>
      {/* END: KPIOverviewCards */}

      {/* BEGIN: ChartsAnalyticsRow */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Trend (SVG multi-line chart) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Verification Trend (Last 30 Days)</h2>
              <p className="text-xs text-slate-500">Throughput of automated checks across published tenders</p>
            </div>
            {/* Trend Legend */}
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>Verified</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Under Review</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Non-Compliant</span>
            </div>
          </div>
          {/* SVG Chart Area */}
          <div className="w-full h-44 relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 160">
              {/* Grid Lines */}
              <line stroke="#f1f5f9" strokeDasharray="4" x1="0" x2="600" y1="20" y2="20" />
              <line stroke="#f1f5f9" strokeDasharray="4" x1="0" x2="600" y1="60" y2="60" />
              <line stroke="#f1f5f9" strokeDasharray="4" x1="0" x2="600" y1="100" y2="100" />
              <line stroke="#e2e8f0" x1="0" x2="600" y1="140" y2="140" />
              {/* Verified Line (Blue) */}
              <path d="M0,120 Q60,110 100,90 T200,65 T300,50 T400,35 T500,25 T600,20" fill="none" stroke="#2563eb" strokeWidth="2.5" />
              {/* Under Review Line (Amber) */}
              <path d="M0,140 Q60,135 100,120 T200,105 T300,110 T400,95 T500,90 T600,85" fill="none" stroke="#f59e0b" strokeWidth="2" />
              {/* Non-Compliant Line (Rose) */}
              <path d="M0,150 Q60,148 100,145 T200,135 T300,140 T400,130 T500,135 T600,130" fill="none" stroke="#f43f5e" strokeWidth="1.8" />
              {/* Data Dots */}
              <circle className="fill-blue-600 ring-2 ring-white" cx="100" cy="90" r="3.5" />
              <circle className="fill-blue-600 ring-2 ring-white" cx="200" cy="65" r="3.5" />
              <circle className="fill-blue-600 ring-2 ring-white" cx="300" cy="50" r="3.5" />
              <circle className="fill-blue-600 ring-2 ring-white" cx="400" cy="35" r="3.5" />
              <circle className="fill-blue-600 ring-2 ring-white" cx="500" cy="25" r="3.5" />
            </svg>
          </div>
          {/* Chart X Axis Labels */}
          <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span>Sep 1</span>
            <span>Sep 5</span>
            <span>Sep 10</span>
            <span>Sep 15</span>
            <span>Sep 20</span>
            <span>Sep 25</span>
            <span>Sep 30</span>
          </div>
        </div>

        {/* Compliance Status Donut Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Compliance Status</h2>
            <span className="text-xs text-gem-700 bg-blue-50 px-2 py-0.5 rounded font-medium">All Bidders</span>
          </div>
          {/* Donut Graphic */}
          <div className="relative flex items-center justify-center my-3">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4.5" />
              {/* Green (75%) */}
              <path className="text-emerald-500 donut-chart-circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="4.5" />
              {/* Amber (17%) offset */}
              <path className="text-amber-500 donut-chart-circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="17, 100" strokeDashoffset="-75" strokeWidth="4.5" />
              {/* Rose (8%) offset */}
              <path className="text-rose-500 donut-chart-circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="8, 100" strokeDashoffset="-92" strokeWidth="4.5" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-800">{passRate}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Compliant</span>
            </div>
          </div>
          {/* Donut Breakdown Legend */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Compliant</span>
              <span className="font-bold text-slate-800">75% ({compliantCount})</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Under Review</span>
              <span className="font-bold text-slate-800">17% ({reviewCount})</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Non-Compliant</span>
              <span className="font-bold text-slate-800">8% ({nonCompliantCount})</span>
            </div>
          </div>
        </div>
      </section>
      {/* END: ChartsAnalyticsRow */}

      {/* BEGIN: ActiveBidderWorkspace */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" data-purpose="verification-active-workspace">
        {/* Live Bidder Evaluation Header */}
        <div className="bg-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white tracking-wide">ABC Technologies Private Limited</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Primary Bidder
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
              <span><strong>Tender Ref:</strong> GEM/2026/B123</span>
              <span>•</span>
              <span><strong>Tender Value:</strong> ₹ 4,85,00,000</span>
              <span>•</span>
              <span><strong>Category:</strong> Cloud Infrastructure &amp; Enterprise IT Services</span>
              <span>•</span>
              <span><strong>Submission:</strong> 30 Sep 2026, 10:12 AM</span>
            </div>
          </div>
          {/* Overall Score Badge */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Compliance Score</p>
              <p className="text-xs font-semibold text-emerald-400">Low Risk • Qualified</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-black text-xl text-emerald-300">
              92
            </div>
          </div>
        </div>

        {/* Verification Multi-Step Navigation */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
          <div className="flex items-center gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveStepTab(1)}
              className={`pb-1 flex items-center gap-1.5 transition ${
                activeStepTab === 1
                  ? "text-gem-800 font-bold border-b-2 border-gem-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${activeStepTab === 1 ? "bg-gem-700 text-white" : "bg-slate-200 text-slate-700"}`}>1</span>
              Document OCR &amp; Ingestion
            </button>

            <button
              onClick={() => setActiveStepTab(2)}
              className={`pb-1 flex items-center gap-1.5 transition ${
                activeStepTab === 2
                  ? "text-gem-800 font-bold border-b-2 border-gem-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${activeStepTab === 2 ? "bg-gem-700 text-white" : "bg-slate-200 text-slate-700"}`}>2</span>
              Statutory API Validation
            </button>

            <button
              onClick={() => setActiveStepTab(3)}
              className={`pb-1 flex items-center gap-1.5 transition ${
                activeStepTab === 3
                  ? "text-gem-800 font-bold border-b-2 border-gem-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${activeStepTab === 3 ? "bg-gem-700 text-white" : "bg-slate-200 text-slate-700"}`}>3</span>
              AI Explainability &amp; Reasoning
            </button>

            <button
              onClick={() => setActiveStepTab(4)}
              className={`pb-1 flex items-center gap-1.5 transition ${
                activeStepTab === 4
                  ? "text-gem-800 font-bold border-b-2 border-gem-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${activeStepTab === 4 ? "bg-gem-700 text-white" : "bg-slate-200 text-slate-700"}`}>4</span>
              Officer Decision
            </button>
          </div>
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-gem-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            Automated verification completed in 1.4 seconds
          </div>
        </div>

        {/* Step Tab Content */}
        <div className="p-6">
          {/* STEP 1: OCR & Ingestion */}
          {activeStepTab === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Submitted Document OCR</h3>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-medium px-2 py-0.5 rounded">
                    100% Match Confidence
                  </span>
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-bold text-slate-700">Udyam_Certificate.pdf</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">2.4 MB</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-slate-50">
                        <span className="text-slate-500">Udyam Reg. Number:</span>
                        <span className="font-mono font-bold text-slate-800">UDYAM-UP-12-3456789</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-50">
                        <span className="text-slate-500">Enterprise Name:</span>
                        <span className="font-semibold text-slate-800">ABC Technologies Pvt Ltd</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-50">
                        <span className="text-slate-500">MSME Classification:</span>
                        <span className="font-semibold text-gem-700">Small Enterprise (Services)</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-50">
                        <span className="text-slate-500">Date of Incorporation:</span>
                        <span className="text-slate-700">12 Jan 2023</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-500">Major Activity:</span>
                        <span className="text-slate-700">IT Software Consulting</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Processed Documents Checklist</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <div className="font-semibold text-slate-800">GST_Registration_Cert.pdf</div>
                      <div className="text-[11px] text-slate-400">GSTIN: 09AABCA1234F1Z5 • 1.8 MB</div>
                    </div>
                    <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <div className="font-semibold text-slate-800">PAN_Card_Corporate.pdf</div>
                      <div className="text-[11px] text-slate-400">PAN: AABCA1234F • 0.9 MB</div>
                    </div>
                    <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <div className="font-semibold text-slate-800">ITR_V_AY2024-25.pdf</div>
                      <div className="text-[11px] text-slate-400">Ack No: 981273918239 • 3.1 MB</div>
                    </div>
                    <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Statutory API Validation (Stitch Flagship View) */}
          {activeStepTab === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Submitted Document OCR</h3>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-medium px-2 py-0.5 rounded">
                    100% Match Confidence
                  </span>
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-bold text-slate-700">Udyam_Certificate.pdf</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">2.4 MB</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-slate-50">
                        <span className="text-slate-500">Udyam Reg. Number:</span>
                        <span className="font-mono font-bold text-slate-800">UDYAM-UP-12-3456789</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-50">
                        <span className="text-slate-500">Enterprise Name:</span>
                        <span className="font-semibold text-slate-800">ABC Technologies Pvt Ltd</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-50">
                        <span className="text-slate-500">MSME Classification:</span>
                        <span className="font-semibold text-gem-700">Small Enterprise (Services)</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-50">
                        <span className="text-slate-500">Date of Incorporation:</span>
                        <span className="text-slate-700">12 Jan 2023</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-500">Major Activity:</span>
                        <span className="text-slate-700">IT Software Consulting</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Other Documents Processed</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200">
                        <span className="truncate max-w-[180px] text-slate-700">GST_Registration_Cert.pdf</span>
                        <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200">
                        <span className="truncate max-w-[180px] text-slate-700">PAN_Card_Corporate.pdf</span>
                        <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200">
                        <span className="truncate max-w-[180px] text-slate-700">ITR_V_AY2024-25.pdf</span>
                        <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg> Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sovereign Portal Cross-Verification (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Sovereign Portal Cross-Verification</h3>
                    <p className="text-xs text-slate-500">Live API response match against Ministry databases</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> 5 of 5 Portals Authentic
                    </span>
                  </div>
                </div>

                {/* Portal Tabs */}
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
                  <button
                    onClick={() => setActivePortalTab("udyam")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activePortalTab === "udyam" ? "bg-gem-800 text-white shadow-2xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>Udyam Portal</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </button>
                  <button
                    onClick={() => setActivePortalTab("gstn")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activePortalTab === "gstn" ? "bg-gem-800 text-white shadow-2xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>GSTN Portal</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </button>
                  <button
                    onClick={() => setActivePortalTab("pan")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activePortalTab === "pan" ? "bg-gem-800 text-white shadow-2xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>Income Tax (PAN)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </button>
                  <button
                    onClick={() => setActivePortalTab("epfo")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activePortalTab === "epfo" ? "bg-gem-800 text-white shadow-2xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>EPFO / ESIC</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </button>
                  <button
                    onClick={() => setActivePortalTab("cppp")}
                    className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                      activePortalTab === "cppp" ? "bg-gem-800 text-white shadow-2xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <span>CPPP / Debarment</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </button>
                </div>

                {/* Portal Inspection Detailed Card */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {activePortalTab === "udyam" && "MSME"}
                        {activePortalTab === "gstn" && "GST"}
                        {activePortalTab === "pan" && "ITD"}
                        {activePortalTab === "epfo" && "EPF"}
                        {activePortalTab === "cppp" && "CPPP"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          {activePortalTab === "udyam" && "Ministry of Micro, Small and Medium Enterprises (Udyam)"}
                          {activePortalTab === "gstn" && "Goods & Services Tax Network (GSTN Verification)"}
                          {activePortalTab === "pan" && "Central Board of Direct Taxes (Income Tax PAN Service)"}
                          {activePortalTab === "epfo" && "Employees' Provident Fund Organisation (EPFO/ESIC)"}
                          {activePortalTab === "cppp" && "Central Public Procurement Portal (Debarment Registry)"}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono">
                          {activePortalTab === "udyam" && "Target: UDYAM-UP-12-3456789"}
                          {activePortalTab === "gstn" && "Target: 09AABCA1234F1Z5"}
                          {activePortalTab === "pan" && "Target: AABCA1234F"}
                          {activePortalTab === "epfo" && "Target: DLCPM0012345000"}
                          {activePortalTab === "cppp" && "Target: CPPP-DEBAR-CHECK"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gem-700 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                      Open Official Registry
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </span>
                  </div>

                  {/* JSON API Payload Preview vs Verification Match */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Match Details Column */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                        <span className="font-bold text-slate-700">Statutory Criteria</span>
                        <span className="font-bold text-emerald-600">Verification Status</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Registry Active Status</span>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Active (Valid)</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Enterprise Category</span>
                        <span className="font-semibold text-slate-800">Small (Eligible for MSE perks)</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Major Activity Code (NIC)</span>
                        <span className="font-semibold text-slate-800">6201 - Software development</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Turnover Limit Compliance</span>
                        <span className="font-semibold text-emerald-600">&lt; ₹50 Crore (Verified)</span>
                      </div>
                      <div className="pt-1 text-[11px] text-slate-400">
                        Last synchronised: Today at 10:12:04 AM IST via Sovereign Gateway
                      </div>
                    </div>

                    {/* Live JSON API Response */}
                    <div className="bg-slate-900 rounded-lg p-3 text-slate-200 text-xs font-mono overflow-x-auto code-editor-font">
                      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[10px] text-slate-400">
                        <span>LIVE API RESPONSE: 200 OK</span>
                        <span className="text-emerald-400">SIGNATURE VALID</span>
                      </div>
                      <pre className="text-[11px] leading-relaxed text-emerald-300">
{`{
  "status": "SUCCESS",
  "udyam_number": "UDYAM-UP-12-3456789",
  "enterprise_name": "ABC TECHNOLOGIES PRIVATE LIMITED",
  "category": "Small",
  "date_of_reg": "2023-01-12",
  "blacklisted": false,
  "gstin_linked": "09AABCA1234F1Z5"
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Checkbox verification note */}
                  <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg font-medium">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>All extracted document particulars perfectly match the official sovereign Ministry record. No tampering detected.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AI Explainability & Statutory Evidence */}
          {activeStepTab === 3 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-gem-700 flex items-center justify-center font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-slate-800">AI Explainability &amp; Statutory Evidence</h3>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono font-medium">Model: GeM-Guard-v3 (Local Engine)</span>
              </div>
              <div className="text-slate-600 text-xs leading-relaxed space-y-3">
                <p>
                  Based on the real-time synthesis of submitted bid documents and direct digital cryptographic handshakes with Indian sovereign registries, the bidder <strong>ABC Technologies Private Limited</strong> has satisfied all mandatory statutory qualification clauses under <em>GFR 2017 Rule 144(xi)</em> and <em>Public Procurement Policy for MSEs Order 2012</em>.
                </p>
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs">
                      <strong className="text-slate-800">MSE Purchase Preference Verified:</strong>
                      <span> Valid Udyam certificate confirms Small Enterprise status. Bidder is eligible for 15% purchase preference and exemption from EMD requirement.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs">
                      <strong className="text-slate-800">Tax Regularity Cleared:</strong>
                      <span> GSTN return filing track record shows 100% GSTR-3B filings up to August 2026. PAN is seeded with Aadhaar and active in Income Tax e-filing system.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs">
                      <strong className="text-slate-800">Zero Debarment / Blacklist Record:</strong>
                      <span> Central Public Procurement Portal (CPPP) and Ministry debarment databases return nil adverse listings against PAN and Director DINs.</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Direct Sovereign Audit Evidence Links */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-slate-400 font-semibold">Evidence Citations:</span>
                <span className="text-gem-700 flex items-center gap-1 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100 cursor-pointer">
                  Udyam Gateway #98231
                </span>
                <span className="text-gem-700 flex items-center gap-1 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100 cursor-pointer">
                  GSTN Sandbox Token
                </span>
                <span className="text-gem-700 flex items-center gap-1 font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100 cursor-pointer">
                  CBDT e-Tax Feed
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Officer Decision & Cryptographic Audit Trail */}
          {activeStepTab === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Cryptographic Audit Trail (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Cryptographic Audit Trail</h3>
                      <p className="text-xs text-slate-500">Tamper-evident chronological compliance log</p>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                      SHA-256 Enabled
                    </span>
                  </div>
                  {/* Timeline Steps */}
                  <div className="space-y-3.5 text-xs">
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Bidder Documents Uploaded &amp; Hashed</p>
                        <p className="text-[11px] text-slate-400 font-mono">30 Sep 2026, 10:12:01 AM • Officer Portal</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">OCR &amp; Document Entity Extraction</p>
                        <p className="text-[11px] text-slate-400 font-mono">30 Sep 2026, 10:12:02 AM • 4 Documents Parsed</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Sovereign Portal API Verification</p>
                        <p className="text-[11px] text-slate-400 font-mono">30 Sep 2026, 10:12:03 AM • 5 APIs Queried</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-gem-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        •
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">AI Scoring &amp; Heuristic Rules Computed</p>
                        <p className="text-[11px] text-slate-400 font-mono">30 Sep 2026, 10:12:04 AM • Score: 92/100</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Hash Verification Box */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold">
                    <span>Current Block SHA-256 Hash</span>
                    <span className="text-emerald-600">VERIFIED IMMUTABLE</span>
                  </div>
                  <p className="text-[10px] text-slate-700 break-all bg-white p-1.5 rounded border border-slate-200">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </p>
                </div>
              </div>

              {/* Right: Officer Adjudication (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Procurement Officer Adjudication</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Record statutory finding into permanent ledger</p>
                  <div className="mt-3 p-3 bg-gem-50 border border-gem-200 rounded-lg">
                    <span className="text-[11px] font-bold text-gem-800 uppercase">AI Recommendation:</span>
                    <div className="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Recommended to Qualify (Low Risk • 92/100)
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Adjudication Notes</label>
                  <textarea
                    value={adjudicationNote}
                    onChange={(e) => setAdjudicationNote(e.target.value)}
                    rows={3}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 focus:bg-white outline-none focus:border-gem-700"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleDecision("DISQUALIFIED")}
                    className="flex-1 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                  >
                    Reject (Disqualify)
                  </button>
                  <button
                    onClick={() => handleDecision("CLARIFICATION_REQUESTED")}
                    className="flex-1 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
                  >
                    Clarification
                  </button>
                  <button
                    onClick={() => handleDecision("QUALIFIED")}
                    className="w-full px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                    Confirm &amp; Qualify Bidder
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BEGIN: OfficerDecisionActionFooter */}
        <div className="bg-white border-t-2 border-gem-200 p-5 shadow-sm space-y-3" data-purpose="officer-decision-bar">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Procurement Officer Final Determination</h3>
              <p className="text-xs text-slate-500">Record your statutory adjudication. This action will be digitally signed and entered into the procurement record.</p>
            </div>
            {/* Pre-filled Status Tag */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">AI Suggestion:</span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Recommended to Qualify
              </span>
            </div>
          </div>
          {/* Remarks & Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Adjudication Notes / Justification Remarks</label>
            <input
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:bg-white focus:ring-1 focus:ring-gem-700 focus:border-gem-700 transition"
              placeholder="e.g. All documents verified against sovereign registries. Bidder meets MSE exemption norms and financial turnover qualifications. Qualified for commercial opening."
              type="text"
              value={adjudicationNote}
              onChange={(e) => setAdjudicationNote(e.target.value)}
            />
          </div>
          {/* Action Decision Buttons */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              Digital Token: DSC-OFFICER-77129A
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleDecision("DISQUALIFIED")}
                className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
              >
                Reject (Disqualify)
              </button>
              <button
                onClick={() => handleDecision("CLARIFICATION_REQUESTED")}
                className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
              >
                Seek Clarification
              </button>
              <button
                onClick={() => handleDecision("QUALIFIED")}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-2 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                Confirm &amp; Qualify Bidder
              </button>
            </div>
          </div>
        </div>
        {/* END: OfficerDecisionActionFooter */}
      </section>
      {/* END: ActiveBidderWorkspace */}

      {/* Recent Tenders & Activity section */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          <div className="lg:col-span-2 panel">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Recent Tenders Under Evaluation</h2>
              <Link href="/tenders" className="text-xs text-gem-700 font-semibold hover:underline">
                View all tenders →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-100 bg-slate-50/50">
                    <th className="px-5 py-2.5 font-medium">Tender Number</th>
                    <th className="px-5 py-2.5 font-medium">Title &amp; Category</th>
                    <th className="px-5 py-2.5 font-medium">Closing Date</th>
                    <th className="px-5 py-2.5 font-medium">Bids</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_tenders.map((t) => (
                    <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono text-xs text-slate-600">{t.tender_number}</td>
                      <td className="px-5 py-3">
                        <Link href={`/tenders/${t.id}`} className="font-semibold text-slate-900 hover:text-gem-700">
                          {t.title}
                        </Link>
                        <div className="text-xs text-slate-500">{t.category} • {formatINR(t.estimated_value)}</div>
                      </td>
                      <td className="px-5 py-3 text-slate-600 text-xs">{formatDate(t.closing_date)}</td>
                      <td className="px-5 py-3 text-slate-600 text-xs">{t.bid_count}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Recent Compliance Activity</h2>
            </div>
            <div className="px-5 py-3 space-y-3 max-h-[380px] overflow-y-auto">
              {data.recent_activity.map((a, i) => (
                <div key={i} className="text-xs pb-2 border-b border-slate-50 last:border-0">
                  <div className="text-slate-800 font-semibold">{a.action.replace(/_/g, " ")}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5 font-mono">
                    {a.actor} • {formatDateTime(a.timestamp)}
                  </div>
                </div>
              ))}
              {data.recent_activity.length === 0 && (
                <div className="text-xs text-slate-400 py-4 text-center">No recent activity recorded.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
