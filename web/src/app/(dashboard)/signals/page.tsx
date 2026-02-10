"use client";

import { useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Signal,
} from "lucide-react";
import { cn, getSignalColor, formatPercent, timeAgo } from "@/lib/utils";
import { useSignals } from "@/hooks/useSignals";
import { useStore } from "@/lib/store";

const signalIcons = {
  BUY: ArrowUpCircle,
  SELL: ArrowDownCircle,
  HOLD: MinusCircle,
};

const riskColors = {
  LOW: "text-green-500 bg-green-500/10",
  MEDIUM: "text-yellow-500 bg-yellow-500/10",
  HIGH: "text-red-500 bg-red-500/10",
};

export default function SignalsPage() {
  const [filter, setFilter] = useState<"ALL" | "BUY" | "SELL" | "HOLD">("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { signals, isLoading, error } = useSignals();
  const { watchlist } = useStore();

  const signalsList = signals ?? [];

  const filtered =
    filter === "ALL"
      ? signalsList
      : signalsList.filter((s) => s.signalType === filter);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Generate signals for all watchlist symbols
      for (const symbol of watchlist) {
        await fetch("/api/signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol }),
        });
      }
      // Trigger SWR revalidation by reloading
      window.location.reload();
    } catch {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Signals</h1>
          <p className="text-sm text-zinc-400">
            AI tells you when to open your broker and act — buy, sell, or hold
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Generate Signals
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["ALL", "BUY", "SELL", "HOLD"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === f
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center text-zinc-500">
          Failed to load signals. Check your connection.
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Signal className="h-12 w-12 mb-3 text-zinc-700" />
          <p className="text-sm font-medium">No signals yet</p>
          <p className="text-xs mt-1">Click "Generate Signals" to create AI-powered recommendations</p>
        </div>
      ) : (
        /* Signals Grid */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((signal) => {
            const Icon = signalIcons[signal.signalType as keyof typeof signalIcons] ?? MinusCircle;
            return (
              <div
                key={signal.id}
                className={cn(
                  "rounded-xl border bg-zinc-900/50 p-5 transition-all hover:bg-zinc-900",
                  signal.signalType === "BUY"
                    ? "border-green-500/20"
                    : signal.signalType === "SELL"
                    ? "border-red-500/20"
                    : "border-yellow-500/20"
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-2", getSignalColor(signal.signalType))}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {signal.symbol}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "inline-block rounded-full px-3 py-1 text-sm font-bold",
                        getSignalColor(signal.signalType)
                      )}
                    >
                      {signal.signalType}
                    </span>
                    <p className="mt-1 text-xs text-zinc-500">
                      {(signal.confidence * 100).toFixed(0)}% confidence
                    </p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="h-1.5 w-full rounded-full bg-zinc-800">
                    <div
                      className={cn(
                        "h-1.5 rounded-full",
                        signal.signalType === "BUY"
                          ? "bg-green-500"
                          : signal.signalType === "SELL"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      )}
                      style={{ width: `${signal.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Reasoning */}
                <p className="mb-4 text-sm text-zinc-300 leading-relaxed">
                  {signal.reasoning}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                  <span className="text-xs text-zinc-500">
                    {timeAgo(signal.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
