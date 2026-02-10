"use client";

import { DollarSign, TrendingUp, BarChart3, Signal, Briefcase } from "lucide-react";
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400">
          AI-powered market insights and portfolio overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Portfolio Cost Basis"
          value={totalCost > 0 ? formatCurrency(totalCost) : "$0.00"}
          description={holdingsList.length > 0 ? `${holdingsList.length} holdings` : "No holdings yet"}
          icon={DollarSign}
        />
        <StatCard
          title={`${selectedSymbol} Price`}
          value={quote ? formatCurrency(quote.price) : "—"}
          change={quote ? `${formatPercent(quote.changePercent)} today` : undefined}
          changeValue={quote?.changePercent ?? 0}
          icon={TrendingUp}
        />
        <StatCard
          title="Holdings"
          value={`${holdingsList.length}`}
          description={holdingsList.length > 0 ? holdingsList.map(h => h.symbol).join(", ") : "Add holdings in Portfolio"}
          icon={Briefcase}
        />
        <StatCard
          title="Active Signals"
          value={`${signalsList.length}`}
          change={signalsList.length > 0 ? `${buySignals} BUY, ${sellSignals} SELL, ${holdSignals} HOLD` : "Generate signals in AI Signals"}
          changeValue={0}
          icon={Signal}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart - takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Chart */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedSymbol}
                </h3>
                <p className="text-sm text-zinc-400">
                  {quote ? `${formatCurrency(quote.price)} (${formatPercent(quote.changePercent)})` : "Stock Price - Daily Candles"}
                </p>
              </div>
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
    </div>
  );
}
