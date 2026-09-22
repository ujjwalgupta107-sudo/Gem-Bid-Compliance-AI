"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { Tender } from "@/lib/types";
import { formatDate, formatINR, formatPct, daysUntil, docTypeLabel } from "@/lib/format";
import { StatusBadge, RiskBadge } from "@/components/StatusBadge";

const TABS = ["Overview", "Requirements", "Bidders", "Compliance Summary"] as const;
type Tab = (typeof TABS)[number];

export default function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tender, setTender] = useState<Tender | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");
  const [showAddBidder, setShowAddBidder] = useState(false);

  function refresh() {
    api.get<Tender>(`/tenders/${id}`).then(setTender);
  }
  useEffect(refresh, [id]);

  if (!tender) return <div className="p-8 text-sm text-slate-500">Loading tender…</div>;

  const days = daysUntil(tender.closing_date);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-mono text-slate-500">{tender.tender_number}</div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{tender.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{tender.organization}</span>
            <span>·</span>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{tender.category}</span>
            <span>·</span>
            <span>Closing {formatDate(tender.closing_date)}</span>
            {days !== null && days >= 0 && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${days <= 7 ? "bg-rose-50 text-rose-700" : days <= 15 ? "bg-amber-50 text-amber-700" : "text-slate-500"}`}>
                {days === 0 ? "Closes today" : `${days}d left`}
              </span>
            )}
            <span>·</span>
            <StatusBadge status={tender.status} />
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowAddBidder(true)}>+ Register Bid</button>
      </div>

      <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition ${
              tab === t ? "border-gem-700 text-gem-700 font-bold" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {t}
            {t === "Bidders" && tender.bids && tender.bids.length > 0 && (
              <span className="ml-1.5 text-xs text-slate-400">({tender.bids.length})</span>
            )}
          </button>
        ))}
      </div>

      {tab === "Overview" && <OverviewTab tender={tender} />}
      {tab === "Requirements" && <RequirementsTab tender={tender} />}
      {tab === "Bidders" && <BiddersTab tender={tender} />}
      {tab === "Compliance Summary" && <ComplianceSummaryTab tender={tender} />}

      {showAddBidder && <AddBidderModal tenderId={tender.id} onClose={() => setShowAddBidder(false)} onCreated={refresh} />}
    </div>
  );
}

// ---------------------------------------------------------------- Overview ----

function OverviewTab({ tender }: { tender: Tender }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-4">
          <div className="label-sm">Estimated Value</div>
          <div className="mt-1 text-lg font-semibold text-ink-900">{formatINR(tender.estimated_value)}</div>
        </div>
        <div className="panel p-4">
          <div className="label-sm">Min. Turnover</div>
          <div className="mt-1 text-lg font-semibold text-ink-900">{formatINR(tender.min_turnover)}</div>
        </div>
        <div className="panel p-4">
          <div className="label-sm">Min. Years / Local Content</div>
          <div className="mt-1 text-lg font-semibold text-ink-900">{tender.min_years_operation} yrs · {formatPct(tender.min_local_content_pct)}</div>
        </div>
        <div className="panel p-4">
          <div className="label-sm">OEM Authorization</div>
          <div className="mt-1 text-lg font-semibold text-ink-900">{tender.requires_oem_authorization ? "Required" : "Not Required"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="panel p-4">
          <div className="label-sm">Published</div>
          <div className="mt-1 text-sm font-medium text-ink-900">{formatDate(tender.published_date)}</div>
        </div>
        <div className="panel p-4">
          <div className="label-sm">Closing Date</div>
          <div className="mt-1 text-sm font-medium text-ink-900">{formatDate(tender.closing_date)}</div>
        </div>
        <div className="panel p-4">
          <div className="label-sm">Bids Received</div>
          <div className="mt-1 text-sm font-medium text-ink-900">{tender.bid_count}</div>
        </div>
      </div>

      {tender.description && (
        <div className="panel p-5">
          <div className="label-sm mb-2">Description</div>
          <p className="text-sm text-slate-700 leading-relaxed">{tender.description}</p>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------ Requirements ----

function RequirementsTab({ tender }: { tender: Tender }) {
  const reqs = tender.requirements || [];
  const mandatory = reqs.filter((r) => r.mandatory && r.applicable);
  const conditional = reqs.filter((r) => !r.mandatory && r.applicable);
  const notApplicable = reqs.filter((r) => !r.applicable);

  const Group = ({ title, items, tone }: { title: string; items: typeof reqs; tone: string }) =>
    items.length === 0 ? null : (
      <div className="panel mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${tone}`}>{items.length}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-slate-100">
          {items.map((r) => (
            <div key={r.id} className="bg-white px-4 py-3">
              <div className="text-sm font-medium text-ink-900">{r.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {r.document_type ? docTypeLabel(r.document_type) : "External verification"} · {r.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="panel p-4 text-center">
          <div className="text-2xl font-semibold text-status-failed">{mandatory.length}</div>
          <div className="label-sm mt-1">Mandatory</div>
        </div>
        <div className="panel p-4 text-center">
          <div className="text-2xl font-semibold text-status-warning">{conditional.length}</div>
          <div className="label-sm mt-1">Conditional</div>
        </div>
        <div className="panel p-4 text-center">
          <div className="text-2xl font-semibold text-slate-400">{notApplicable.length}</div>
          <div className="label-sm mt-1">Not Applicable</div>
        </div>
      </div>
      <Group title="Mandatory Requirements" items={mandatory} tone="bg-status-failedBg text-status-failed" />
      <Group title="Conditional Requirements" items={conditional} tone="bg-status-warningBg text-status-warning" />
      <Group title="Not Applicable to This Tender" items={notApplicable} tone="bg-slate-100 text-slate-500" />
      {reqs.length === 0 && <div className="panel p-8 text-center text-sm text-slate-400">No requirements attached to this tender.</div>}
    </div>
  );
}

// ----------------------------------------------------------------- Bidders ----

function BiddersTab({ tender }: { tender: Tender }) {
  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-100 bg-slate-50">
            <th className="px-5 py-2.5 font-medium">Bidder</th>
            <th className="px-5 py-2.5 font-medium">Documents</th>
            <th className="px-5 py-2.5 font-medium">Status</th>
            <th className="px-5 py-2.5 font-medium">Score</th>
            <th className="px-5 py-2.5 font-medium">Risk</th>
            <th className="px-5 py-2.5 font-medium">Final Decision</th>
            <th className="px-5 py-2.5 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {tender.bids?.map((b) => (
            <tr key={b.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
              <td className="px-5 py-3">
                <div className="font-medium text-ink-900">{b.bidder.company_name}</div>
                <div className="text-xs text-slate-500">{b.bidder.pan || "PAN pending"}</div>
              </td>
              <td className="px-5 py-3 text-slate-600">{b.document_count}</td>
              <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
              <td className="px-5 py-3 text-slate-700">{b.compliance_score !== null ? `${b.compliance_score}/100` : "—"}</td>
              <td className="px-5 py-3"><RiskBadge level={b.risk_level} /></td>
              <td className="px-5 py-3">{b.final_decision ? <StatusBadge status={b.final_decision} /> : <span className="text-xs text-slate-400">Pending officer review</span>}</td>
              <td className="px-5 py-3">
                <Link href={`/bids/${b.id}`} className="text-brand-600 text-xs font-medium hover:underline">Review →</Link>
              </td>
            </tr>
          ))}
          {(!tender.bids || tender.bids.length === 0) && (
            <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-400">No bids registered yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------------------------------ Compliance Summary ----

function ComplianceSummaryTab({ tender }: { tender: Tender }) {
  const bids = useMemo(() => tender.bids || [], [tender.bids]);

  const summary = useMemo(() => {
    const scored = bids.filter((b) => b.compliance_score !== null);
    const avgScore = scored.length ? Math.round(scored.reduce((s, b) => s + (b.compliance_score || 0), 0) / scored.length) : null;
    const qualified = bids.filter((b) => b.final_decision === "QUALIFIED").length;
    const disqualified = bids.filter((b) => b.final_decision === "DISQUALIFIED").length;
    const pending = bids.length - qualified - disqualified;
    const risk = { LOW: 0, MEDIUM: 0, HIGH: 0 } as Record<string, number>;
    bids.forEach((b) => { if (b.risk_level && risk[b.risk_level] !== undefined) risk[b.risk_level]++; });
    return { avgScore, qualified, disqualified, pending, risk, total: bids.length };
  }, [bids]);

  const ranked = useMemo(
    () => [...bids].sort((a, b) => (b.compliance_score ?? -1) - (a.compliance_score ?? -1)),
    [bids]
  );

  if (bids.length === 0) {
    return <div className="panel p-8 text-center text-sm text-slate-400">No bids yet — compliance summary will appear once bidders are registered and evaluated.</div>;
  }

  const riskBarColor: Record<string, string> = { LOW: "bg-status-verified", MEDIUM: "bg-status-warning", HIGH: "bg-status-failed" };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-4">
          <div className="label-sm">Average Compliance Score</div>
          <div className="mt-1 text-lg font-semibold text-ink-900">{summary.avgScore !== null ? `${summary.avgScore}/100` : "—"}</div>
        </div>
        <div className="panel p-4">
          <div className="label-sm">Qualified</div>
          <div className="mt-1 text-lg font-semibold text-status-verified">{summary.qualified}</div>
        </div>
        <div className="panel p-4">
          <div className="label-sm">Disqualified</div>
          <div className="mt-1 text-lg font-semibold text-status-failed">{summary.disqualified}</div>
        </div>
        <div className="panel p-4">
          <div className="label-sm">Pending Officer Decision</div>
          <div className="mt-1 text-lg font-semibold text-status-warning">{summary.pending}</div>
        </div>
      </div>

      <div className="panel p-5 mb-6">
        <div className="label-sm mb-3">Risk Distribution</div>
        <div className="space-y-2.5">
          {(["LOW", "MEDIUM", "HIGH"] as const).map((level) => {
            const count = summary.risk[level];
            const pct = summary.total ? Math.round((count / summary.total) * 100) : 0;
            return (
              <div key={level} className="flex items-center gap-3">
                <span className="w-16 text-xs font-medium text-slate-600">{level}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${riskBarColor[level]}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-14 text-xs text-slate-500 text-right">{count} bid{count === 1 ? "" : "s"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-ink-900">Bidders Ranked by Compliance Score</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {ranked.map((b, i) => (
            <Link
              key={b.id}
              href={`/bids/${b.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                <div>
                  <div className="text-sm font-medium text-ink-900">{b.bidder.company_name}</div>
                  <div className="text-xs text-slate-500">{b.document_count} documents · {b.status.replace(/_/g, " ")}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RiskBadge level={b.risk_level} />
                <span className="text-sm font-semibold text-ink-900 w-16 text-right">{b.compliance_score !== null ? `${b.compliance_score}/100` : "—"}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddBidderModal({ tenderId, onClose, onCreated }: { tenderId: string; onClose: () => void; onCreated: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: "", pan: "", gstin: "", udyam_number: "", enterprise_type: "Small",
    incorporation_year: 2018, declared_turnover: 10000000, declared_local_content_pct: 50,
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const bid = await api.post<{ id: string }>(`/tenders/${tenderId}/bids`, {
        bidder: {
          company_name: form.company_name, pan: form.pan || null, gstin: form.gstin || null,
          udyam_number: form.udyam_number || null, enterprise_type: form.enterprise_type,
          incorporation_year: form.incorporation_year,
        },
        declared_turnover: form.declared_turnover, declared_local_content_pct: form.declared_local_content_pct,
      });
      onCreated();
      onClose();
      router.push(`/bids/${bid.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to register bid");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form onSubmit={submit} className="bg-white rounded-lg shadow-panel w-full max-w-md p-6">
        <h2 className="text-base font-semibold text-ink-900 mb-4">Register Bidder</h2>
        {error && <div className="mb-3 text-sm text-status-failed bg-status-failedBg rounded px-3 py-2">{error}</div>}
        <div className="space-y-3">
          <div>
            <label className="label-sm block mb-1">Company Name</label>
            <input required className="input" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-sm block mb-1">PAN</label>
              <input className="input" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label className="label-sm block mb-1">GSTIN</label>
              <input className="input" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-sm block mb-1">Declared Turnover (₹)</label>
              <input type="number" className="input" value={form.declared_turnover} onChange={(e) => setForm({ ...form, declared_turnover: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label-sm block mb-1">Declared Local Content %</label>
              <input type="number" className="input" value={form.declared_local_content_pct} onChange={(e) => setForm({ ...form, declared_local_content_pct: Number(e.target.value) })} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={busy} className="btn-primary">{busy ? "Registering…" : "Register & Continue"}</button>
        </div>
      </form>
    </div>
  );
}
