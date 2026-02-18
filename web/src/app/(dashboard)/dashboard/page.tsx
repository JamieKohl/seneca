"use client";

import useSWR from "swr";
import {
  Shield,
  ShieldAlert,
  CreditCard,
  UserX,
  Search,
  Bell,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { useStore } from "@/lib/store";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const quickActions = [
  {
    label: "Submit Threat Report",
    description: "Analyze suspicious message",
    href: "/scams",
    icon: ShieldAlert,
    color: "text-red-400 bg-red-500/10",
  },
  {
    label: "Financial Audit",
    description: "Review spending drains",
    href: "/subscriptions",
    icon: CreditCard,
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    label: "Data Exposure Check",
    description: "Scan broker registries",
    href: "/privacy",
    icon: UserX,
    color: "text-purple-400 bg-purple-500/10",
  },
  {
    label: "Price Intelligence",
    description: "Detect manipulation",
    href: "/price-watch",
    icon: Search,
    color: "text-blue-400 bg-blue-500/10",
  },
];

interface DashboardStats {
  protectionScore: number;
  scamsBlocked: number;
  moneySaved: number;
  brokersOptedOut: number;
  activeSubscriptions: number;
  monthlySpend: number;
}

const defaultStats: DashboardStats = {
  protectionScore: 0,
  scamsBlocked: 0,
  moneySaved: 0,
  brokersOptedOut: 0,
  activeSubscriptions: 0,
  monthlySpend: 0,
};

export default function DashboardPage() {
  const { notifications } = useStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const { data, isLoading } = useSWR<DashboardStats>(
    "/api/dashboard/stats",
    fetcher,
    { dedupingInterval: 10000 }
  );
  const stats = data ?? defaultStats;
  const { protectionScore, scamsBlocked, moneySaved, brokersOptedOut, activeSubscriptions, monthlySpend } = stats;

  return (
    <div className="space-y-6">
      {/* Situation Report Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-red-600/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-red-600/5 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">SITUATION REPORT</span>
              <span className="h-2 w-2 rounded-full bg-red-500 live-indicator" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Threat Overview
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Automated threat monitoring active across all defense layers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <div className="text-right">
              {isLoading ? (
                <div className="h-8 w-10 animate-pulse rounded bg-zinc-800" />
              ) : (
                <p className="text-2xl font-bold text-blue-600 font-data">{protectionScore}</p>
              )}
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em]">Readiness Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-blue-500 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-zinc-500 truncate">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
              <div className="h-8 w-16 animate-pulse rounded bg-zinc-800" />
              <div className="h-3 w-32 animate-pulse rounded bg-zinc-800" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Threats Intercepted"
              value={`${scamsBlocked}`}
              description="Threats caught this month"
              icon={ShieldAlert}
              iconColor="text-red-500 bg-red-500/10"
            />
            <StatCard
              title="Financial Impact Prevented"
              value={`$${moneySaved.toFixed(2)}`}
              description="From neutralized threats"
              icon={DollarSign}
              iconColor="text-blue-600 bg-blue-600/10"
            />
            <StatCard
              title="Brokers Opted Out"
              value={`${brokersOptedOut}`}
              description="Data brokers removed"
              icon={UserX}
              iconColor="text-purple-500 bg-purple-500/10"
            />
            <StatCard
              title="Active Subscriptions"
              value={`${activeSubscriptions}`}
              description={`$${monthlySpend.toFixed(2)}/month total`}
              icon={CreditCard}
              iconColor="text-amber-500 bg-amber-500/10"
            />
          </>
        )}
      </div>

      {/* Protection Score Breakdown */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">DEFENSE LAYER STATUS</h3>
          </div>
          {isLoading ? (
            <div className="h-5 w-12 animate-pulse rounded bg-zinc-800" />
          ) : (
            <span className="text-sm font-bold text-blue-500">{protectionScore}/100</span>
          )}
        </div>
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 animate-pulse rounded bg-zinc-800" />
                  <div className="h-3 w-8 animate-pulse rounded bg-zinc-800" />
                </div>
                <div className="h-2 rounded-full bg-zinc-800" />
              </div>
            ))
          ) : (
            [
              { label: "Fraud Detection", score: 90, color: "bg-red-500", status: "OPERATIONAL" },
              { label: "Financial Monitoring", score: 75, color: "bg-amber-500", status: "OPERATIONAL" },
              { label: "Data Surveillance", score: 60, color: "bg-purple-500", status: "OPERATIONAL" },
              { label: "Price Intelligence", score: 85, color: "bg-blue-500", status: "OPERATIONAL" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-400">{item.label}</span>
                  <span className="text-[10px] font-bold text-green-400 font-data">{item.status}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">LATEST INCIDENTS</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-xs font-medium text-blue-500">
                {unreadCount} new
              </span>
            )}
          </div>
          <Link
            href="/alerts"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-blue-500 transition-colors"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {notifications.slice(0, 5).map((alert) => {
            const typeConfig: Record<string, { icon: typeof ShieldAlert; color: string; bg: string }> = {
              scam: { icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10" },
              subscription: { icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10" },
              privacy: { icon: UserX, color: "text-purple-400", bg: "bg-purple-500/10" },
              price: { icon: Search, color: "text-blue-400", bg: "bg-blue-500/10" },
              system: { icon: Shield, color: "text-blue-500", bg: "bg-blue-600/10" },
            };
            const config = typeConfig[alert.type] ?? typeConfig.system;
            const Icon = config.icon;

            return (
              <Link
                key={alert.id}
                href={alert.actionUrl ?? "/alerts"}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 transition-all hover:bg-zinc-800/50",
                  alert.read ? "border-zinc-800/50" : "border-zinc-700 bg-zinc-800/30"
                )}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-medium", alert.read ? "text-zinc-400" : "text-white")}>
                    {alert.title}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{alert.body}</p>
                </div>
                {!alert.read && (
                  <div className="h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
