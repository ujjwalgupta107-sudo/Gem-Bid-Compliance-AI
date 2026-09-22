"use client";
import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function LandingFooter() {
  return (
    <footer className="relative bg-[#0B0F17] pt-20 pb-10 border-t border-white/5 overflow-hidden text-slate-400">
      {/* Subtle Tricolour Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 via-white to-green-600 opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Logo size="md" variant="light" />
            <p className="text-xs text-slate-400 mt-2 max-w-md">
              AI-Powered Government Tender Verification & Compliance Platform. Built for SIH 2026 Innovation.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-mono">
            <Link href="/tenders" className="hover:text-white transition-colors">
              Active Tenders
            </Link>
            <Link href="/matrix" className="hover:text-white transition-colors">
              Compliance Matrix
            </Link>
            <Link href="/risk" className="hover:text-white transition-colors">
              Risk Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Officer Login
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Government e-Marketplace (GeM) Sandbox Feeds Connected</span>
          </div>

          <span>© 2026 Bid Compliance Platform. SIH 2026 Innovation Project.</span>
        </div>
      </div>
    </footer>
  );
}
