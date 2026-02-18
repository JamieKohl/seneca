"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  ShieldAlert,
  CreditCard,
  UserX,
  Search,
  Shield,
  Loader2,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertLog } from "@/types";

const typeConfig: Record<string, { icon: typeof ShieldAlert; color: string; bg: string; label: string }> = {
  scam: { icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", label: "Scam" },
  subscription: { icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10", label: "Subscription" },
  privacy: { icon: UserX, color: "text-purple-400", bg: "bg-purple-500/10", label: "Privacy" },
  price: { icon: Search, color: "text-blue-400", bg: "bg-blue-500/10", label: "Price" },
  system: { icon: Shield, color: "text-blue-500", bg: "bg-blue-600/10", label: "System" },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAlerts(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    });
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);
  const unreadCount = alerts.filter((a) => !a.read).length;

  const typeCounts = alerts.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-amber-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/5 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-400" />
              <h1 className="text-2xl font-bold text-white">Alerts</h1>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-xs font-medium text-blue-500">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              All Shield alerts and notifications in one place
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{alerts.length}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Alerts</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Object.entries(typeConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${config.color}`}>
                <Icon className="h-3.5 w-3.5" />
                {config.label}
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{typeCounts[key] || 0}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/30 p-1 w-fit">
        {[
          { key: "all", label: "All" },
          { key: "scam", label: "Scam" },
          { key: "subscription", label: "Subscription" },
          { key: "privacy", label: "Privacy" },
          { key: "price", label: "Price" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              filter === f.key ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 py-16 text-center">
          <Bell className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-lg font-semibold text-white">No alerts yet</p>
          <p className="mt-1 text-sm text-zinc-500">
            Shield will alert you when it detects threats to your money or privacy.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((alert) => {
            const config = typeConfig[alert.type] ?? typeConfig.system;
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 transition-all",
                  alert.read
                    ? "border-zinc-800/50 bg-zinc-900/30"
                    : "border-zinc-700 bg-zinc-900/60"
                )}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-medium", alert.read ? "text-zinc-400" : "text-white")}>
                      {alert.title}
                    </p>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    {alert.actionable && (
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500">{alert.body}</p>
                  <p className="mt-1 text-[10px] text-zinc-600">
                    {new Date(alert.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!alert.read && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="shrink-0 rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-blue-500 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
