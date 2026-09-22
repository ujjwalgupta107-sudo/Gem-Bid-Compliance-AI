"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: "tender" | "bidder" | "page";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const quickLinks: SearchResult[] = [
  { type: "page", id: "dash", title: "Dashboard", subtitle: "Overview & KPIs", href: "/dashboard" },
  { type: "page", id: "tenders", title: "Tenders", subtitle: "All active tenders", href: "/tenders" },
  { type: "page", id: "new", title: "New Bid Verification", subtitle: "Upload & verify", href: "/tenders/new" },
  { type: "page", id: "reports", title: "Compliance Reports", subtitle: "Generate reports", href: "/reports" },
  { type: "page", id: "risk", title: "Risk Analysis", subtitle: "Risk distribution", href: "/risk" },
  { type: "page", id: "ai", title: "AI Insights", subtitle: "RAG findings", href: "/ai-insights" },
  { type: "page", id: "audit", title: "Audit Trail", subtitle: "Immutable event log", href: "/audit-trail" },
  { type: "page", id: "connectors", title: "Government Connectors", subtitle: "Registry health", href: "/government-connectors" },
  { type: "page", id: "settings", title: "Settings", subtitle: "System configuration", href: "/settings" },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? quickLinks.filter(
        (l) =>
          l.title.toLowerCase().includes(query.toLowerCase()) ||
          l.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : quickLinks;

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tenders, bidders, GSTIN, PAN, Udyam…"
            className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-0.5">
              {results.map((result, idx) => (
                <button
                  key={result.id}
                  onClick={() => navigate(result.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    idx === selectedIndex
                      ? "bg-gem-50 text-gem-800"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    idx === selectedIndex ? "bg-gem-100 text-gem-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {result.type === "page" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{result.title}</p>
                    <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                  </div>
                  {idx === selectedIndex && (
                    <kbd className="hidden sm:inline-flex text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">
                      ↵
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">↵</kbd> Open</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
