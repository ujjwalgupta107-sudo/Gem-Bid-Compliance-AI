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
    <div className="bg-[#f8fafc] text-slate-800 antialiased min-h-screen flex flex-col font-sans">
      {/* Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* TopHeader */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs h-16 flex items-center shrink-0">
        <div className="w-full flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center text-sm font-medium text-slate-500 gap-2">
              <Link href="/dashboard" className="hover:text-slate-800 transition">Dashboard</Link>
              {pathname !== "/dashboard" && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-800 font-semibold">{breadcrumbLabel}</span>
                </>
              )}
            </div>
          </div>

          {/* Search Trigger */}
          <div className="flex-1 max-w-xl hidden md:block">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="w-full flex items-center gap-3 bg-slate-50 hover:bg-slate-100 text-sm text-slate-400 pl-10 pr-24 py-2 rounded-xl border border-slate-200 transition outline-none shadow-2xs relative text-left"
            >
              <svg className="w-4 h-4 absolute left-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search tenders, bidders, GSTIN, PAN, Udyam…
              <span className="absolute right-2.5 text-[11px] font-mono text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white shadow-2xs">
                Ctrl + K
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition" aria-label="Notifications">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition hidden sm:block" aria-label="Help">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-2 cursor-pointer group rounded-lg hover:bg-slate-50 p-1 pr-2 transition">
              <div className="w-8 h-8 rounded-full bg-gem-900 text-white font-bold flex items-center justify-center text-xs shadow-xs group-hover:ring-2 ring-blue-100 transition">
                {user?.full_name?.charAt(0) || "P"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800">{user?.full_name || "Procurement Officer"}</p>
                <p className="text-[10px] text-slate-500">{user?.organization || "CPCL"}</p>
              </div>
              <svg className="w-4 h-4 text-slate-400 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LeftSidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-[72px]' : 'w-72'} bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 z-30 absolute lg:relative lg:translate-x-0 h-[calc(100vh-4rem)] ${isSidebarOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : "-translate-x-full"}`}>
          {/* Logo */}
          <div className="p-4 border-b border-slate-100">
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
            className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm z-40 transition"
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
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">{category.title}</p>
                )}
                <nav className="space-y-0.5">
                  {category.items.map((item) => {
                    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`group flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} gap-3 px-3 py-2 text-sm font-medium rounded-lg transition relative overflow-hidden ${
                          active
                            ? "bg-blue-50/80 text-gem-700 shadow-sm"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gem-600 rounded-r-full"></div>}
                        <span className={`${active ? "text-gem-600" : "text-slate-400 group-hover:text-slate-600"} transition-colors`}>{item.icon}</span>
                        {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                        {!isSidebarCollapsed && "badge" in item && item.badge && (
                          <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            active ? "bg-white text-gem-700 shadow-xs" : "bg-slate-100 text-slate-500"
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

          <div className={`p-4 border-t border-slate-100 bg-slate-50 mt-auto ${isSidebarCollapsed ? 'px-2' : ''}`}>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-600">All Systems Operational</span>
              </div>
            )}
            <button
              onClick={logout}
              title={isSidebarCollapsed ? "Sign Out" : undefined}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition shadow-xs"
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
            className="fixed inset-0 bg-slate-900/20 z-20 lg:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
