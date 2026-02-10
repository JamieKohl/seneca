"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyReturn {
  month: string;
  return: number;
  trades: number;
  wins: number;
}

const monthlyReturns: MonthlyReturn[] = [
  { month: "Sep 2025", return: 8.2, trades: 12, wins: 9 },
  { month: "Oct 2025", return: -2.1, trades: 15, wins: 8 },
  { month: "Nov 2025", return: 11.5, trades: 18, wins: 14 },
  { month: "Dec 2025", return: 5.7, trades: 10, wins: 7 },
  { month: "Jan 2026", return: 14.3, trades: 20, wins: 17 },
  { month: "Feb 2026", return: 3.8, trades: 8, wins: 6 },
];

const topWins = [
  { symbol: "NVDA", gain: "+15.2%", entry: "$680.00", exit: "$783.36", date: "Jan 15" },
  { symbol: "TSLA", gain: "+13.8%", entry: "$245.00", exit: "$278.81", date: "Jan 18" },
  { symbol: "GOOGL", gain: "+9.6%", entry: "$178.00", exit: "$195.09", date: "Jan 28" },
  { symbol: "AMD", gain: "+8.4%", entry: "$145.00", exit: "$157.18", date: "Dec 5" },
  { symbol: "MSFT", gain: "+7.1%", entry: "$410.00", exit: "$439.11", date: "Nov 12" },
];

const topLosses = [
  { symbol: "AAPL", loss: "-3.5%", entry: "$232.00", exit: "$223.88", date: "Jan 25" },
  { symbol: "NFLX", loss: "-2.8%", entry: "$520.00", exit: "$505.44", date: "Oct 10" },
  { symbol: "DIS", loss: "-4.1%", entry: "$115.00", exit: "$110.29", date: "Oct 22" },
];

export default function PerformancePage() {
  const totalReturn = monthlyReturns.reduce((sum, m) => sum + m.return, 0);
  const totalTrades = monthlyReturns.reduce((sum, m) => sum + m.trades, 0);
  const totalWins = monthlyReturns.reduce((sum, m) => sum + m.wins, 0);
  const winRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;
  const avgReturn = monthlyReturns.length > 0 ? totalReturn / monthlyReturns.length : 0;
  const maxBar = Math.max(...monthlyReturns.map((m) => Math.abs(m.return)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Performance Tracker</h1>
        <p className="text-sm text-zinc-400">
          See how our AI alerts would have performed if you followed every signal
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Total Return</span>
          </div>
          <div
            className={cn(
              "mt-2 text-3xl font-bold",
              totalReturn >= 0 ? "text-emerald-500" : "text-red-500"
            )}
          >
            {totalReturn >= 0 ? "+" : ""}
            {totalReturn.toFixed(1)}%
          </div>
          <p className="mt-1 text-xs text-zinc-500">Last 6 months</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-medium">Win Rate</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">
            {winRate.toFixed(0)}%
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {totalWins} of {totalTrades} trades
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium">Avg Monthly Return</span>
          </div>
          <div
            className={cn(
              "mt-2 text-3xl font-bold",
              avgReturn >= 0 ? "text-emerald-500" : "text-red-500"
            )}
          >
            {avgReturn >= 0 ? "+" : ""}
            {avgReturn.toFixed(1)}%
          </div>
          <p className="mt-1 text-xs text-zinc-500">Per month</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Total Alerts</span>
          </div>
          <div className="mt-2 text-3xl font-bold text-white">{totalTrades}</div>
          <p className="mt-1 text-xs text-zinc-500">Across 6 months</p>
        </div>
      </div>

      {/* Monthly Returns Bar Chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="mb-6 text-lg font-semibold text-white">
          Monthly Returns
        </h3>
        <div className="space-y-3">
          {monthlyReturns.map((month) => (
            <div key={month.month} className="flex items-center gap-4">
              <span className="w-20 shrink-0 text-xs text-zinc-400">
                {month.month}
              </span>
              <div className="relative flex h-8 flex-1 items-center">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-700" />
                {/* Bar */}
                <div
                  className="absolute top-1 h-6 rounded"
                  style={{
                    left: month.return >= 0 ? "50%" : undefined,
                    right: month.return < 0 ? "50%" : undefined,
                    width: `${(Math.abs(month.return) / maxBar) * 45}%`,
                    backgroundColor:
                      month.return >= 0
                        ? "rgb(16, 185, 129)"
                        : "rgb(239, 68, 68)",
                  }}
                />
              </div>
              <span
                className={cn(
                  "w-16 shrink-0 text-right text-sm font-semibold",
                  month.return >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {month.return >= 0 ? "+" : ""}
                {month.return}%
              </span>
              <span className="w-20 shrink-0 text-right text-xs text-zinc-500">
                {month.wins}/{month.trades} wins
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Wins & Losses */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Wins */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Best Alerts</h3>
          </div>
          <div className="space-y-3">
            {topWins.map((win) => (
              <div
                key={`${win.symbol}-${win.date}`}
                className="flex items-center justify-between rounded-lg bg-zinc-800/30 px-4 py-3"
              >
                <div>
                  <span className="font-bold text-white">{win.symbol}</span>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    {win.entry} → {win.exit}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-green-400">
                    {win.gain}
                  </span>
                  <div className="mt-0.5 text-xs text-zinc-500">{win.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losses */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Worst Alerts</h3>
          </div>
          <div className="space-y-3">
            {topLosses.map((loss) => (
              <div
                key={`${loss.symbol}-${loss.date}`}
                className="flex items-center justify-between rounded-lg bg-zinc-800/30 px-4 py-3"
              >
                <div>
                  <span className="font-bold text-white">{loss.symbol}</span>
                  <div className="mt-0.5 text-xs text-zinc-500">
                    {loss.entry} → {loss.exit}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-red-400">
                    {loss.loss}
                  </span>
                  <div className="mt-0.5 text-xs text-zinc-500">{loss.date}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-zinc-600">
            Transparency matters — we show every miss.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-3 text-xs text-zinc-500">
        Past performance is not indicative of future results. Returns shown are
        hypothetical and assume following every alert at the time it was issued.
        This is not financial advice.
      </div>
    </div>
  );
}
