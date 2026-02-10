"use client";

import { useState } from "react";
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Flame,
  Target,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface Trader {
  rank: number;
  prevRank: number;
  username: string;
  avatar: string;
  tier: "free" | "pro";
  totalReturn: number;
  monthReturn: number;
  winRate: number;
  trades: number;
  streak: number;
  topHolding: string;
}

const traders: Trader[] = [
  { rank: 1, prevRank: 1, username: "AlphaTrader99", avatar: "bg-emerald-500", tier: "pro", totalReturn: 284.5, monthReturn: 18.3, winRate: 78, trades: 342, streak: 12, topHolding: "NVDA" },
  { rank: 2, prevRank: 4, username: "NightOwlCapital", avatar: "bg-blue-500", tier: "pro", totalReturn: 213.8, monthReturn: 22.1, winRate: 72, trades: 198, streak: 8, topHolding: "TSLA" },
  { rank: 3, prevRank: 2, username: "QuantumEdge", avatar: "bg-violet-500", tier: "pro", totalReturn: 198.2, monthReturn: 12.4, winRate: 81, trades: 567, streak: 5, topHolding: "AAPL" },
  { rank: 4, prevRank: 3, username: "BullishBear", avatar: "bg-amber-500", tier: "free", totalReturn: 176.4, monthReturn: 9.8, winRate: 68, trades: 123, streak: 3, topHolding: "MSFT" },
  { rank: 5, prevRank: 7, username: "SilentWhale", avatar: "bg-cyan-500", tier: "pro", totalReturn: 165.9, monthReturn: 15.6, winRate: 75, trades: 89, streak: 7, topHolding: "META" },
  { rank: 6, prevRank: 5, username: "TechMogul", avatar: "bg-rose-500", tier: "free", totalReturn: 152.3, monthReturn: 8.2, winRate: 66, trades: 234, streak: 2, topHolding: "AMZN" },
  { rank: 7, prevRank: 6, username: "DiamondHands42", avatar: "bg-orange-500", tier: "free", totalReturn: 143.7, monthReturn: 7.5, winRate: 64, trades: 156, streak: 4, topHolding: "GOOG" },
  { rank: 8, prevRank: 10, username: "MomentumKing", avatar: "bg-pink-500", tier: "pro", totalReturn: 138.1, monthReturn: 19.8, winRate: 71, trades: 445, streak: 9, topHolding: "AMD" },
  { rank: 9, prevRank: 8, username: "ValueHunter", avatar: "bg-teal-500", tier: "free", totalReturn: 124.6, monthReturn: 5.3, winRate: 73, trades: 67, streak: 1, topHolding: "BRK.B" },
  { rank: 10, prevRank: 9, username: "SwingMaster", avatar: "bg-indigo-500", tier: "pro", totalReturn: 118.2, monthReturn: 11.7, winRate: 69, trades: 312, streak: 6, topHolding: "NFLX" },
];

const myStats = {
  rank: 247,
  prevRank: 312,
  totalReturn: 34.8,
  monthReturn: 6.2,
  winRate: 62,
  percentile: 85,
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"all" | "month" | "week">("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 p-6">
        <Trophy className="absolute -right-4 -top-4 h-32 w-32 text-amber-500/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            See how your portfolio performance compares to other traders
          </p>
        </div>
      </div>

      {/* My Stats */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
            <Target className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Your Ranking</p>
            <p className="text-xs text-zinc-400">Top {100 - myStats.percentile}% of all traders</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-zinc-500">Rank</p>
            <div className="flex items-center gap-1.5">
              <p className="text-lg font-bold text-white">#{myStats.rank}</p>
              <span className="flex items-center text-xs text-emerald-400">
                <ArrowUp className="h-3 w-3" />{myStats.prevRank - myStats.rank}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Total Return</p>
            <p className="text-lg font-bold text-emerald-400">+{myStats.totalReturn}%</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">This Month</p>
            <p className="text-lg font-bold text-emerald-400">+{myStats.monthReturn}%</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Win Rate</p>
            <p className="text-lg font-bold text-white">{myStats.winRate}%</p>
          </div>
        </div>
      </div>

      {/* Period filter */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {(["all", "month", "week"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:text-white"
              }`}
            >
              {p === "all" ? "All Time" : p === "month" ? "This Month" : "This Week"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Users className="h-3.5 w-3.5" />
          1,247 traders
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide w-16">Rank</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Trader</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide">Total Return</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide hidden sm:table-cell">Month</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide hidden md:table-cell">Win Rate</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide hidden md:table-cell">Trades</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Streak</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Top Hold</th>
              </tr>
            </thead>
            <tbody>
              {traders.map((trader) => {
                const rankChange = trader.prevRank - trader.rank;
                return (
                  <tr
                    key={trader.rank}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {trader.rank === 1 ? (
                          <Crown className="h-5 w-5 text-amber-400" />
                        ) : trader.rank === 2 ? (
                          <Medal className="h-5 w-5 text-zinc-300" />
                        ) : trader.rank === 3 ? (
                          <Medal className="h-5 w-5 text-amber-700" />
                        ) : (
                          <span className="text-sm font-medium text-zinc-400 w-5 text-center">{trader.rank}</span>
                        )}
                        {rankChange !== 0 && (
                          <span className={`text-[10px] flex items-center ${rankChange > 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {rankChange > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                            {Math.abs(rankChange)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full ${trader.avatar} flex items-center justify-center text-xs font-bold text-white`}>
                          {trader.username[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{trader.username}</p>
                          {trader.tier === "pro" && (
                            <span className="text-[10px] text-emerald-400 font-medium">PRO</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-sm font-bold text-emerald-400">+{trader.totalReturn}%</span>
                    </td>
                    <td className="px-5 py-3 text-right hidden sm:table-cell">
                      <span className={`text-sm font-medium ${trader.monthReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {trader.monthReturn >= 0 ? "+" : ""}{trader.monthReturn}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right hidden md:table-cell">
                      <span className="text-sm text-zinc-300">{trader.winRate}%</span>
                    </td>
                    <td className="px-5 py-3 text-right hidden md:table-cell">
                      <span className="text-sm text-zinc-400">{trader.trades}</span>
                    </td>
                    <td className="px-5 py-3 text-right hidden lg:table-cell">
                      {trader.streak >= 5 ? (
                        <span className="flex items-center justify-end gap-1 text-sm text-amber-400">
                          <Flame className="h-3.5 w-3.5" />{trader.streak}
                        </span>
                      ) : (
                        <span className="text-sm text-zinc-400">{trader.streak}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right hidden lg:table-cell">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-white">
                        {trader.topHolding}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info note */}
      <p className="text-center text-xs text-zinc-600">
        Rankings are based on self-reported portfolio returns. All data is anonymized.
      </p>
    </div>
  );
}
