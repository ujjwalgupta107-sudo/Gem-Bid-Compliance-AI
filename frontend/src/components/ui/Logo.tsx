import React from "react";
import { BrandText } from "./BrandText";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  className?: string;
}

export function Logo({ size = "md", variant = "dark", className = "" }: LogoProps) {
  const sizes = {
    sm: { box: "w-8 h-8", icon: "w-4 h-4", text: "text-sm", sub: "text-[9px]" },
    md: { box: "w-10 h-10", icon: "w-5 h-5", text: "text-sm", sub: "text-[10px]" },
    lg: { box: "w-12 h-12", icon: "w-6 h-6", text: "text-lg", sub: "text-[11px]" },
  };

  const s = sizes[size];
  const bgColor = variant === "dark" ? "bg-slate-800" : "bg-white/10";
  const ringColor = variant === "dark" ? "ring-1 ring-slate-700" : "ring-1 ring-white/20";
  const subColor = variant === "dark" ? "text-slate-300" : "text-slate-400";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${s.box} rounded-xl ${bgColor} ${ringColor} flex items-center justify-center text-white font-bold shadow-md shrink-0 relative overflow-hidden`}>
        {/* Subtle Tricolour Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-orange-500 opacity-80 shadow-[0_2px_4px_rgba(249,115,22,0.4)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-green-500 opacity-80 shadow-[0_-2px_4px_rgba(34,197,94,0.4)]"></div>
        
        <svg className={`${s.icon} relative z-10 drop-shadow-sm`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C10.9 2 10 2.9 10 4V6H14V4C14 2.9 13.1 2 12 2M6 8V10C6 11.1 6.9 12 8 12H9V18H7V20H17V18H15V12H16C17.1 12 18 11.1 18 10V8H6M12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7Z" />
        </svg>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`${s.sub} font-bold uppercase tracking-wider ${subColor}`}>Government e-Marketplace</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BrandText className={s.text} />
          <span className="bg-[#00F5FF]/10 text-[#00F5FF] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#00F5FF]/20 uppercase tracking-wider shrink-0">SIH 2026 AI</span>
        </div>
      </div>
    </div>
  );
}

export function LogoIcon({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = {
    sm: { box: "w-8 h-8", icon: "w-4 h-4" },
    md: { box: "w-10 h-10", icon: "w-5 h-5" },
    lg: { box: "w-12 h-12", icon: "w-6 h-6" },
  };
  const s = sizes[size];

  return (
    <div className={`${s.box} rounded-xl bg-slate-800 ring-1 ring-slate-700 flex items-center justify-center text-white font-bold shadow-md relative overflow-hidden ${className}`}>
      {/* Subtle Tricolour Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-orange-500 opacity-80 shadow-[0_2px_4px_rgba(249,115,22,0.4)]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/5 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-green-500 opacity-80 shadow-[0_-2px_4px_rgba(34,197,94,0.4)]"></div>

      <svg className={`${s.icon} relative z-10 drop-shadow-sm`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C10.9 2 10 2.9 10 4V6H14V4C14 2.9 13.1 2 12 2M6 8V10C6 11.1 6.9 12 8 12H9V18H7V20H17V18H15V12H16C17.1 12 18 11.1 18 10V8H6M12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7Z" />
      </svg>
    </div>
  );
}
