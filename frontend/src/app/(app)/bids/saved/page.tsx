"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Bid } from "@/lib/types";
import { formatPct, formatDate } from "@/lib/format";
import { StatusBadge, RiskBadge } from "@/components/StatusBadge";

export default function SavedBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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
      return (
        !query ||
        bidderName.toLowerCase().includes(query.toLowerCase()) ||
        b.id.toLowerCase().includes(query.toLowerCase()) ||
        (b.tender?.title || "").toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [bids, query]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/bids" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← All Bids
            </Link>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Saved & Priority Bids
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Bookmarked bids flagged for priority evaluation, officer review, or compliance clarification.
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter saved bids..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input w-full bg-slate-900/60 border-slate-700 text-white pl-9 text-sm"
        />
        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400">Loading saved bids...</div>
        ) : filteredBids.length === 0 ? (
          <div className="col-span-full panel p-12 text-center bg-slate-900/40 border border-white/10 rounded-2xl">
            <p className="text-base font-semibold text-slate-300">No saved bids currently flagged</p>
            <p className="text-xs text-slate-500 mt-1">Bids marked during verification sessions will appear here.</p>
            <Link href="/bids" className="btn btn-secondary text-xs mt-4 inline-block">
              Browse All Bids
            </Link>
          </div>
        ) : (
          filteredBids.map((b) => (
            <div
              key={b.id}
              className="panel p-5 bg-slate-900/60 border border-white/10 rounded-2xl space-y-4 hover:border-[#00F5FF]/40 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs text-[#00F5FF] font-semibold">{b.id}</span>
                  <h3 className="font-bold text-white text-base leading-snug mt-1 group-hover:text-[#00F5FF] transition-colors">
                    {b.bidder?.company_name || "Unknown Bidder"}
                  </h3>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div className="truncate">
                  <span className="text-slate-500">Tender:</span> {b.tender?.title || b.tender_id}
                </div>
                <div>
                  <span className="text-slate-500">Submitted:</span> {formatDate(b.submitted_at)}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Risk Rating</span>
                  <RiskBadge level={b.risk_level} />
                </div>
                {b.compliance_score !== null && b.compliance_score !== undefined && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Score</span>
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      {formatPct(b.compliance_score)}
                    </span>
                  </div>
                )}
              </div>

              <Link
                href={`/bids/${b.id}`}
                className="w-full btn btn-secondary text-xs text-center py-2 block border-slate-700 hover:border-[#00F5FF]/50"
              >
                Inspect Compliance Details →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
