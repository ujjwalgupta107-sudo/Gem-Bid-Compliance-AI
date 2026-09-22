"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("procurement@cpcl.gov.in");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* Top Tricolor Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 fixed top-0 left-0 right-0 z-50"></div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Branding Panel */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between bg-gem-950 text-white p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gem-900/40 via-gem-950 to-slate-950 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gem-900 flex items-center justify-center text-amber-400 font-bold shadow-sm ring-1 ring-gem-700">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C10.9 2 10 2.9 10 4V6H14V4C14 2.9 13.1 2 12 2M6 8V10C6 11.1 6.9 12 8 12H9V18H7V20H17V18H15V12H16C17.1 12 18 11.1 18 10V8H6M12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7Z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Government e-Marketplace</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white tracking-tight">Bid Compliance Copilot</span>
                  <span className="bg-gem-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-gem-700">
                    SIH 2026 AI
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-3xl font-extrabold leading-tight text-white max-w-lg">
              Statutory Bid Compliance Verification Platform for GeM
            </div>
            <div className="mt-4 text-sm text-slate-300 max-w-lg leading-relaxed">
              Chennai Petroleum Corporation Limited (CPCL) • Ministry of Petroleum &amp; Natural Gas
            </div>
          </div>

          <div className="space-y-6 max-w-lg relative z-10">
            <div className="text-xs text-slate-300 leading-relaxed bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              Autonomous multi-registry cross-referencing against sovereign databases (GSTN, PAN, Udyam MSME, EPFO, ESIC, CPPP Debarment).
              AI generates statutory reasoning while the <strong>Procurement Officer retains final adjudication authority</strong>.
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Deterministic Rule Engine</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Live Sovereign Connectors</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />SHA-256 Tamper Audit Trail</div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-panel">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Secure Officer Access</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Procurement Officer Sign In</h2>
              <p className="text-xs text-slate-500 mt-1">Authenticate to review statutory compliance dossiers</p>
            </div>

            {error && (
              <div className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="label-sm block mb-1.5">Officer Government Email</label>
                <input
                  className="input text-xs"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. procurement@cpcl.gov.in"
                  required
                />
              </div>

              <div>
                <label className="label-sm block mb-1.5">Password</label>
                <input
                  className="input text-xs"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full mt-6 py-2.5 text-xs font-bold">
              {busy ? "Authenticating Digital Credentials…" : "Sign In to Copilot"}
            </button>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700">Prototype Demo Credentials:</span>
              <div className="font-mono text-slate-600 mt-1">
                Email: <span className="text-gem-800 font-semibold">procurement@cpcl.gov.in</span>
                <br />
                Password: <span className="text-gem-800 font-semibold">demo123</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
