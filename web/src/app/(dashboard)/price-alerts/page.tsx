"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Check,
  Clock,
  Trash2,
  AlertTriangle,
  Target,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: "above" | "below";
  status: "active" | "triggered" | "expired";
  createdAt: string;
  triggeredAt?: string;
  note?: string;
}

const SAMPLE_ALERTS: PriceAlert[] = [
  {
    id: "pa1",
    symbol: "TSLA",
    targetPrice: 260.0,
    condition: "above",
    status: "active",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    note: "Breakout level",
  },
  {
    id: "pa2",
    symbol: "AAPL",
    targetPrice: 180.0,
    condition: "below",
    status: "active",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    note: "Buy the dip",
  },
  {
    id: "pa3",
    symbol: "NVDA",
    targetPrice: 900.0,
    condition: "above",
    status: "active",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "pa4",
    symbol: "GOOGL",
    targetPrice: 160.0,
    condition: "above",
    status: "triggered",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    triggeredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    note: "Earnings play",
  },
  {
    id: "pa5",
    symbol: "AMZN",
    targetPrice: 175.0,
    condition: "below",
    status: "triggered",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    triggeredAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "pa6",
    symbol: "META",
    targetPrice: 550.0,
    condition: "above",
    status: "expired",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    note: "Expired after 30 days",
  },
];

type FilterTab = "all" | "active" | "triggered" | "expired";

export default function PriceAlertsPage() {
  const { watchlist } = useStore();
  const [alerts, setAlerts] = useState<PriceAlert[]>(SAMPLE_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [form, setForm] = useState({
    symbol: "",
    targetPrice: "",
    condition: "above" as "above" | "below",
    note: "",
  });

  const filtered =
    filter === "all" ? alerts : alerts.filter((a) => a.status === filter);

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const triggeredCount = alerts.filter((a) => a.status === "triggered").length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol: form.symbol.toUpperCase(),
      targetPrice: parseFloat(form.targetPrice),
      condition: form.condition,
      status: "active",
      createdAt: new Date().toISOString(),
      note: form.note || undefined,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setForm({ symbol: "", targetPrice: "", condition: "above", note: "" });
    setShowForm(false);
    toast.success(
      `Alert set: ${newAlert.symbol} ${newAlert.condition} ${formatCurrency(newAlert.targetPrice)}`
    );
  };

  const handleDelete = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.info("Alert removed");
  };

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: alerts.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "triggered", label: "Triggered", count: triggeredCount },
    {
      key: "expired",
      label: "Expired",
      count: alerts.filter((a) => a.status === "expired").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <Target className="h-24 w-24 text-orange-500" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Bell className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Price Alerts</h1>
              <p className="text-sm text-zinc-400">
                {activeCount} active alerts monitoring your target prices
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              showForm
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            )}
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> New Alert
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-zinc-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeCount}</p>
          <p className="text-xs text-zinc-600">Monitoring prices 24/7</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Check className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs font-medium text-zinc-400">Triggered</span>
          </div>
          <p className="text-2xl font-bold text-white">{triggeredCount}</p>
          <p className="text-xs text-zinc-600">Price targets hit</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-zinc-400">Hit Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {alerts.length > 0
              ? `${Math.round((triggeredCount / alerts.length) * 100)}%`
              : "—"}
          </p>
          <p className="text-xs text-zinc-600">Alerts that triggered</p>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 animate-in slide-in-from-top-2 duration-200"
        >
          <h3 className="text-sm font-semibold text-white mb-4">
            Create Price Alert
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Symbol
              </label>
              <select
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Select stock</option>
                {watchlist.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Condition
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, condition: "above" })}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                    form.condition === "above"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400"
                  )}
                >
                  <TrendingUp className="h-3.5 w-3.5 inline mr-1" />
                  Above
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, condition: "below" })}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                    form.condition === "below"
                      ? "border-red-500 bg-red-500/10 text-red-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400"
                  )}
                >
                  <TrendingDown className="h-3.5 w-3.5 inline mr-1" />
                  Below
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Target Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.targetPrice}
                onChange={(e) =>
                  setForm({ ...form, targetPrice: e.target.value })
                }
                placeholder="250.00"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Note (optional)
              </label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="e.g., Breakout level"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={!form.symbol || !form.targetPrice}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors"
              >
                Create Alert
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg bg-zinc-900 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              filter === tab.key
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px]",
                filter === tab.key ? "bg-zinc-700" : "bg-zinc-800/50"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 py-16">
          <Bell className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-sm font-medium text-zinc-400">
            No {filter === "all" ? "" : filter} alerts
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            Create a price alert to get notified when a stock hits your target
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "group flex items-center justify-between rounded-xl border bg-zinc-900/50 px-5 py-4 transition-colors hover:bg-zinc-900/80",
                alert.status === "active"
                  ? "border-zinc-800"
                  : alert.status === "triggered"
                  ? "border-emerald-500/20"
                  : "border-zinc-800/50 opacity-60"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    alert.condition === "above"
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10"
                  )}
                >
                  {alert.condition === "above" ? (
                    <TrendingUp
                      className={cn(
                        "h-5 w-5",
                        alert.status === "triggered"
                          ? "text-emerald-400"
                          : "text-emerald-500/60"
                      )}
                    />
                  ) : (
                    <TrendingDown
                      className={cn(
                        "h-5 w-5",
                        alert.status === "triggered"
                          ? "text-red-400"
                          : "text-red-500/60"
                      )}
                    />
                  )}
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {alert.symbol}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {alert.condition === "above" ? "goes above" : "drops below"}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        alert.condition === "above"
                          ? "text-emerald-400"
                          : "text-red-400"
                      )}
                    >
                      {formatCurrency(alert.targetPrice)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {alert.note && (
                      <span className="text-xs text-zinc-500">
                        {alert.note}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status badge */}
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                    alert.status === "active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : alert.status === "triggered"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-zinc-800 text-zinc-500"
                  )}
                >
                  {alert.status === "active" && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  )}
                  {alert.status}
                </span>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="rounded-lg p-1.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
