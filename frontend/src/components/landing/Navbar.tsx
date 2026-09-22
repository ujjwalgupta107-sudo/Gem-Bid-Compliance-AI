"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Original Logo branding */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo size="md" variant="light" />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-slate-300">
          <a href="#hero" className="hover:text-white transition-colors">
            Network
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            3D Journey
          </a>
          <a href="#document-ocr" className="hover:text-white transition-colors">
            Document Intelligence
          </a>
          <a href="#registries" className="hover:text-white transition-colors">
            Registries
          </a>
          <a href="#security" className="hover:text-white transition-colors">
            Security
          </a>
          <a href="#complexity" className="hover:text-white transition-colors">
            Architecture
          </a>
        </nav>

        {/* Right CTA Links */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/tenders"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            Launch Workspace
          </Link>
        </div>
      </div>
    </header>
  );
}
