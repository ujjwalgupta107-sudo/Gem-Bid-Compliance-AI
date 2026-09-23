"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import LoginIntelligenceNetwork from "@/components/3d/LoginIntelligenceNetwork";
import { BrandText } from "@/components/ui/BrandText";

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
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-white relative overflow-hidden">
      {/* Subtle Tricolour Header Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-orange-500 via-white to-green-600 fixed top-0 left-0 z-50 shadow-[0_2px_10px_rgba(255,255,255,0.1)]"></div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen relative z-10">
        {/* Left Branding Panel */}
        <div className="flex lg:col-span-7 flex-col justify-between p-8 pt-20 sm:p-12 lg:p-16 relative overflow-hidden min-h-[500px] lg:min-h-0">
          <div className="absolute inset-0 bg-[#0F172A]/20 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-start gap-6">
            <a href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-[#00F5FF] transition-colors bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </a>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 font-bold shadow-sm ring-1 ring-slate-700">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C10.9 2 10 2.9 10 4V6H14V4C14 2.9 13.1 2 12 2M6 8V10C6 11.1 6.9 12 8 12H9V18H7V20H17V18H15V12H16C17.1 12 18 11.1 18 10V8H6M12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7Z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Government e-Marketplace</span>
                <div className="flex items-center gap-2">
                  <BrandText inline className="text-xl" />
                  <span className="bg-slate-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                    SIH 2026 AI
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-3xl font-extrabold leading-tight text-white max-w-lg">
              Statutory Bid Compliance Verification Platform for GeM
            </div>
            <div className="mt-4 text-sm text-slate-200 max-w-lg leading-relaxed">
              Chennai Petroleum Corporation Limited (CPCL) • Ministry of Petroleum &amp; Natural Gas
            </div>
          </div>
          
          {/* Inserted here to stack naturally on mobile between the header text and footer cards */}
          <LoginIntelligenceNetwork />

          <div className="space-y-6 max-w-lg relative z-10">
            <div className="text-xs text-slate-200 leading-relaxed bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xs">
              Autonomous multi-registry cross-referencing against sovereign databases (GSTN, PAN, Udyam MSME, EPFO, ESIC, CPPP Debarment).
              AI generates statutory reasoning while the <strong>Procurement Officer retains final adjudication authority</strong>.
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-4 border-t border-white/20">
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Deterministic Rule Engine</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Live Sovereign Connectors</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />SHA-256 Tamper Audit Trail</div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 relative z-10">
          
          {/* Ambient Form Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-[#00F5FF]/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

          <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#0F172A]/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,245,255,0.08)] relative">
            <div className="mb-6 border-b border-white/20 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="text-[10px] font-bold text-[#00F5FF] uppercase tracking-widest">Secure Officer Access</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Procurement Sign In</h2>
              <p className="text-xs text-slate-300 mt-1">Authenticate to review statutory compliance dossiers</p>
            </div>

            {error && (
              <div className="mb-6 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex items-center gap-3 backdrop-blur-sm shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block mb-2">Officer Government Email</label>
                <input
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF] focus:bg-white/15 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. procurement@cpcl.gov.in"
                  required
                />
              </div>

              <div className="relative">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block mb-2">Password</label>
                <div className="relative">
                  <input
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-400 outline-none transition-all focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF] focus:bg-white/15 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00F5FF] transition-colors focus:outline-none"
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

            <button 
              type="submit" 
              disabled={busy || success} 
              className={`w-full mt-8 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(0,245,255,0.2)] hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                success 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                : 'bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30 hover:bg-[#00F5FF]/20'
              }`}
            >
              {success ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Authentication Verified
                </div>
              ) : busy ? (
                "Authenticating Credentials…"
              ) : (
                "Sign In to Platform"
              )}
            </button>

            <div className="mt-8 pt-6 border-t border-white/20 text-xs text-slate-300 bg-white/10 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white tracking-wide">Prototype Demo Credentials:</span>
              <div className="font-mono text-slate-200 mt-2 space-y-1">
                <div>Email: <span className="text-[#00F5FF] font-semibold">procurement@cpcl.gov.in</span></div>
                <div>Password: <span className="text-[#00F5FF] font-semibold">demo123</span></div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
