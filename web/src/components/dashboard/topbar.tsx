"use client";

import { Search, Bell, User, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { sidebarOpen, setSelectedSymbol } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedSymbol(searchQuery.trim().toUpperCase());
      setSearchQuery("");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-30 h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg transition-all duration-300",
        sidebarOpen ? "left-64" : "left-16",
        "right-0"
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search stocks (e.g. AAPL, TSLA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </form>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Market status pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400">Market Open</span>
          </div>

          {/* Quick generate */}
          <Link
            href="/signals"
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
          >
            <Zap className="h-3.5 w-3.5" />
            Generate Signals
          </Link>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
          </button>

          {/* User */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors">
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
