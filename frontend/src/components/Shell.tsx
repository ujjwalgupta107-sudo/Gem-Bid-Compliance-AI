"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Logo, LogoIcon } from "@/components/ui/Logo";
import { CommandPalette } from "@/components/ui/CommandPalette";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Ctrl+K handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navCategories = [
    {
      title: "Overview",
      items: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
      ]
    },
    {
      title: "Bid Management",
      items: [
        {
          href: "/tenders",
          label: "Tenders",
          badge: "Active",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          href: "/tenders/new",
          label: "New Bid Verification",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          ),
        },
        {
          href: "/bids/saved",
          label: "Saved Bids",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          ),
        }
      ]
    },
    {
      title: "Compliance",
      items: [
        {
          href: "/verification-center",
          label: "Verifications",
          pulse: true,
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          href: "/reports",
          label: "Compliance Reports",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          href: "/risk",
          label: "Risk Analysis",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ),
        }
      ]
    },
    {
      title: "Intelligence",
      items: [
        {
          href: "/ai-insights",
          label: "AI Insights",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ),
        },
        {
          href: "/audit-trail",
          label: "Audit Trail",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        }
      ]
    },
    {
      title: "Administration",
      items: [
        {
          href: "/government-connectors",
          label: "Government Connectors",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          href: "/settings",
          label: "Settings",
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        }
      ]
    }
  ];

  // Derive breadcrumb from pathname
  const breadcrumbLabel = (() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const last = segments[segments.length - 1];
    return last.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  })();

  return (
    <div className="bg-[#0F172A] text-white antialiased min-h-screen flex flex-col font-sans selection:bg-[#00F5FF] selection:text-black">
      {/* Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* TopHeader */}
      <header className="bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 h-16 flex items-center shrink-0">
        <div className="w-full flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center text-sm font-medium text-slate-300 gap-2">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              {pathname !== "/dashboard" && (
                <>
                  <span className="text-white/20">/</span>
                  <span className="text-white font-semibold">{breadcrumbLabel}</span>
                </>
              )}
            </div>
          </div>

          {/* Search Trigger */}
          <div className="flex-1 max-w-xl hidden md:block">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 text-sm text-slate-300 pl-10 pr-24 py-2 rounded-xl border border-white/10 transition outline-none relative text-left focus:border-[#00F5FF]/50"
            >
              <svg className="w-4 h-4 absolute left-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search tenders, bidders, GSTIN, PAN, Udyam…
              <span className="absolute right-2.5 text-[11px] font-mono text-slate-300 border border-white/10 rounded px-1.5 py-0.5 bg-white/5">
                Ctrl + K
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <button className="relative p-2 text-slate-300 hover:text-[#00F5FF] hover:bg-white/5 rounded-lg transition-colors" aria-label="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0F172A]"></span>
            </button>
            <button className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors hidden sm:block" aria-label="Help">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
            
            <div className="flex items-center gap-2 cursor-pointer group rounded-lg hover:bg-white/5 p-1 pr-2 transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#0070F3]/20 border border-[#0070F3]/50 text-[#00F5FF] font-bold flex items-center justify-center text-xs shadow-xs group-hover:shadow-[0_0_10px_rgba(0,112,243,0.5)] transition-shadow">
                {user?.full_name?.charAt(0) || "P"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-white group-hover:text-[#00F5FF] transition-colors">{user?.full_name || "Procurement Officer"}</p>
                <p className="text-[10px] text-slate-300">{user?.organization || "CPCL"}</p>
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-[#00F5FF] hidden lg:block transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LeftSidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-[72px]' : 'w-72'} bg-[#0B1120] border-r border-white/10 flex flex-col shrink-0 transition-all duration-300 z-30 absolute lg:relative lg:translate-x-0 h-[calc(100vh-4rem)] ${isSidebarOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : "-translate-x-full"}`}>
          {/* Logo */}
          <div className="p-4 border-b border-white/5">
            {isSidebarCollapsed ? (
              <Link href="/dashboard" className="flex justify-center">
                <LogoIcon size="md" />
              </Link>
            ) : (
              <Link href="/dashboard">
                <Logo size="md" />
              </Link>
            )}
          </div>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-[#0F172A] border border-white/20 rounded-full items-center justify-center text-slate-300 hover:text-[#00F5FF] hover:border-[#00F5FF]/50 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-40 transition-colors"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className={`w-3 h-3 transition-transform ${isSidebarCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
            {navCategories.map((category, idx) => (
              <div key={idx}>
                {!isSidebarCollapsed && (
                  <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider px-3 mb-2">{category.title}</p>
                )}
                <nav className="space-y-0.5">
                  {category.items.map((item) => {
                    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`group flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all relative overflow-hidden ${
                          active
                            ? "bg-[#00F5FF]/10 text-white shadow-[inset_0_0_10px_rgba(0,245,255,0.05)] border border-[#00F5FF]/20"
                            : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                        }`}
                      >
                        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00F5FF] rounded-r-full shadow-[0_0_10px_rgba(0,245,255,0.8)]"></div>}
                        <span className={`${active ? "text-[#00F5FF]" : "text-slate-400 group-hover:text-[#00F5FF]"} transition-colors`}>{item.icon}</span>
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                        {!isSidebarCollapsed && "badge" in item && item.badge && (
                          <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            active ? "bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30" : "bg-white/5 text-slate-300"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {!isSidebarCollapsed && "pulse" in item && item.pulse && (
                          <span className="ml-auto flex items-center">
                            <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className={`p-4 border-t border-white/5 bg-[#0B1120] mt-auto ${isSidebarCollapsed ? 'px-2' : ''}`}>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </span>
                <span className="text-xs font-semibold text-slate-300">Systems Operational</span>
              </div>
            )}
            <button
              onClick={logout}
              title={isSidebarCollapsed ? "Sign Out" : undefined}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!isSidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8 relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-30 mix-blend-screen" />
          
          <div className="max-w-[1400px] mx-auto animate-fade-in relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
