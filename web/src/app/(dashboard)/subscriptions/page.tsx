"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Pause,
  Play,
  X,
  Flag,
  DollarSign,
  Loader2,
  Calendar,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly" | "weekly";
type Category = "entertainment" | "productivity" | "fitness" | "news" | "other";
type SubscriptionStatus = "active" | "paused" | "cancelled" | "flagged";

interface TrackedSubscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: BillingCycle;
  category: Category;
  renewalDate: string;
  cancellationUrl?: string;
  status: SubscriptionStatus;
}

const CATEGORY_COLORS: Record<Category, string> = {
  entertainment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  productivity: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  fitness: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  news: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  other: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  active: "bg-blue-600/10 text-blue-500",
  paused: "bg-amber-500/10 text-amber-400",
  cancelled: "bg-red-500/10 text-red-400",
  flagged: "bg-orange-500/10 text-orange-400",
};

function getMonthlyCost(cost: number, billingCycle: BillingCycle): number {
  switch (billingCycle) {
    case "yearly":
      return cost / 12;
    case "weekly":
      return cost * (52 / 12);
    case "monthly":
    default:
      return cost;
  }
}

export default function SubscriptionHunterPage() {
  const [subscriptions, setSubscriptions] = useState<TrackedSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    cost: "",
    billingCycle: "monthly" as BillingCycle,
    category: "other" as Category,
    renewalDate: "",
    cancellationUrl: "",
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch {
      // silently handle fetch errors
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          cost: parseFloat(form.cost),
          billingCycle: form.billingCycle,
          category: form.category,
          renewalDate: form.renewalDate,
          cancellationUrl: form.cancellationUrl || undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setSubscriptions((prev) => [...prev, created]);
        setForm({
          name: "",
          cost: "",
          billingCycle: "monthly",
          category: "other",
          renewalDate: "",
          cancellationUrl: "",
        });
        setShowForm(false);
      }
    } catch {
      // silently handle errors
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: SubscriptionStatus) => {
    try {
      const res = await fetch("/api/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setSubscriptions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status } : sub))
        );
      }
    } catch {
      // silently handle errors
    }
  };

  // Computed stats
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  );
  const flaggedSubscriptions = subscriptions.filter(
    (s) => s.status === "flagged"
  );
  const pausedSubscriptions = subscriptions.filter(
    (s) => s.status === "paused"
  );

  const totalMonthlySpend = activeSubscriptions.reduce(
    (sum, s) => sum + getMonthlyCost(s.cost, s.billingCycle),
    0
  );

  const potentialSavings = [...flaggedSubscriptions, ...pausedSubscriptions].reduce(
    (sum, s) => sum + getMonthlyCost(s.cost, s.billingCycle),
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-blue-600/20 bg-gradient-to-r from-blue-600/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <DollarSign className="h-24 w-24 text-blue-600" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
              <CreditCard className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wider">
                FINANCIAL DRAIN MONITOR
              </h1>
              <p className="text-sm text-zinc-400">
                Monthly spend:{" "}
                <span className="font-semibold text-blue-500">
                  {formatCurrency(totalMonthlySpend)}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              showForm
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "bg-blue-700 text-white hover:bg-blue-600"
            )}
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add Subscription
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-medium text-zinc-400">
              Monthly Spend
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(totalMonthlySpend)}
          </p>
          <p className="text-xs text-zinc-600">Across active subscriptions</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-medium text-zinc-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {activeSubscriptions.length}
          </p>
          <p className="text-xs text-zinc-600">Currently billing</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-medium text-zinc-400">Flagged</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {flaggedSubscriptions.length}
          </p>
          <p className="text-xs text-zinc-600">Needs review</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Pause className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-zinc-400">
              Potential Savings
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(potentialSavings)}
          </p>
          <p className="text-xs text-zinc-600">From flagged & paused</p>
        </div>
      </div>

      {/* Add Subscription Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl border border-blue-600/20 bg-blue-600/5 p-5 animate-in slide-in-from-top-2 duration-200"
        >
          <h3 className="text-sm font-semibold text-white mb-4">
            Add Subscription
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Netflix, Spotify"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Cost
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                placeholder="9.99"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Billing Cycle
              </label>
              <select
                value={form.billingCycle}
                onChange={(e) =>
                  setForm({
                    ...form,
                    billingCycle: e.target.value as BillingCycle,
                  })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Category })
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none"
              >
                <option value="entertainment">Entertainment</option>
                <option value="productivity">Productivity</option>
                <option value="fitness">Fitness</option>
                <option value="news">News</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Renewal Date
              </label>
              <input
                type="date"
                value={form.renewalDate}
                onChange={(e) =>
                  setForm({ ...form, renewalDate: e.target.value })
                }
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Cancellation URL{" "}
                <span className="text-zinc-600">(optional)</span>
              </label>
              <input
                type="text"
                value={form.cancellationUrl}
                onChange={(e) =>
                  setForm({ ...form, cancellationUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!form.name || !form.cost || !form.renewalDate || isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-40 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Subscription
            </button>
          </div>
        </form>
      )}

      {/* Subscriptions List */}
      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 py-16">
          <CreditCard className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-sm font-medium text-zinc-400">
            No subscriptions tracked yet
          </p>
          <p className="text-xs text-zinc-600 mt-1 mb-4">
            Add your subscriptions to start hunting for savings
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Subscription
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className={cn(
                "group rounded-xl border bg-zinc-900/50 p-5 transition-colors hover:bg-zinc-900/80",
                sub.status === "cancelled"
                  ? "border-zinc-800/50 opacity-60"
                  : sub.status === "flagged"
                  ? "border-orange-500/20"
                  : sub.status === "paused"
                  ? "border-amber-500/20"
                  : "border-zinc-800"
              )}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{sub.name}</h3>
                  <p className="text-lg font-semibold text-blue-500 mt-0.5">
                    {formatCurrency(getMonthlyCost(sub.cost, sub.billingCycle))}
                    <span className="text-xs font-normal text-zinc-500">
                      /mo
                    </span>
                  </p>
                  {sub.billingCycle !== "monthly" && (
                    <p className="text-[10px] text-zinc-600">
                      {formatCurrency(sub.cost)} billed {sub.billingCycle}
                    </p>
                  )}
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                    STATUS_COLORS[sub.status]
                  )}
                >
                  {sub.status === "active" && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600 mr-1 animate-pulse" />
                  )}
                  {sub.status}
                </span>
              </div>

              {/* Category & Renewal */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize",
                    CATEGORY_COLORS[sub.category]
                  )}
                >
                  {sub.category}
                </span>
                <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {new Date(sub.renewalDate).toLocaleDateString()}
                </span>
              </div>

              {/* Cancellation Link */}
              {sub.cancellationUrl && sub.status !== "cancelled" && (
                <a
                  href={sub.cancellationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 block text-[10px] text-zinc-500 hover:text-blue-500 truncate transition-colors"
                >
                  Cancel link: {sub.cancellationUrl}
                </a>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-zinc-800 pt-3">
                {sub.status === "active" || sub.status === "flagged" ? (
                  <button
                    onClick={() => updateStatus(sub.id, "paused")}
                    className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    <Pause className="h-3 w-3" />
                    Pause
                  </button>
                ) : sub.status === "paused" ? (
                  <button
                    onClick={() => updateStatus(sub.id, "active")}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600/10 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-600/20 transition-colors"
                  >
                    <Play className="h-3 w-3" />
                    Resume
                  </button>
                ) : null}

                {sub.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(sub.id, "cancelled")}
                    className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </button>
                )}

                {sub.status === "active" && (
                  <button
                    onClick={() => updateStatus(sub.id, "flagged")}
                    className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-orange-500/10 hover:text-orange-400 transition-colors"
                  >
                    <Flag className="h-3 w-3" />
                    Flag
                  </button>
                )}

                {sub.status === "cancelled" && (
                  <button
                    onClick={() => updateStatus(sub.id, "active")}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600/10 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-600/20 transition-colors"
                  >
                    <Play className="h-3 w-3" />
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
