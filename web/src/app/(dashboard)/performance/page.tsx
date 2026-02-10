"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Target,
  Flame,
  Award,
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
  { symbol: "NVDA", gain: "+15.2%", entry: "$680.00", exit: "$783.36", date: "Jan 15", days: 12 },
  { symbol: "TSLA", gain: "+13.8%", entry: "$245.00", exit: "$278.81", date: "Jan 18", days: 8 },
  { symbol: "AMD", gain: "+10.9%", entry: "$158.00", exit: "$175.22", date: "Jan 20", days: 15 },
  { symbol: "GOOGL", gain: "+9.6%", entry: "$178.00", exit: "$195.09", date: "Jan 28", days: 10 },
  { symbol: "MSFT", gain: "+7.1%", entry: "$410.00", exit: "$439.11", date: "Nov 12", days: 18 },
];

const topLosses = [
  { symbol: "DIS", loss: "-4.1%", entry: "$115.00", exit: "$110.29", date: "Oct 22", days: 14 },
  { symbol: "AAPL", loss: "-3.5%", entry: "$232.00", exit: "$223.88", date: "Jan 25", days: 7 },
  { symbol: "NFLX", loss: "-2.8%", entry: "$520.00", exit: "$505.44", date: "Oct 10", days: 11 },
];

export default function PerformancePage() {
  const totalReturn = monthlyReturns.reduce((sum, m) => sum + m.return, 0);
  const totalTrades = monthlyReturns.reduce((sum, m) => sum + m.trades, 0);
  const totalWins = monthlyReturns.reduce((sum, m) => sum + m.wins, 0);
  const winRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;
  const avgReturn = monthlyReturns.length > 0 ? totalReturn / monthlyReturns.length : 0;
  const maxBar = Math.max(...monthlyReturns.map((m) => Math.abs(m.return)));
  const bestMonth = monthlyReturns.reduce((best, m) => (m.return > best.return ? m : best));
  const currentStreak = (() => {
    let streak = 0;
    for (let i = monthlyReturns.length - 1; i >= 0; i--) {
      if (monthlyReturns[i].return > 0) streak++;
      else break;
    }
    return streak;
  })();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-purple-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/5 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Performance Tracker</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            How our AI alerts would have performed if you followed every signal
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <TrendingUp className="h-3.5 w-3.5" />
            Total Return
          </div>
          <p className={cn("mt-2 text-2xl font-bold", totalReturn >= 0 ? "text-emerald-400" : "text-red-400")}>
            {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(1)}%
          </p>
          <p className="mt-0.5 text-[10px] text-zinc-600">Last 6 months</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Target className="h-3.5 w-3.5" />
            Win Rate
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{winRate.toFixed(0)}%</p>
          <p className="mt-0.5 text-[10px] text-zinc-600">{totalWins}/{totalTrades} trades</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <DollarSign className="h-3.5 w-3.5" />
            Avg Monthly
          </div>
          <p className={cn("mt-2 text-2xl font-bold", avgReturn >= 0 ? "text-emerald-400" : "text-red-400")}>
            {avgReturn >= 0 ? "+" : ""}{avgReturn.toFixed(1)}%
          </p>
          <p className="mt-0.5 text-[10px] text-zinc-600">Per month</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Calendar className="h-3.5 w-3.5" />
            Total Alerts
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{totalTrades}</p>
          <p className="mt-0.5 text-[10px] text-zinc-600">6 months</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Award className="h-3.5 w-3.5" />
            Best Month
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-400">+{bestMonth.return}%</p>
          <p className="mt-0.5 text-[10px] text-zinc-600">{bestMonth.month}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Flame className="h-3.5 w-3.5" />
            Win Streak
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">{currentStreak}</p>
          <p className="mt-0.5 text-[10px] text-zinc-600">Months in a row</p>
        </div>
      </div>

      {/* Monthly Returns Bar Chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-white">Monthly Returns</h3>
        </div>
        <div className="space-y-3">
          {monthlyReturns.map((month) => (
            <div key={month.month} className="group flex items-center gap-4">
              <span className="w-20 shrink-0 text-xs font-medium text-zinc-400">
                {month.month}
              </span>
              <div className="relative flex h-10 flex-1 items-center">
                <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-800" />
                <div
                  className={cn(
                    "absolute top-1 h-8 rounded-md transition-all group-hover:opacity-80",
                    month.return >= 0 ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : "bg-gradient-to-l from-red-600 to-red-400"
                  )}
                  style={{
                    left: month.return >= 0 ? "50%" : undefined,
                    right: month.return < 0 ? "50%" : undefined,
                    width: `${(Math.abs(month.return) / maxBar) * 45}%`,
                  }}
                />
              </div>
              <span
                className={cn(
                  "w-16 shrink-0 text-right text-sm font-bold",
                  month.return >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {month.return >= 0 ? "+" : ""}{month.return}%
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
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-4">
            <ArrowUpCircle className="h-4 w-4 text-green-400" />
            <h3 className="text-sm font-semibold text-white">Best Alerts</h3>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {topWins.map((win, i) => (
              <div
                key={`${win.symbol}-${win.date}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500/10 text-[10px] font-bold text-green-400">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white">{win.symbol}</span>
                    <p className="text-[10px] text-zinc-500">
                      {win.entry} → {win.exit} · {win.days}d hold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-green-400">{win.gain}</span>
                  <p className="text-[10px] text-zinc-600">{win.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-4">
            <ArrowDownCircle className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-white">Worst Alerts</h3>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {topLosses.map((loss, i) => (
              <div
                key={`${loss.symbol}-${loss.date}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500/10 text-[10px] font-bold text-red-400">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-bold text-white">{loss.symbol}</span>
                    <p className="text-[10px] text-zinc-500">
                      {loss.entry} → {loss.exit} · {loss.days}d hold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-red-400">{loss.loss}</span>
                  <p className="text-[10px] text-zinc-600">{loss.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800 px-5 py-3">
            <p className="text-center text-[10px] text-zinc-600">
              Transparency matters — we show every miss.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 px-5 py-4 text-xs text-zinc-500 leading-relaxed">
        Past performance is not indicative of future results. Returns shown are
        hypothetical and assume following every alert at the time it was issued.
        This is not financial advice. Always do your own research.
      </div>
    </div>
  );
}
