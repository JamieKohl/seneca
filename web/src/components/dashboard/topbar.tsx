"use client";

import { Search, Bell, User } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { sidebarOpen } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      className={cn(
        "fixed top-0 z-30 h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm transition-all duration-300",
        sidebarOpen ? "left-64" : "left-16",
        "right-0"
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search stocks (e.g. AAPL, TSLA)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Market status */}
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400">Market Open</span>
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          {/* User */}
          <button className="flex items-center gap-2 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
