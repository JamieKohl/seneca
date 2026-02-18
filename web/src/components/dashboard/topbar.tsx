"use client";

import { Bell, ShieldAlert } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "./notification-panel";
import { UserMenu } from "./user-menu";

export function Topbar() {
  const { sidebarOpen, notifications } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notification panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [notifOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 z-30 h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg transition-all duration-300",
        sidebarOpen ? "left-64" : "left-16",
        "right-0"
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Shield status */}
        <div className="flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/5 px-3 py-1.5 text-xs">
          <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-blue-500 font-medium">Shield Active</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Quick analyze */}
          <Link
            href="/scams"
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-blue-600/50 hover:text-blue-500 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Analyze Scam
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={cn(
                "relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors",
                notifOpen && "bg-zinc-800 text-white"
              )}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white ring-2 ring-zinc-950">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            )}
          </div>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
