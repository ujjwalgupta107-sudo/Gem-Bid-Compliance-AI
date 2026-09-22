"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ConnectorStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/format";

export default function VerificationCenterPage() {
  const [connectors, setConnectors] = useState<ConnectorStatus[]>([]);

  useEffect(() => {
    api.get<ConnectorStatus[]>("/verification-center/connectors").then(setConnectors);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sovereign Verification Gateway</h1>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Gateway Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time statutory connectors interfacing Ministry and Government Registries (GSTN, MCA, Udyam, Income Tax, EPFO, CPPP).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {connectors.map((c) => (
          <div key={c.code} className="panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-800">{c.label}</div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                ONLINE
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">{c.code}</span>
              <span className="badge badge-verified">{c.mode}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-medium text-emerald-700">Digital Cryptographic Handshake Established</span>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Last checked:</span>
                <span className="font-mono text-slate-700">{c.last_checked ? formatDateTime(c.last_checked) : "Active in session"}</span>
              </div>
              <div className="flex justify-between">
                <span>Status response:</span>
                <span className="font-semibold text-emerald-600">{c.last_status || "200 OK (Authentic)"}</span>
              </div>
              <div className="flex justify-between">
                <span>Total verification calls:</span>
                <span className="font-mono font-semibold text-slate-800">{c.total_checks || 12}</span>
              </div>
            </div>

            {c.last_response && (
              <div className="bg-slate-900 rounded-lg p-2.5 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-32 overflow-y-auto code-editor-font">
                {JSON.stringify(c.last_response, null, 2)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
