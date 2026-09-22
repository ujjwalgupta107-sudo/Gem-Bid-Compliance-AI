"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, fetchAuthedBlob } from "@/lib/api";
import { Bid, ComplianceEvaluation, DocumentRecord, Finding, RiskAssessment, Verification, AuditEvent } from "@/lib/types";
import { formatINR, formatPct, formatDate, formatDateTime, docTypeLabel } from "@/lib/format";
import { StatusBadge, RiskBadge, SeverityBadge } from "@/components/StatusBadge";
import { EvidencePanel, EvidenceChainStep } from "@/components/EvidencePanel";
import { ReviewModal } from "@/components/ReviewModal";
import { UploadPanel } from "@/components/UploadPanel";

const TABS = ["Overview", "Documents", "Compliance Matrix", "Findings", "Verification", "Audit Trail", "Final Decision"] as const;
type Tab = (typeof TABS)[number];

export default function BidDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("Overview");
  const [bid, setBid] = useState<Bid | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [evaluations, setEvaluations] = useState<ComplianceEvaluation[]>([]);
  const [risk, setRisk] = useState<RiskAssessment | null>(null);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [chainValid, setChainValid] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(false);

  const refreshAll = useCallback(async () => {
    const [b, docs, compliance, f, a] = await Promise.all([
      api.get<Bid>(`/bids/${id}`),
      api.get<DocumentRecord[]>(`/bids/${id}/documents`),
      api.get<{ evaluations: ComplianceEvaluation[]; risk: RiskAssessment | null; verifications: Verification[] }>(`/bids/${id}/compliance`),
      api.get<Finding[]>(`/bids/${id}/findings`),
      api.get<{ events: AuditEvent[]; chain_integrity: { valid: boolean } }>(`/bids/${id}/audit`),
    ]);
    setBid(b);
    setDocuments(docs);
    setEvaluations(compliance.evaluations);
    setRisk(compliance.risk);
    setVerifications(compliance.verifications);
    setFindings(f);
    setAudit(a.events);
    setChainValid(a.chain_integrity.valid);
  }, [id]);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  async function runVerification() {
    setVerifying(true);
    try {
      await api.post(`/bids/${id}/verify`);
      await refreshAll();
    } finally {
      setVerifying(false);
    }
  }

  async function downloadReport() {
    const blob = await fetchAuthedBlob(`/bids/${id}/report`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Compliance_Report_${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!bid) return <div className="p-8 text-sm text-slate-500">Loading bid…</div>;

  return (
    <div className="space-y-6">
      {/* Live Bidder Evaluation Header from Stitch */}
      <div className="bg-slate-900 text-white p-5 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white tracking-wide">{bid.bidder.company_name}</h2>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {bid.final_decision || "Primary Bidder"}
            </span>
            <RiskBadge level={bid.risk_level} />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
            <span><strong>Tender Ref:</strong> {bid.tender?.tender_number || "GEM/2026/B123"}</span>
            <span>•</span>
            <span><strong>Tender Value:</strong> {bid.tender ? formatINR(bid.tender.estimated_value) : "—"}</span>
            <span>•</span>
            <span><strong>Category:</strong> {bid.tender?.category || "General Goods & Services"}</span>
            <span>•</span>
            <span><strong>Submission:</strong> {formatDateTime(bid.submitted_at)}</span>
          </div>
        </div>

        {/* Right Action & Score */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Compliance Score</p>
              <p className="text-xs font-semibold text-emerald-400">
                {bid.risk_level === "LOW" ? "Low Risk • Qualified" : bid.risk_level === "MEDIUM" ? "Medium Risk • Review" : "High Risk • Non-Compliant"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-black text-xl text-emerald-300">
              {bid.compliance_score ?? (risk?.overall_score ?? 92)}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="btn-secondary text-xs" onClick={downloadReport}>Export Dossier</button>
            <button className="btn-primary text-xs" disabled={verifying} onClick={runVerification}>
              {verifying ? "Verifying…" : "Re-Verify APIs"}
            </button>
          </div>
        </div>
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
          </button>
        ))}
      </div>

      {tab === "Overview" && <OverviewTab bid={bid} risk={risk} findings={findings} />}
      {tab === "Documents" && <DocumentsTab bidId={id} documents={documents} onChanged={refreshAll} />}
      {tab === "Compliance Matrix" && <ComplianceMatrixTab evaluations={evaluations} onChanged={refreshAll} />}
      {tab === "Findings" && <FindingsTab findings={findings} onChanged={refreshAll} />}
      {tab === "Verification" && <VerificationTab verifications={verifications} />}
      {tab === "Audit Trail" && <AuditTab events={audit} chainValid={chainValid} />}
      {tab === "Final Decision" && <FinalDecisionTab bid={bid} risk={risk} evaluations={evaluations} findings={findings} onChanged={refreshAll} />}
    </div>
  );
}

// ---------------------------------------------------------------- Overview ----

function OverviewTab({ bid, risk, findings }: { bid: Bid; risk: RiskAssessment | null; findings: Finding[] }) {
  const openFindings = findings.filter((f) => f.status === "OPEN");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="panel p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-3">Bidder Identity &amp; Registration</h2>
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            <Field label="Company Name" value={bid.bidder.company_name} />
            <Field label="Enterprise Type" value={bid.bidder.enterprise_type || "—"} />
            <Field label="PAN" value={bid.bidder.pan || "—"} mono />
            <Field label="GSTIN" value={bid.bidder.gstin || "—"} mono />
            <Field label="Udyam Number" value={bid.bidder.udyam_number || "—"} mono />
            <Field label="Incorporation Year" value={bid.bidder.incorporation_year?.toString() || "—"} />
            <Field label="Declared Turnover" value={formatINR(bid.declared_turnover)} />
            <Field label="Declared Local Content" value={formatPct(bid.declared_local_content_pct)} />
          </dl>
        </div>

        {risk && (
          <div className="panel p-5">
            <h2 className="text-sm font-semibold text-ink-900 mb-1">Compliance Score: {risk.overall_score}/100</h2>
            <p className="text-xs text-slate-500 mb-4">Risk Level: {risk.risk_level} — computed transparently from rule outcomes and AI findings.</p>
            <div className="grid grid-cols-2 gap-3">
              <ScoreBar label="Document Completeness" value={risk.document_completeness_pct} />
              <ScoreBar label="Registry Verification" value={risk.registry_verification_pct} />
              <ScoreBar label="Tender Compliance" value={risk.tender_compliance_pct} />
              <ScoreBar label="Consistency" value={risk.consistency_pct} />
            </div>
            {risk.risk_factors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="label-sm mb-2">Risk Factors</div>
                <ul className="space-y-1.5">
                  {risk.risk_factors.map((f, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-status-warning">•</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="panel p-5">
          <h2 className="text-sm font-semibold text-ink-900 mb-3">Open AI Findings ({openFindings.length})</h2>
          {openFindings.length === 0 && <div className="text-sm text-slate-400">No open findings.</div>}
          <div className="space-y-3">
            {openFindings.slice(0, 4).map((f) => (
              <div key={f.id} className="text-sm">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={f.severity} />
                  <span className="font-medium text-ink-900">{f.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5 bg-ink-950 text-slate-200">
          <div className="text-xs uppercase tracking-wide text-brand-400 font-semibold mb-2">Human-in-the-loop</div>
          <p className="text-xs leading-relaxed text-slate-300">
            This score, risk level and every finding are AI-generated recommendations backed by evidence.
            They do not qualify or disqualify the bidder. The Procurement Officer records the binding decision
            in the Final Decision tab.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="label-sm">{label}</div>
      <div className={`mt-0.5 text-sm text-ink-900 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-status-verified" : value >= 55 ? "bg-status-warning" : "bg-status-failed";
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// --------------------------------------------------------------- Documents ----

function DocumentsTab({ bidId, documents, onChanged }: { bidId: string; documents: DocumentRecord[]; onChanged: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  async function process(docId: string) {
    setProcessing(docId);
    try {
      await api.post(`/documents/${docId}/process`);
      onChanged();
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <UploadPanel bidId={bidId} onUploaded={onChanged} />
      </div>
      <div className="lg:col-span-2 space-y-3">
        {documents.map((d) => (
          <div key={d.id} className="panel">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-ink-900">{d.original_filename}</div>
                <div className="text-xs text-slate-500 mt-0.5">{docTypeLabel(d.document_type)} · {(d.size_bytes / 1024).toFixed(0)} KB · {d.page_count} page(s)</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={d.status} />
                {d.status === "QUEUED" && (
                  <button className="btn-secondary text-xs px-2.5 py-1.5" disabled={processing === d.id} onClick={() => process(d.id)}>
                    {processing === d.id ? "Processing…" : "Process"}
                  </button>
                )}
                <button className="text-xs text-brand-600 font-medium hover:underline" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                  {expanded === d.id ? "Hide" : "Details"}
                </button>
              </div>
            </div>
            {expanded === d.id && (
              <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 grid grid-cols-2 gap-4">
                <div>
                  <div className="label-sm mb-2">Processing Log</div>
                  <div className="space-y-1.5">
                    {d.processing_log.map((l, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-medium text-ink-800">[{l.stage}]</span>{" "}
                        <span className="text-slate-600">{l.message}</span>
                      </div>
                    ))}
                    {d.processing_log.length === 0 && <div className="text-xs text-slate-400">Not yet processed.</div>}
                  </div>
                </div>
                <div>
                  <div className="label-sm mb-2">Extracted Fields (AI Extraction)</div>
                  {d.extracted_fields.length === 0 && <div className="text-xs text-slate-400">No fields extracted yet.</div>}
                  <div className="space-y-2">
                    {d.extracted_fields.map((f) => (
                      <div key={f.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">{f.field_name.replace(/_/g, " ")}</span>
                        <span className="font-medium text-ink-900">{f.field_value}</span>
                        <span className="text-slate-400">{(f.confidence * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {documents.length === 0 && <div className="panel p-8 text-center text-sm text-slate-400">No documents uploaded yet.</div>}
      </div>
    </div>
  );
}

// --------------------------------------------------------- Compliance Matrix ----

function ComplianceMatrixTab({ evaluations, onChanged }: { evaluations: ComplianceEvaluation[]; onChanged: () => void }) {
  const [evidence, setEvidence] = useState<ComplianceEvaluation | null>(null);
  const [reviewing, setReviewing] = useState<ComplianceEvaluation | null>(null);

  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-100 bg-slate-50">
            <th className="px-5 py-2.5 font-medium">Requirement</th>
            <th className="px-5 py-2.5 font-medium">Source</th>
            <th className="px-5 py-2.5 font-medium">Status</th>
            <th className="px-5 py-2.5 font-medium">Officer Status</th>
            <th className="px-5 py-2.5 font-medium">Confidence</th>
            <th className="px-5 py-2.5 font-medium">Finding</th>
            <th className="px-5 py-2.5 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((e) => (
            <tr key={e.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
              <td className="px-5 py-3">
                <div className="font-medium text-ink-900">{e.requirement.label}</div>
                <div className="text-xs text-slate-500">{e.requirement.code}</div>
              </td>
              <td className="px-5 py-3 text-slate-600 text-xs">{e.requirement.document_type ? docTypeLabel(e.requirement.document_type) : "External Connector"}</td>
              <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
              <td className="px-5 py-3">{e.officer_status ? <StatusBadge status={e.officer_status} /> : <span className="text-xs text-slate-400">—</span>}</td>
              <td className="px-5 py-3 text-slate-600">{e.confidence !== null ? `${(e.confidence * 100).toFixed(0)}%` : "—"}</td>
              <td className="px-5 py-3 text-xs text-slate-600 max-w-[220px] truncate">{e.finding_summary}</td>
              <td className="px-5 py-3 whitespace-nowrap">
                <button className="text-xs text-brand-600 font-medium hover:underline mr-3" onClick={() => setEvidence(e)}>Evidence</button>
                <button className="text-xs text-slate-500 font-medium hover:underline" onClick={() => setReviewing(e)}>Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {evidence && (
        <EvidencePanel
          open={!!evidence}
          onClose={() => setEvidence(null)}
          title={evidence.requirement.label}
          documentId={evidence.evidence_document_id}
          chain={buildRuleChain(evidence)}
          verdict={evidence.status}
        />
      )}
      {reviewing && (
        <ReviewModal
          target={{ kind: "evaluation", id: reviewing.id }}
          title={`${reviewing.requirement.label} — currently ${reviewing.status}`}
          onClose={() => setReviewing(null)}
          onDone={onChanged}
        />
      )}
    </div>
  );
}

function buildRuleChain(e: ComplianceEvaluation): EvidenceChainStep[] {
  const trace = e.rule_trace || {};
  const steps: EvidenceChainStep[] = [
    { label: "Requirement", value: e.requirement.label },
    { label: "Source Document", value: e.evidence_document_id ? "Uploaded bidder document" : "External sandbox connector" },
  ];
  if (trace.reason) steps.push({ label: "Rule Evaluated", value: String(trace.reason) });
  if (trace.value !== undefined) steps.push({ label: "Extracted / Observed Value", value: String(trace.value) });
  if (trace.threshold !== undefined) steps.push({ label: "Required Threshold", value: String(trace.threshold) });
  if (trace.compare_to !== undefined) steps.push({ label: "Compared To", value: String(trace.compare_to) });
  if (trace.value_a !== undefined) steps.push({ label: "Value A", value: String(trace.value_a) });
  if (trace.value_b !== undefined) steps.push({ label: "Value B", value: String(trace.value_b) });
  return steps;
}

// ---------------------------------------------------------------- Findings ----

function FindingsTab({ findings, onChanged }: { findings: Finding[]; onChanged: () => void }) {
  const [evidence, setEvidence] = useState<Finding | null>(null);
  const [reviewing, setReviewing] = useState<Finding | null>(null);

  return (
    <div className="space-y-3">
      {findings.map((f) => (
        <div key={f.id} className="panel p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <SeverityBadge severity={f.severity} />
                <span className="text-[11px] uppercase tracking-wide text-slate-400">{f.finding_type.replace(/_/g, " ")}</span>
                <StatusBadge status={f.status} />
              </div>
              <div className="text-sm font-semibold text-ink-900">{f.title}</div>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">{f.description}</p>
              {f.recommendation && (
                <p className="text-sm text-brand-600 mt-2"><span className="font-medium">AI Recommendation:</span> {f.recommendation}</p>
              )}
              <div className="text-xs text-slate-400 mt-2">Confidence: {(f.confidence * 100).toFixed(0)}%{f.similarity !== null ? ` · Similarity: ${(f.similarity * 100).toFixed(0)}%` : ""}</div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
              <button className="text-xs text-brand-600 font-medium hover:underline" onClick={() => setEvidence(f)}>View Evidence</button>
              {f.status === "OPEN" && (
                <button className="text-xs text-slate-500 font-medium hover:underline" onClick={() => setReviewing(f)}>Review</button>
              )}
            </div>
          </div>
        </div>
      ))}
      {findings.length === 0 && <div className="panel p-8 text-center text-sm text-slate-400">No AI findings for this bid. Run verification to generate an evaluation.</div>}

      {evidence && (
        <EvidencePanel
          open={!!evidence}
          onClose={() => setEvidence(null)}
          title={evidence.title}
          documentId={evidence.evidence_document_id}
          page={evidence.evidence_page}
          comparedDocumentId={evidence.compared_document_id}
          comparedPage={evidence.compared_page}
          chain={[
            { label: "Finding", value: evidence.title },
            { label: "Evidence Document", value: evidence.field_a ? `${evidence.field_a.replace(/_/g, " ")} = ${evidence.value_a}` : "—" },
            ...(evidence.compared_document_id ? [{ label: "Compared Document", value: `${evidence.field_b?.replace(/_/g, " ")} = ${evidence.value_b}` }] : []),
            { label: "Observation", value: evidence.description },
            { label: "AI Confidence", value: `${(evidence.confidence * 100).toFixed(0)}%` },
          ]}
          verdict={evidence.severity}
        />
      )}
      {reviewing && (
        <ReviewModal
          target={{ kind: "finding", id: reviewing.id }}
          title={reviewing.title}
          onClose={() => setReviewing(null)}
          onDone={onChanged}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------- Verification ----

function VerificationTab({ verifications }: { verifications: Verification[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {verifications.map((v) => (
        <div key={v.id} className="panel p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-ink-900">{v.connector_label}</div>
            <StatusBadge status={v.status} />
          </div>
          <div className="text-xs text-slate-500 mb-2">{v.source_label} · checked {formatDateTime(v.checked_at)} · {v.latency_ms}ms</div>
          <div className="bg-slate-50 rounded p-2 text-xs font-mono text-slate-600 overflow-x-auto">
            {JSON.stringify(v.response_payload, null, 2)}
          </div>
        </div>
      ))}
      {verifications.length === 0 && <div className="panel p-8 text-center text-sm text-slate-400 md:col-span-2">No verification runs yet. Click &quot;Run Verification &amp; Evaluate&quot;.</div>}
    </div>
  );
}

// ----------------------------------------------------------------- Audit ----

function AuditTab({ events, chainValid }: { events: AuditEvent[]; chainValid: boolean | null }) {
  return (
    <div className="panel overflow-hidden">
      <div className={`px-5 py-3 text-xs font-medium border-b border-slate-100 ${chainValid ? "bg-status-verifiedBg text-status-verified" : "bg-status-failedBg text-status-failed"}`}>
        {chainValid ? "✓ Audit chain integrity verified — SHA-256 hash-chained, tamper-evident event log" : "⚠ Audit chain integrity check failed"}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-100 bg-slate-50">
            <th className="px-5 py-2.5 font-medium">Timestamp</th>
            <th className="px-5 py-2.5 font-medium">Actor</th>
            <th className="px-5 py-2.5 font-medium">Action</th>
            <th className="px-5 py-2.5 font-medium">Entity</th>
            <th className="px-5 py-2.5 font-medium">Event Hash</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-b border-slate-50 last:border-0">
              <td className="px-5 py-2.5 text-xs text-slate-600 whitespace-nowrap">{formatDateTime(e.timestamp)}</td>
              <td className="px-5 py-2.5 text-xs text-slate-700">{e.actor}</td>
              <td className="px-5 py-2.5 text-xs font-medium text-ink-900">{e.action.replace(/_/g, " ")}</td>
              <td className="px-5 py-2.5 text-xs text-slate-500">{e.entity_type}</td>
              <td className="px-5 py-2.5 text-[10px] font-mono text-slate-400">{e.event_hash.slice(0, 16)}…</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------------------------------------ Final Decision ----

function FinalDecisionTab({ bid, risk, evaluations, findings, onChanged }: {
  bid: Bid; risk: RiskAssessment | null; evaluations: ComplianceEvaluation[]; findings: Finding[]; onChanged: () => void;
}) {
  const [decision, setDecision] = useState("QUALIFIED");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const critical = evaluations.filter((e) => e.status === "FAILED" && e.officer_status !== "VERIFIED");
  const warnings = evaluations.filter((e) => e.status === "WARNING");
  const openFindings = findings.filter((f) => f.status === "OPEN");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post(`/bids/${bid.id}/final-decision`, { decision, reason });
      onChanged();
    } catch (err) {
      setError((err as Error).message || "Failed to record decision");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 panel p-5">
        <h2 className="text-sm font-semibold text-ink-900 mb-4">Evaluation Summary</h2>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center p-3 rounded bg-slate-50">
            <div className="text-2xl font-semibold text-ink-900">{risk?.overall_score ?? "—"}</div>
            <div className="label-sm mt-1">Compliance Score</div>
          </div>
          <div className="text-center p-3 rounded bg-status-failedBg">
            <div className="text-2xl font-semibold text-status-failed">{critical.length}</div>
            <div className="label-sm mt-1">Critical Failures</div>
          </div>
          <div className="text-center p-3 rounded bg-status-warningBg">
            <div className="text-2xl font-semibold text-status-warning">{warnings.length + openFindings.length}</div>
            <div className="label-sm mt-1">Warnings / Open Findings</div>
          </div>
        </div>

        {bid.final_decision ? (
          <div className="rounded-md border border-slate-200 p-4 bg-slate-50">
            <div className="text-sm font-semibold text-ink-900 mb-1">Final decision entered by Procurement Officer</div>
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={bid.final_decision} />
              <span className="text-xs text-slate-500">by {bid.final_decision_by} · {formatDate(bid.final_decision_at)}</span>
            </div>
            <p className="text-sm text-slate-700">{bid.final_decision_reason}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="border-t border-slate-100 pt-5">
            <div className="text-xs text-slate-500 mb-3">
              This decision is entered by the Procurement Officer. The AI system does not qualify or disqualify bidders — it only provides recommendations, evidence and risk analysis above.
            </div>
            {error && <div className="mb-3 text-sm text-status-failed bg-status-failedBg rounded px-3 py-2">{error}</div>}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {["QUALIFIED", "DISQUALIFIED", "CLARIFICATION_REQUIRED"].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDecision(d)}
                  className={`rounded-md border px-3 py-2.5 text-sm font-medium ${decision === d ? "border-ink-900 bg-ink-900 text-white" : "border-slate-300 text-slate-600 hover:bg-slate-50"}`}
                >
                  {d.replace(/_/g, " ")}
                </button>
              ))}
            </div>
            <label className="label-sm block mb-1">Justification (mandatory)</label>
            <textarea required className="input" rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the basis for this decision with reference to the compliance matrix and findings above." />
            <button type="submit" disabled={busy} className="btn-primary mt-3">{busy ? "Recording…" : "Record Final Decision"}</button>
          </form>
        )}
      </div>
      <div className="panel p-5 bg-ink-950 text-slate-200 h-fit">
        <div className="text-xs uppercase tracking-wide text-brand-400 font-semibold mb-2">Policy Reminder</div>
        <p className="text-xs leading-relaxed text-slate-300">
          Per SIH26100 requirements, the AI/system provides extraction, verification, compliance analysis, risk
          assessment, recommendations, evidence and auditability only. It must not — and does not — autonomously
          make the final procurement decision. That authority rests solely with the Procurement Officer.
        </p>
      </div>
    </div>
  );
}
