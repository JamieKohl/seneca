"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Threat Data", href: "#threats" },
  { label: "Coverage Plans", href: "#pricing" },
  { label: "Case Studies", href: "#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <>
      {/* Threat level strip */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-red-950/90 border-b border-red-900/50 transition-all duration-300 overflow-hidden",
          scrolled ? "h-0 opacity-0" : "h-8 opacity-100"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 live-indicator" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-data">
              LIVE
            </span>
            <span className="hidden sm:inline text-[10px] text-red-400/70 font-data">
              {currentDate}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-data">
            CONSUMER THREAT LEVEL: ELEVATED
          </span>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "top-0 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800/50"
            : "top-8 bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-7 w-7 text-blue-600" />
              <span className="text-lg font-bold text-white tracking-tight">
                KOHLCORP <span className="text-blue-500">SHIELD</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Start Monitoring
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-zinc-800/50 py-4 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-zinc-800/50 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-zinc-700 px-4 py-2.5 text-center text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg bg-red-700 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-red-600 transition-colors"
                >
                  Start Monitoring
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
