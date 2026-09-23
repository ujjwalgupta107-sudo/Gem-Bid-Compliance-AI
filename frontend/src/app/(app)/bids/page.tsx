"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Bid } from "@/lib/types";
import { formatPct, formatDate } from "@/lib/format";
import { StatusBadge, RiskBadge } from "@/components/StatusBadge";

export default function BidsDirectoryPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    api.get<Bid[]>("/bids")
      .then(setBids)
      .catch(() => setBids([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredBids = useMemo(() => {
    return bids.filter((b) => {
      const bidderName = b.bidder?.company_name || "";
      const matchesQuery =
        !query ||
        bidderName.toLowerCase().includes(query.toLowerCase()) ||
        b.id.toLowerCase().includes(query.toLowerCase()) ||
        (b.tender?.title || "").toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        b.status === statusFilter ||
        (statusFilter === "HIGH_RISK" && b.risk_level === "HIGH");

      return matchesQuery && matchesStatus;
    });
  }, [bids, query, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6 text-[#00F5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Bid Compliance Repository
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and inspect all bidder submissions, verified compliance scores, and final procurement decisions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tenders/new"
            className="btn btn-primary text-sm px-4 py-2 bg-[#00F5FF] text-slate-950 font-bold hover:bg-[#00F5FF]/90 transition shadow-[0_0_15px_rgba(0,245,255,0.3)]"
          >
            + New Verification
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by bidder name, tender, or bid ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input w-full bg-slate-900/60 border-slate-700 text-white pl-9 text-sm"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "QUALIFIED", "UNDER_REVIEW", "DISQUALIFIED", "HIGH_RISK"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? "bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/40"
                  : "bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="panel bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading bids repository...</div>
        ) : filteredBids.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-base font-semibold text-slate-300">No bids found matching criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4 pl-6">Bidder & Entity</th>
                  <th className="p-4">Tender Reference</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Compliance Score</th>
                  <th className="p-4">Risk Profile</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBids.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-white">{b.bidder?.company_name || "Unknown Bidder"}</div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        {b.id} {b.bidder?.gstin ? `• GST: ${b.bidder.gstin}` : ""}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium text-slate-300 max-w-xs truncate">
                        {b.tender?.title || "Tender " + b.tender_id}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {b.tender?.tender_number || b.tender_id}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(b.submitted_at)}
                    </td>
                    <td className="p-4">
                      {b.compliance_score !== null && b.compliance_score !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                b.compliance_score >= 80 ? "bg-emerald-400" : b.compliance_score >= 60 ? "bg-amber-400" : "bg-rose-400"
                              }`}
                              style={{ width: `${b.compliance_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono font-bold text-white">
                            {formatPct(b.compliance_score)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      <RiskBadge level={b.risk_level} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <Link
                        href={`/bids/${b.id}`}
                        className="text-xs font-bold text-[#00F5FF] hover:underline inline-flex items-center gap-1"
                      >
                        Inspect Bid →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
