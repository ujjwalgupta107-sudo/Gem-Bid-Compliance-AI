"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tenders?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      href: "/tenders",
      label: "Tenders",
      badge: "Active",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
    {
      href: "/verification-center",
      label: "Verifications",
      pulse: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col font-sans">
      {/* Top Tricolor Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 fixed top-0 left-0 right-0 z-50"></div>

      {/* BEGIN: TopHeader */}
      <header className="bg-white border-b border-slate-200 sticky top-1 z-40 shadow-xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Brand & Indian Emblem */}
          <div className="flex items-center gap-3.5">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gem-900 flex items-center justify-center text-amber-400 font-bold shadow-sm ring-1 ring-gem-800">
                {/* Ashoka Pillar / Emblem Motif SVG */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C10.9 2 10 2.9 10 4V6H14V4C14 2.9 13.1 2 12 2M6 8V10C6 11.1 6.9 12 8 12H9V18H7V20H17V18H15V12H16C17.1 12 18 11.1 18 10V8H6M12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7Z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Government e-Marketplace</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-blue-200">SIH 2024 AI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-gem-900 tracking-tight">Bid Compliance Copilot</span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Gov APIs
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tenders (e.g. GEM/2026/B123), bidders, GSTIN, PAN, Udyam..."
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-10 pr-24 py-2 rounded-lg border border-slate-200 focus:border-gem-600 focus:ring-1 focus:ring-gem-600 transition outline-none"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <span className="absolute right-2.5 top-2 text-[11px] font-mono text-slate-400 border border-slate-200 rounded px-1.5 bg-white shadow-2xs">
                Ctrl + K
              </span>
            </form>
          </div>

          {/* Right User & Status Badges */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition" title="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>

            {/* Procurement Officer Profile Badge */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-8 h-8 rounded-full bg-gem-800 text-white font-bold flex items-center justify-center text-xs ring-2 ring-blue-100 shadow-xs">
                PO
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-bold text-slate-800">{user?.full_name || "Procurement Officer"}</p>
                <p className="text-[11px] text-slate-500">{user?.organization || "Min. of Petroleum & Natural Gas"}</p>
              </div>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-rose-600 ml-1 p-1 rounded hover:bg-slate-100 transition"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* END: TopHeader */}

      {/* BEGIN: MainContainerLayout */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        {/* BEGIN: LeftSidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between shrink-0 p-4">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Core Workflow</p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition ${
                        active
                          ? "bg-gem-700 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${
                          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.pulse && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Government Connectors Live Status Box */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Government Connectors</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Udyam MSME
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 font-semibold">ONLINE</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>GSTN Network
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 font-semibold">ONLINE</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Income Tax e-Filing
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 font-semibold">ONLINE</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>CPPP Debarment
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 font-semibold">SYNCED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Bottom Profile / Settings */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="px-3 py-1">
              <div className="text-xs font-semibold text-slate-800 truncate">{user?.full_name}</div>
              <div className="text-[11px] text-slate-500 truncate">{user?.designation}</div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        </aside>
        {/* END: LeftSidebar */}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>

      {/* BEGIN: SiteFooter */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Bid Compliance Copilot</span>
            <span>•</span>
            <span>Smart India Hackathon 2024</span>
            <span>•</span>
            <span>Government e-Marketplace (GeM)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            In compliance with General Financial Rules (GFR 2017) &amp; Public Procurement Policy
          </div>
        </div>
      </footer>
      {/* END: SiteFooter */}
    </div>
  );
}
