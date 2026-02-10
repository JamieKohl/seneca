"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Signal,
  Brain,
  Newspaper,
  Settings,
  Compass,
  ChevronLeft,
  ChevronRight,
  Bell,
  TrendingUp,
  Home,
  Eye,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "My Positions", icon: Briefcase },
  { href: "/watchlist", label: "Watchlist", icon: Eye },
  { href: "/signals", label: "AI Signals", icon: Signal },
  { href: "/alerts", label: "Alert History", icon: Bell },
  { href: "/performance", label: "Performance", icon: TrendingUp },
  { href: "/predictions", label: "AI Predictions", icon: Brain },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-zinc-800 bg-zinc-950 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-zinc-800 px-4">
          <Compass className="h-8 w-8 shrink-0 text-emerald-500" />
          {sidebarOpen && (
            <span className="ml-3 text-lg font-bold text-white">
              KohlCorp
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        {sidebarOpen && (
          <div className="mx-3 mb-3">
            <Link
              href="/checkout"
              className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 transition-all hover:bg-emerald-500/10"
            >
              <div className="rounded-lg bg-emerald-500/10 p-2">
                <Crown className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">Upgrade to Pro</p>
                <p className="text-[10px] text-zinc-500">Unlimited alerts & more</p>
              </div>
            </Link>
          </div>
        )}
        {!sidebarOpen && (
          <div className="mx-3 mb-3">
            <Link
              href="/checkout"
              title="Upgrade to Pro"
              className="flex items-center justify-center rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Crown className="h-5 w-5" />
            </Link>
          </div>
        )}

        {/* Bottom */}
        <div className="border-t border-zinc-800 p-3">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-3">Collapse</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
