"use client";

import { useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AlertOutcome = "correct" | "incorrect" | "pending";

interface PastAlert {
  id: string;
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  reason: string;
  confidence: number;
  priceAtAlert: number;
  currentPrice: number;
  estimatedGain: string;
  actualGain: string | null;
  outcome: AlertOutcome;
  date: string;
}

const pastAlerts: PastAlert[] = [
  {
    id: "1",
    symbol: "NVDA",
    action: "BUY",
    reason: "AI chip demand surging, data center revenue up 150% YoY",
    confidence: 0.92,
    priceAtAlert: 680.0,
    currentPrice: 758.4,
    estimatedGain: "+10-15%",
    actualGain: "+11.5%",
    outcome: "correct",
    date: "2026-01-15T10:30:00Z",
  },
  {
    id: "2",
    symbol: "TSLA",
    action: "BUY",
    reason: "New Robotaxi announcement expected, insider buying detected",
    confidence: 0.85,
    priceAtAlert: 245.0,
    currentPrice: 278.8,
    estimatedGain: "+12-18%",
    actualGain: "+13.8%",
    outcome: "correct",
    date: "2026-01-18T14:15:00Z",
  },
  {
    id: "3",
    symbol: "AMZN",
    action: "SELL",
    reason: "Overbought RSI, AWS growth slowing, profit-taking expected",
    confidence: 0.78,
    priceAtAlert: 198.0,
    currentPrice: 185.1,
    estimatedGain: "-5-8%",
    actualGain: "-6.5%",
    outcome: "correct",
    date: "2026-01-22T09:00:00Z",
  },
  {
    id: "4",
    symbol: "AAPL",
    action: "BUY",
    reason: "iPhone 17 pre-orders exceeding expectations",
    confidence: 0.81,
    priceAtAlert: 232.0,
    currentPrice: 228.5,
    estimatedGain: "+6-10%",
    actualGain: "-1.5%",
    outcome: "incorrect",
    date: "2026-01-25T11:45:00Z",
  },
  {
    id: "5",
    symbol: "GOOGL",
    action: "BUY",
    reason: "Gemini AI adoption accelerating, ad revenue strong",
    confidence: 0.88,
    priceAtAlert: 178.0,
    currentPrice: 195.0,
    estimatedGain: "+8-12%",
    actualGain: "+9.6%",
    outcome: "correct",
    date: "2026-01-28T13:20:00Z",
  },
  {
    id: "6",
    symbol: "MSFT",
    action: "HOLD",
    reason: "Fair valued, wait for Copilot revenue data in next earnings",
    confidence: 0.74,
    priceAtAlert: 420.0,
    currentPrice: 425.5,
    estimatedGain: "+1-3%",
    actualGain: "+1.3%",
    outcome: "correct",
    date: "2026-02-01T10:00:00Z",
  },
  {
    id: "7",
    symbol: "META",
    action: "BUY",
    reason: "Reels monetization improving, VR headset sales spike",
    confidence: 0.83,
    priceAtAlert: 585.0,
    currentPrice: 590.0,
    estimatedGain: "+7-11%",
    actualGain: null,
    outcome: "pending",
    date: "2026-02-05T15:30:00Z",
  },
  {
    id: "8",
    symbol: "JPM",
    action: "BUY",
    reason: "Interest rate environment favorable, strong loan growth",
    confidence: 0.79,
    priceAtAlert: 215.0,
    currentPrice: 218.0,
    estimatedGain: "+4-7%",
    actualGain: null,
    outcome: "pending",
    date: "2026-02-07T09:15:00Z",
  },
];

const signalIcons = {
  BUY: ArrowUpCircle,
  SELL: ArrowDownCircle,
  HOLD: MinusCircle,
};

const outcomeConfig = {
  correct: { icon: CheckCircle2, label: "Correct", color: "text-green-400 bg-green-500/10" },
  incorrect: { icon: XCircle, label: "Missed", color: "text-red-400 bg-red-500/10" },
  pending: { icon: Clock, label: "Pending", color: "text-yellow-400 bg-yellow-500/10" },
};

export default function AlertHistoryPage() {
  const [filter, setFilter] = useState<"ALL" | "BUY" | "SELL" | "HOLD">("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState<"ALL" | AlertOutcome>("ALL");

  const filtered = pastAlerts.filter((a) => {
    if (filter !== "ALL" && a.action !== filter) return false;
    if (outcomeFilter !== "ALL" && a.outcome !== outcomeFilter) return false;
    return true;
  });

  // Scorecard stats
  const resolved = pastAlerts.filter((a) => a.outcome !== "pending");
  const correct = resolved.filter((a) => a.outcome === "correct").length;
  const accuracy = resolved.length > 0 ? (correct / resolved.length) * 100 : 0;
  const pending = pastAlerts.filter((a) => a.outcome === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Alert History</h1>
        <p className="text-sm text-zinc-400">
          Track past alerts and see how our predictions performed
        </p>
      </div>

      {/* Scorecard */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Target className="h-4 w-4" />
            <span className="text-xs font-medium">Accuracy</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-emerald-500">
            {accuracy.toFixed(0)}%
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium">Correct Calls</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">
            {correct}/{resolved.length}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Total Alerts</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">
            {pastAlerts.length}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Pending</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-yellow-400">
            {pending}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <span className="text-xs text-zinc-500">Signal:</span>
          {(["ALL", "BUY", "SELL", "HOLD"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Outcome:</span>
          {(["ALL", "correct", "incorrect", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setOutcomeFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                outcomeFilter === f
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const SignalIcon = signalIcons[alert.action];
          const outcome = outcomeConfig[alert.outcome];
          const OutcomeIcon = outcome.icon;

          return (
            <div
              key={alert.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: Signal info */}
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "rounded-lg p-2",
                      alert.action === "BUY"
                        ? "bg-green-500/10 text-green-400"
                        : alert.action === "SELL"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    )}
                  >
                    <SignalIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">
                        {alert.symbol}
                      </span>
                      <span
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs font-bold",
                          alert.action === "BUY"
                            ? "bg-green-500/10 text-green-400"
                            : alert.action === "SELL"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        )}
                      >
                        {alert.action}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {alert.confidence * 100}% confidence
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{alert.reason}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <span>
                        Price at alert: <span className="text-zinc-300">${alert.priceAtAlert.toFixed(2)}</span>
                      </span>
                      <span>
                        Current: <span className="text-zinc-300">${alert.currentPrice.toFixed(2)}</span>
                      </span>
                      <span>
                        Est: <span className="text-emerald-400">{alert.estimatedGain}</span>
                      </span>
                      {alert.actualGain && (
                        <span>
                          Actual:{" "}
                          <span
                            className={
                              alert.actualGain.startsWith("-")
                                ? "text-red-400"
                                : "text-green-400"
                            }
                          >
                            {alert.actualGain}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Outcome + date */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                      outcome.color
                    )}
                  >
                    <OutcomeIcon className="h-3.5 w-3.5" />
                    {outcome.label}
                  </div>
                  <span className="text-xs text-zinc-600">
                    {new Date(alert.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
