"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Tender } from "@/lib/types";

export default function NewTenderPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    tender_number: `GEM/${new Date().getFullYear()}/B/${Math.floor(100000 + Math.random() * 900000)}`,
    title: "",
    organization: "Chennai Petroleum Corporation Limited (CPCL)",
    category: "Goods",
    estimated_value: "45000000",
    min_turnover: "15000000",
    min_years_operation: "3",
    min_local_content_pct: "50",
    requires_oem_authorization: true,
    description: "",
    closing_days: "21",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please provide a tender title.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const closingDate = new Date();
      closingDate.setDate(closingDate.getDate() + parseInt(form.closing_days || "21", 10));

      const created = await api.post<Tender>("/tenders", {
        tender_number: form.tender_number,
        title: form.title,
        organization: form.organization,
        category: form.category,
        estimated_value: parseFloat(form.estimated_value) || 0,
        min_turnover: parseFloat(form.min_turnover) || 0,
        min_years_operation: parseInt(form.min_years_operation, 10) || 0,
        min_local_content_pct: parseFloat(form.min_local_content_pct) || 0,
        requires_oem_authorization: form.requires_oem_authorization,
        description: form.description,
        closing_date: closingDate.toISOString(),
      });
      router.push(`/tenders/${created.id}`);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create tender. Please verify the backend connection.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/tenders" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Back to Tenders
            </Link>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#00F5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Bid Verification & Tender Setup
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure compliance parameters and deploy deterministic rules catalog for automated verification.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="panel p-6 space-y-6 bg-slate-900/60 border border-white/10 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              GeM Tender Number
            </label>
            <input
              type="text"
              required
              value={form.tender_number}
              onChange={(e) => setForm({ ...form, tender_number: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Procuring Organization
            </label>
            <input
              type="text"
              required
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Tender Title / Scope of Work
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Supply and Installation of Centrifugal Multistage Crude Pumps"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Procurement Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white text-sm"
            >
              <option value="Goods">Goods</option>
              <option value="Services">Services</option>
              <option value="Works">Works</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Estimated Value (INR ₹)
            </label>
            <input
              type="number"
              min="0"
              required
              value={form.estimated_value}
              onChange={(e) => setForm({ ...form, estimated_value: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Min Annual Turnover Requirement (INR ₹)
            </label>
            <input
              type="number"
              min="0"
              required
              value={form.min_turnover}
              onChange={(e) => setForm({ ...form, min_turnover: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Min Make-in-India Local Content (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={form.min_local_content_pct}
              onChange={(e) => setForm({ ...form, min_local_content_pct: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Min Years in Operation
            </label>
            <input
              type="number"
              min="0"
              required
              value={form.min_years_operation}
              onChange={(e) => setForm({ ...form, min_years_operation: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Bidding Period (Days)
            </label>
            <input
              type="number"
              min="1"
              max="180"
              required
              value={form.closing_days}
              onChange={(e) => setForm({ ...form, closing_days: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white font-mono text-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <input
              type="checkbox"
              id="requires_oem"
              checked={form.requires_oem_authorization}
              onChange={(e) => setForm({ ...form, requires_oem_authorization: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 text-gem-500 focus:ring-gem-500 bg-slate-900"
            />
            <label htmlFor="requires_oem" className="text-sm text-slate-300 cursor-pointer">
              <span className="font-semibold text-white">Mandate OEM Authorization:</span> Non-OEM bidders must upload verified manufacturer certificate.
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Additional Requirements & Scope
            </label>
            <textarea
              rows={3}
              placeholder="Specify technical evaluation criteria, certifications (ISO, ASME), delivery timelines..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input w-full bg-slate-800/80 border-slate-700 text-white text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <Link href="/tenders" className="btn btn-secondary text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={busy}
            className="btn btn-primary text-sm px-6 flex items-center gap-2 bg-[#00F5FF] text-slate-950 font-bold hover:bg-[#00F5FF]/90 transition shadow-[0_0_15px_rgba(0,245,255,0.3)]"
          >
            {busy ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Creating & Seeding Rules...
              </>
            ) : (
              <>Create Tender & Requirements</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
