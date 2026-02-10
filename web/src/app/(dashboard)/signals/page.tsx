"use client";

import { useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  RefreshCw,
  Zap,
  Signal,
  Clock,
  Target,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from "lucide-react";
import { cn, getSignalColor, timeAgo } from "@/lib/utils";
import { useSignals } from "@/hooks/useSignals";
import { useStore } from "@/lib/store";

const signalIcons = {
  BUY: ArrowUpCircle,
  SELL: ArrowDownCircle,
  HOLD: MinusCircle,
};

const signalActionText = {
  BUY: "Open your broker and buy",
  SELL: "Open your broker and sell",
  HOLD: "Keep your current position",
};

const signalGradients = {
  BUY: "from-green-500/10 via-green-500/5 to-transparent",
  SELL: "from-red-500/10 via-red-500/5 to-transparent",
  HOLD: "from-yellow-500/10 via-yellow-500/5 to-transparent",
};

const filterConfig = {
  ALL: { label: "All Signals", color: "bg-emerald-500", textColor: "text-emerald-400" },
  BUY: { label: "Buy", color: "bg-green-500", textColor: "text-green-400" },
  SELL: { label: "Sell", color: "bg-red-500", textColor: "text-red-400" },
  HOLD: { label: "Hold", color: "bg-yellow-500", textColor: "text-yellow-400" },
} as const;

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

  const buyCount = signalsList.filter((s) => s.signalType === "BUY").length;
  const sellCount = signalsList.filter((s) => s.signalType === "SELL").length;
  const holdCount = signalsList.filter((s) => s.signalType === "HOLD").length;
  const avgConfidence =
    signalsList.length > 0
      ? signalsList.reduce((sum, s) => sum + s.confidence, 0) / signalsList.length
      : 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      for (const symbol of watchlist) {
        await fetch("/api/signals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol }),
        });
      }
      window.location.reload();
    } catch {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-emerald-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-400" />
              <h1 className="text-2xl font-bold text-white">AI Signals</h1>
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              AI tells you when to open your broker and act — buy, sell, or hold
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || watchlist.length === 0}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Generate Signals
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Signal className="h-3.5 w-3.5" />
            Total Signals
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{signalsList.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Target className="h-3.5 w-3.5" />
            Avg Confidence
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {avgConfidence > 0 ? `${(avgConfidence * 100).toFixed(0)}%` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-green-500/70">
            <TrendingUp className="h-3.5 w-3.5" />
            Buy Signals
          </div>
          <p className="mt-2 text-2xl font-bold text-green-400">{buyCount}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-red-500/70">
            <TrendingDown className="h-3.5 w-3.5" />
            Sell Signals
          </div>
          <p className="mt-2 text-2xl font-bold text-red-400">{sellCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/30 p-1">
        {(["ALL", "BUY", "SELL", "HOLD"] as const).map((f) => {
          const config = filterConfig[f];
          const count = f === "ALL" ? signalsList.length : f === "BUY" ? buyCount : f === "SELL" ? sellCount : holdCount;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all flex-1 justify-center",
                filter === f
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {f !== "ALL" && (
                <span className={cn("h-2 w-2 rounded-full", config.color)} />
              )}
              {config.label}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                filter === f ? "bg-zinc-700 text-zinc-300" : "bg-zinc-800/50 text-zinc-600"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
            <p className="text-sm text-zinc-500">Loading signals...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-zinc-500">
          <AlertTriangle className="h-8 w-8 text-red-500/50" />
          <p className="text-sm font-medium">Failed to load signals</p>
          <p className="text-xs text-zinc-600">Check your connection and try again</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50 mb-4">
            <Zap className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="text-sm font-semibold text-zinc-400">No signals yet</p>
          <p className="text-xs mt-1 text-zinc-600 max-w-xs text-center">
            {watchlist.length === 0
              ? "Add stocks to your watchlist first, then generate signals"
              : "Click \"Generate Signals\" to get AI-powered broker alerts"}
          </p>
          {watchlist.length > 0 && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Generate Now
            </button>
          )}
        </div>
      ) : (
        /* Signals Grid */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((signal) => {
            const Icon = signalIcons[signal.signalType as keyof typeof signalIcons] ?? MinusCircle;
            const actionText = signalActionText[signal.signalType as keyof typeof signalActionText] ?? "Review your position";
            const gradient = signalGradients[signal.signalType as keyof typeof signalGradients] ?? signalGradients.HOLD;
            return (
              <div
                key={signal.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-zinc-900/50 transition-all hover:bg-zinc-900/80 hover:shadow-lg",
                  signal.signalType === "BUY"
                    ? "border-green-500/20 hover:border-green-500/40"
                    : signal.signalType === "SELL"
                    ? "border-red-500/20 hover:border-red-500/40"
                    : "border-yellow-500/20 hover:border-yellow-500/40"
                )}
              >
                {/* Gradient overlay */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", gradient)} />

                <div className="relative p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("rounded-xl p-2.5", getSignalColor(signal.signalType))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{signal.symbol}</h3>
                        <p className="text-xs text-zinc-500">
                          <Clock className="mr-1 inline h-3 w-3" />
                          {timeAgo(signal.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider",
                        getSignalColor(signal.signalType)
                      )}
                    >
                      {signal.signalType}
                    </span>
                  </div>

                  {/* Confidence */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-zinc-500">Confidence</span>
                      <span className={cn(
                        "text-sm font-bold",
                        signal.confidence >= 0.8 ? "text-green-400" : signal.confidence >= 0.5 ? "text-yellow-400" : "text-red-400"
                      )}>
                        {(signal.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-800">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all",
                          signal.signalType === "BUY"
                            ? "bg-gradient-to-r from-green-600 to-green-400"
                            : signal.signalType === "SELL"
                            ? "bg-gradient-to-r from-red-600 to-red-400"
                            : "bg-gradient-to-r from-yellow-600 to-yellow-400"
                        )}
                        style={{ width: `${signal.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Reasoning */}
                  <p className="mb-4 text-sm text-zinc-300 leading-relaxed line-clamp-3">
                    {signal.reasoning}
                  </p>

                  {/* Action callout */}
                  <div className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2",
                    signal.signalType === "BUY"
                      ? "border-green-500/20 bg-green-500/5"
                      : signal.signalType === "SELL"
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-yellow-500/20 bg-yellow-500/5"
                  )}>
                    <ExternalLink className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      signal.signalType === "BUY" ? "text-green-500" : signal.signalType === "SELL" ? "text-red-500" : "text-yellow-500"
                    )} />
                    <p className={cn(
                      "text-xs font-medium",
                      signal.signalType === "BUY" ? "text-green-400" : signal.signalType === "SELL" ? "text-red-400" : "text-yellow-400"
                    )}>
                      {actionText} <span className="font-bold">{signal.symbol}</span>
                    </p>
                  </div>

                  {/* Technical data (if available) */}
                  {signal.technicalData && (
                    <div className="mt-3 grid grid-cols-3 gap-2 border-t border-zinc-800/50 pt-3">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">RSI</p>
                        <p className={cn(
                          "text-xs font-bold mt-0.5",
                          signal.technicalData.rsi > 70 ? "text-red-400" : signal.technicalData.rsi < 30 ? "text-green-400" : "text-zinc-300"
                        )}>
                          {signal.technicalData.rsi.toFixed(1)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">MACD</p>
                        <p className={cn(
                          "text-xs font-bold mt-0.5",
                          signal.technicalData.macd.histogram > 0 ? "text-green-400" : "text-red-400"
                        )}>
                          {signal.technicalData.macd.histogram > 0 ? "+" : ""}{signal.technicalData.macd.histogram.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Volume</p>
                        <p className="text-xs font-bold text-zinc-300 mt-0.5">
                          {signal.technicalData.volume > signal.technicalData.avgVolume ? "Above" : "Below"} Avg
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
