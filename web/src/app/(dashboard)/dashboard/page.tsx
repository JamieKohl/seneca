"use client";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Signal,
  Briefcase,
  ArrowRight,
  Bell,
  BarChart3,
  Zap,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { StockChart } from "@/components/charts/stock-chart";
import { WatchlistCard } from "@/components/dashboard/watchlist-card";
import { RecentSignalsCard } from "@/components/dashboard/recent-signals-card";
import { useStore } from "@/lib/store";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useSignals } from "@/hooks/useSignals";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useCandles } from "@/hooks/useCandles";
import { formatCurrency, formatPercent } from "@/lib/utils";

const marketMovers = [
  { symbol: "NVDA", name: "NVIDIA", price: 875.28, change: 4.82 },
  { symbol: "META", name: "Meta Platforms", price: 512.64, change: 2.91 },
  { symbol: "TSLA", name: "Tesla", price: 248.50, change: 3.24 },
  { symbol: "AMD", name: "AMD", price: 178.32, change: -1.87 },
  { symbol: "AAPL", name: "Apple", price: 189.84, change: 0.64 },
  { symbol: "GOOGL", name: "Alphabet", price: 155.72, change: -0.43 },
  { symbol: "MSFT", name: "Microsoft", price: 415.60, change: 1.12 },
  { symbol: "AMZN", name: "Amazon", price: 186.92, change: 2.05 },
];

const quickActions = [
  {
    label: "Add Position",
    description: "Log a stock from your broker",
    href: "/portfolio",
    icon: Briefcase,
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    label: "Generate Signals",
    description: "Get AI buy/sell/hold alerts",
    href: "/signals",
    icon: Zap,
    color: "text-emerald-400 bg-emerald-500/10",
  },
  {
    label: "Alert History",
    description: "See past alert accuracy",
    href: "/alerts",
    icon: Bell,
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    label: "Performance",
    description: "Track your returns",
    href: "/performance",
    icon: BarChart3,
    color: "text-purple-400 bg-purple-500/10",
  },
];

export default function DashboardPage() {
  const { selectedSymbol, setSelectedSymbol } = useStore();
  const { holdings } = usePortfolio();
  const { signals } = useSignals();
  const { quote } = useStockQuote(selectedSymbol);
  const { candles } = useCandles(selectedSymbol);

  const holdingsList = holdings ?? [];
  const signalsList = signals ?? [];

  const totalCost = holdingsList.reduce((s, h) => s + h.avgCostBasis * h.quantity, 0);
  const buySignals = signalsList.filter(s => s.signalType === "BUY").length;
  const sellSignals = signalsList.filter(s => s.signalType === "SELL").length;
  const holdSignals = signalsList.filter(s => s.signalType === "HOLD").length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-emerald-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Live market data and AI alerts for your broker positions
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-zinc-500 truncate">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Positions Value"
          value={totalCost > 0 ? formatCurrency(totalCost) : "$0.00"}
          description={holdingsList.length > 0 ? `${holdingsList.length} positions logged` : "No positions yet"}
          icon={DollarSign}
          iconColor="text-emerald-500 bg-emerald-500/10"
        />
        <StatCard
          title={`${selectedSymbol} Price`}
          value={quote ? formatCurrency(quote.price) : "—"}
          change={quote ? `${formatPercent(quote.changePercent)} today` : undefined}
          changeValue={quote?.changePercent ?? 0}
          icon={TrendingUp}
          iconColor="text-blue-500 bg-blue-500/10"
        />
        <StatCard
          title="Positions"
          value={`${holdingsList.length}`}
          description={holdingsList.length > 0 ? holdingsList.map(h => h.symbol).join(", ") : "Add positions in My Positions"}
          icon={Briefcase}
          iconColor="text-purple-500 bg-purple-500/10"
        />
        <StatCard
          title="Active Alerts"
          value={`${signalsList.length}`}
          change={signalsList.length > 0 ? `${buySignals} BUY, ${sellSignals} SELL, ${holdSignals} HOLD` : "Generate signals to get alerts"}
          changeValue={0}
          icon={Signal}
          iconColor="text-amber-500 bg-amber-500/10"
        />
      </div>

      {/* Ticker Strip */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center animate-[scroll_30s_linear_infinite]">
          {[...marketMovers, ...marketMovers].map((stock, i) => (
            <button
              key={`${stock.symbol}-${i}`}
              onClick={() => setSelectedSymbol(stock.symbol)}
              className="flex shrink-0 items-center gap-3 border-r border-zinc-800/50 px-5 py-2.5 hover:bg-zinc-800/50 transition-colors"
            >
              <span className="text-sm font-bold text-white">{stock.symbol}</span>
              <span className="text-xs text-zinc-500">{formatCurrency(stock.price)}</span>
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  stock.change >= 0 ? "text-emerald-400" : "text-red-400"
                )}
              >
                {stock.change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart - takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Chart */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedSymbol}
                  </h3>
                  {quote && (
                    <span className={`text-sm font-medium ${
                      (quote.changePercent ?? 0) >= 0 ? "text-green-400" : "text-red-400"
                    }`}>
                      {formatPercent(quote.changePercent)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400">
                  {quote ? formatCurrency(quote.price) : "Daily Price Chart"}
                </p>
              </div>
              <Link
                href="/portfolio"
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                View positions
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <StockChart symbol={selectedSymbol} candles={candles} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <WatchlistCard onSelect={setSelectedSymbol} />
          <RecentSignalsCard />
        </div>
      </div>

      {/* Market Movers */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <h3 className="text-base font-semibold text-white">Market Movers</h3>
          </div>
          <Link
            href="/signals"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            View AI Signals
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {marketMovers.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => setSelectedSymbol(stock.symbol)}
              className="group flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 hover:border-zinc-700 hover:bg-zinc-800/80 transition-all"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {stock.symbol}
                  </span>
                  {stock.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {formatCurrency(stock.price)}
                </p>
                <p
                  className={cn(
                    "text-xs font-medium",
                    stock.change >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
