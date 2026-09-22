"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import LoginIntelligenceNetwork from "@/components/3d/LoginIntelligenceNetwork";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("procurement@cpcl.gov.in");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Incorrect government email or password.");
        } else if (err.status === 0 || err.status === 503) {
          setError("Unable to connect to the authentication service.");
        } else if (err.status >= 500) {
          setError("Authentication service is temporarily unavailable.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Login failed");
      }
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
          <LoginIntelligenceNetwork />
          <div className="absolute inset-0 bg-gem-950/20 pointer-events-none" />

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

              <div className="relative">
                <label className="label-sm block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    className="input text-xs pr-10"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={busy || success} className={`btn-primary w-full mt-6 py-2.5 text-xs font-bold ${success ? 'bg-emerald-600 hover:bg-emerald-600 border-emerald-600' : ''}`}>
              {success ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Authentication verified
                </div>
              ) : busy ? (
                "Authenticating Digital Credentials…"
              ) : (
                "Sign In to Copilot"
              )}
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
