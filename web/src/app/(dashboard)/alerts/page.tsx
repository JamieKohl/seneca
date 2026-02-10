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
  Bell,
  Shield,
  ExternalLink,
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
  broker: string;
}

const pastAlerts: PastAlert[] = [
  {
    id: "1",
    symbol: "NVDA",
    action: "BUY",
    reason: "AI chip demand surging after Microsoft's $80B data center commitment. Go buy on your broker now.",
    confidence: 0.92,
    priceAtAlert: 680.0,
    currentPrice: 758.4,
    estimatedGain: "+10-15%",
    actualGain: "+11.5%",
    outcome: "correct",
    date: "2026-01-15T10:30:00Z",
    broker: "Robinhood",
  },
  {
    id: "2",
    symbol: "TSLA",
    action: "BUY",
    reason: "Robotaxi FSD approval in Texas confirmed. Strong catalyst for shares. Buy on your broker.",
    confidence: 0.85,
    priceAtAlert: 245.0,
    currentPrice: 278.8,
    estimatedGain: "+12-18%",
    actualGain: "+13.8%",
    outcome: "correct",
    date: "2026-01-18T14:15:00Z",
    broker: "Webull",
  },
  {
    id: "3",
    symbol: "AMZN",
    action: "SELL",
    reason: "RSI at 78, severely overbought after 30% run. Take profits on your broker before pullback.",
    confidence: 0.78,
    priceAtAlert: 198.0,
    currentPrice: 185.1,
    estimatedGain: "-5-8%",
    actualGain: "-6.5%",
    outcome: "correct",
    date: "2026-01-22T09:00:00Z",
    broker: "Fidelity",
  },
  {
    id: "4",
    symbol: "AAPL",
    action: "BUY",
    reason: "iPhone 17 pre-orders exceeded expectations by 40%. Go buy AAPL on your broker.",
    confidence: 0.81,
    priceAtAlert: 232.0,
    currentPrice: 228.5,
    estimatedGain: "+6-10%",
    actualGain: "-1.5%",
    outcome: "incorrect",
    date: "2026-01-25T11:45:00Z",
    broker: "Robinhood",
  },
  {
    id: "5",
    symbol: "GOOGL",
    action: "BUY",
    reason: "Gemini 2.0 launch driving enterprise adoption. Ad revenue beat by 12%. Strong buy signal.",
    confidence: 0.88,
    priceAtAlert: 178.0,
    currentPrice: 195.0,
    estimatedGain: "+8-12%",
    actualGain: "+9.6%",
    outcome: "correct",
    date: "2026-01-28T13:20:00Z",
    broker: "Webull",
  },
  {
    id: "6",
    symbol: "MSFT",
    action: "HOLD",
    reason: "Fair valued at current levels. Wait for Copilot revenue data in next earnings before acting.",
    confidence: 0.74,
    priceAtAlert: 420.0,
    currentPrice: 425.5,
    estimatedGain: "+1-3%",
    actualGain: "+1.3%",
    outcome: "correct",
    date: "2026-02-01T10:00:00Z",
    broker: "Fidelity",
  },
  {
    id: "7",
    symbol: "META",
    action: "BUY",
    reason: "Reels monetization up 65% YoY, Quest 4 pre-orders strong. Buy on your broker.",
    confidence: 0.83,
    priceAtAlert: 585.0,
    currentPrice: 612.0,
    estimatedGain: "+7-11%",
    actualGain: "+4.6%",
    outcome: "pending",
    date: "2026-02-05T15:30:00Z",
    broker: "Robinhood",
  },
  {
    id: "8",
    symbol: "JPM",
    action: "BUY",
    reason: "Interest rates favorable for net interest margin. Commercial lending up 18%. Go buy on broker.",
    confidence: 0.79,
    priceAtAlert: 215.0,
    currentPrice: 222.0,
    estimatedGain: "+4-7%",
    actualGain: "+3.3%",
    outcome: "pending",
    date: "2026-02-07T09:15:00Z",
    broker: "Fidelity",
  },
  {
    id: "9",
    symbol: "AMD",
    action: "BUY",
    reason: "MI400 AI chip benchmarks beat NVIDIA in inference. Server wins accelerating.",
    confidence: 0.86,
    priceAtAlert: 158.0,
    currentPrice: 175.2,
    estimatedGain: "+8-14%",
    actualGain: "+10.9%",
    outcome: "correct",
    date: "2026-01-20T08:30:00Z",
    broker: "Robinhood",
  },
  {
    id: "10",
    symbol: "NFLX",
    action: "SELL",
    reason: "Subscriber growth slowing, ad tier ARPU below expectations. Consider selling on your broker.",
    confidence: 0.72,
    priceAtAlert: 520.0,
    currentPrice: 505.4,
    estimatedGain: "-3-6%",
    actualGain: "-2.8%",
    outcome: "correct",
    date: "2026-01-12T10:00:00Z",
    broker: "Webull",
  },
];

const signalIcons = {
  BUY: ArrowUpCircle,
  SELL: ArrowDownCircle,
  HOLD: MinusCircle,
};

const outcomeConfig = {
  correct: { icon: CheckCircle2, label: "Correct", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  incorrect: { icon: XCircle, label: "Missed", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  pending: { icon: Clock, label: "Pending", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
};

const signalColors = {
  BUY: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  SELL: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  HOLD: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
};

export default function AlertHistoryPage() {
  const [filter, setFilter] = useState<"ALL" | "BUY" | "SELL" | "HOLD">("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState<"ALL" | AlertOutcome>("ALL");

  const filtered = pastAlerts.filter((a) => {
    if (filter !== "ALL" && a.action !== filter) return false;
    if (outcomeFilter !== "ALL" && a.outcome !== outcomeFilter) return false;
    return true;
  });

  const resolved = pastAlerts.filter((a) => a.outcome !== "pending");
  const correct = resolved.filter((a) => a.outcome === "correct").length;
  const accuracy = resolved.length > 0 ? (correct / resolved.length) * 100 : 0;
  const pending = pastAlerts.filter((a) => a.outcome === "pending").length;
  const avgConfidence = pastAlerts.reduce((s, a) => s + a.confidence, 0) / pastAlerts.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-amber-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/5 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Alert History</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Every alert we sent — and whether it was right. Full transparency.
          </p>
        </div>
      </div>

      {/* Scorecard */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Target className="h-3.5 w-3.5" />
            Accuracy
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{accuracy.toFixed(0)}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-zinc-800">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Trophy className="h-3.5 w-3.5" />
            Correct
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {correct}<span className="text-lg text-zinc-500">/{resolved.length}</span>
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Bell className="h-3.5 w-3.5" />
            Total Alerts
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{pastAlerts.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-yellow-500/70">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </div>
          <p className="mt-2 text-3xl font-bold text-yellow-400">{pending}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Shield className="h-3.5 w-3.5" />
            Avg Confidence
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{(avgConfidence * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/30 p-1">
          {(["ALL", "BUY", "SELL", "HOLD"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                filter === f ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {f !== "ALL" && (
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    f === "BUY" ? "bg-green-500" : f === "SELL" ? "bg-red-500" : "bg-yellow-500"
                  )}
                />
              )}
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/30 p-1">
          {(["ALL", "correct", "incorrect", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setOutcomeFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all",
                outcomeFilter === f ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
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
          const colors = signalColors[alert.action];

          return (
            <div
              key={alert.id}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={cn("rounded-xl p-2.5 shrink-0", colors.bg, colors.text)}>
                    <SignalIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-white">{alert.symbol}</span>
                      <span className={cn("rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", colors.bg, colors.text)}>
                        {alert.action}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {(alert.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-zinc-300 leading-relaxed">{alert.reason}</p>

                    {/* Price details */}
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Alert Price</p>
                        <p className="text-sm font-bold text-zinc-300">${alert.priceAtAlert.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Current</p>
                        <p className="text-sm font-bold text-zinc-300">${alert.currentPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Estimated</p>
                        <p className="text-sm font-bold text-emerald-400">{alert.estimatedGain}</p>
                      </div>
                      {alert.actualGain && (
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-zinc-600">Actual</p>
                          <p className={cn(
                            "text-sm font-bold",
                            alert.actualGain.startsWith("-") ? "text-red-400" : "text-green-400"
                          )}>
                            {alert.actualGain}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Broker</p>
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3 text-zinc-500" />
                          <p className="text-sm font-medium text-zinc-400">{alert.broker}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outcome */}
                <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                  <div className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold", outcome.color)}>
                    <OutcomeIcon className="h-3.5 w-3.5" />
                    {outcome.label}
                  </div>
                  <span className="text-xs text-zinc-600">
                    {new Date(alert.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
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
