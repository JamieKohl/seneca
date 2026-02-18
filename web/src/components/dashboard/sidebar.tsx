"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  CreditCard,
  UserX,
  Search,
  Bell,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Home,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Threat Overview", icon: LayoutDashboard },
  { href: "/scams", label: "Fraud Detection", icon: ShieldAlert },
  { href: "/subscriptions", label: "Financial Monitor", icon: CreditCard },
  { href: "/privacy", label: "Data Surveillance", icon: UserX },
  { href: "/price-watch", label: "Price Intel", icon: Search },
  { href: "/alerts", label: "Incident Log", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-zinc-800 bg-zinc-950 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16",
          !sidebarOpen && "max-lg:-translate-x-full max-lg:w-64"
        )}
      >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-zinc-800 px-4">
          <Shield className="h-8 w-8 shrink-0 text-blue-600" />
          {sidebarOpen && (
            <div className="ml-3">
              <span className="text-lg font-bold text-white tracking-tight block leading-tight">
                KOHLCORP <span className="text-blue-500">SHIELD</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">
                INTELLIGENCE CENTER
              </span>
            </div>
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
                    ? "border-l-2 border-blue-600 bg-blue-600/5 text-blue-500 ml-0 pl-2.5"
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
              className="flex items-center gap-3 rounded-xl border border-blue-600/20 bg-blue-600/5 p-3 transition-all hover:bg-blue-600/10"
            >
              <div className="rounded-lg bg-blue-600/10 p-2">
                <Crown className="h-4 w-4 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">Expand Coverage</p>
                <p className="text-[10px] text-zinc-500">Full protection for $9.99/mo</p>
              </div>
            </Link>
          </div>
        )}
        {!sidebarOpen && (
          <div className="mx-3 mb-3">
            <Link
              href="/checkout"
              title="Expand Coverage"
              className="flex items-center justify-center rounded-lg bg-blue-600/10 p-2.5 text-blue-500 hover:bg-blue-600/20 transition-colors"
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
    </>
  );
}
