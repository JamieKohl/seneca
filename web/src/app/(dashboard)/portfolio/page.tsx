"use client";

import { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Briefcase,
  DollarSign,
  BarChart3,
  PieChart,
  Trash2,
  ExternalLink,
  Wallet,
  X,
} from "lucide-react";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { AllocationChart } from "@/components/charts/allocation-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  cn,
  formatCurrency,
  formatPercent,
  getChangeColor,
} from "@/lib/utils";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useStockQuote } from "@/hooks/useStockQuote";
import { toast } from "@/components/ui/toast";

function HoldingRow({
  holding,
  onDelete,
}: {
  holding: { id: string; symbol: string; quantity: number; avgCostBasis: number };
  onDelete: (id: string) => void;
}) {
  const { quote } = useStockQuote(holding.symbol);
  const currentPrice = quote?.price ?? 0;
  const marketValue = currentPrice * holding.quantity;
  const totalCost = holding.avgCostBasis * holding.quantity;
  const pnl = marketValue - totalCost;
  const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  const dayChangePercent = quote?.changePercent ?? 0;

  return (
    <tr className="group hover:bg-zinc-800/50 transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold",
              currentPrice > 0 && pnl >= 0
                ? "bg-green-500/10 text-green-500"
                : currentPrice > 0
                ? "bg-red-500/10 text-red-500"
                : "bg-zinc-800 text-zinc-400"
            )}
          >
            {holding.symbol.slice(0, 2)}
          </div>
          <div>
            <span className="font-bold text-white">{holding.symbol}</span>
            <p className="text-[10px] text-zinc-500">
              {holding.quantity} shares @ {formatCurrency(holding.avgCostBasis)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-white font-medium">
        {currentPrice > 0 ? formatCurrency(currentPrice) : "—"}
      </td>
      <td className="px-4 py-4 text-sm text-white">
        {currentPrice > 0 ? formatCurrency(marketValue) : "—"}
      </td>
      <td className="px-4 py-4">
        {currentPrice > 0 ? (
          <div>
            <div className={cn("text-sm font-bold", getChangeColor(pnl))}>
              {pnl >= 0 ? "+" : ""}
              {formatCurrency(pnl)}
            </div>
            <span className={cn("text-xs", getChangeColor(pnlPercent))}>
              {formatPercent(pnlPercent)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-zinc-500">—</span>
        )}
      </td>
      <td className="px-4 py-4">
        {quote ? (
          <div className="flex items-center gap-1.5">
            {dayChangePercent >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span className={cn("text-sm font-medium", getChangeColor(dayChangePercent))}>
              {formatPercent(dayChangePercent)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-zinc-500">—</span>
        )}
      </td>
      <td className="px-4 py-4">
        <button
          onClick={() => onDelete(holding.id)}
          className="rounded-lg p-1.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

export default function PortfolioPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: "",
    quantity: "",
    avgCost: "",
    date: "",
    broker: "Robinhood",
  });
  const [submitting, setSubmitting] = useState(false);
  const { holdings, isLoading, mutate } = usePortfolio();

  const holdingsList = holdings ?? [];
  const totalCost = holdingsList.reduce((s, h) => s + h.avgCostBasis * h.quantity, 0);

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: formData.symbol.toUpperCase(),
          quantity: parseFloat(formData.quantity),
          avgCostBasis: parseFloat(formData.avgCost),
          purchaseDate: formData.date || new Date().toISOString(),
        }),
      });
      if (res.ok) {
        toast.success(`${formData.symbol.toUpperCase()} added to your positions`);
        setFormData({ symbol: "", quantity: "", avgCost: "", date: "", broker: "Robinhood" });
        setShowAddForm(false);
        mutate();
      } else {
        toast.error("Failed to add position. Try again.");
      }
    } catch {
      toast.error("Failed to add position. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
      toast.success("Position removed");
      mutate();
    } catch {
      toast.error("Failed to remove position");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-blue-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/5 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">My Positions</h1>
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Log what you own on your broker — we&apos;ll track live prices and alert you when to act
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
              showAddForm
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
            )}
          >
            {showAddForm ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Position
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Holding Form */}
      {showAddForm && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 animate-in">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              Log a Position from Your Broker
            </h3>
          </div>
          <form onSubmit={handleAddHolding} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Ticker Symbol
              </label>
              <input
                type="text"
                placeholder="e.g. AAPL"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Shares
              </label>
              <input
                type="number"
                placeholder="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Avg Cost per Share
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="150.00"
                value={formData.avgCost}
                onChange={(e) => setFormData({ ...formData, avgCost: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
              >
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mx-auto" />
                ) : (
                  "Add Position"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Positions"
          value={`${holdingsList.length}`}
          description={holdingsList.length === 0 ? "Add your first position" : "Active positions logged"}
          icon={PieChart}
          iconColor="text-purple-500 bg-purple-500/10"
        />
        <StatCard
          title="Cost Basis"
          value={formatCurrency(totalCost)}
          description="Total invested on broker"
          icon={DollarSign}
          iconColor="text-emerald-500 bg-emerald-500/10"
        />
        <StatCard
          title="Symbols"
          value={holdingsList.length > 0 ? holdingsList.map((h) => h.symbol).slice(0, 4).join(", ") + (holdingsList.length > 4 ? ` +${holdingsList.length - 4}` : "") : "—"}
          description="Your tracked stocks"
          icon={BarChart3}
          iconColor="text-blue-500 bg-blue-500/10"
        />
        <StatCard
          title="Market Status"
          value={isLoading ? "Loading..." : "Live"}
          description="Real-time quotes active"
          icon={TrendingUp}
          iconColor="text-amber-500 bg-amber-500/10"
        />
      </div>

      {/* Charts */}
      {holdingsList.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-white">Portfolio Value</h3>
            </div>
            <PortfolioChart />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-white">Allocation</h3>
            </div>
            <AllocationChart holdings={holdingsList} />
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-white">Your Holdings</h3>
          </div>
          {holdingsList.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <ExternalLink className="h-3 w-3" />
              Prices from Finnhub
            </div>
          )}
        </div>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
              <p className="text-sm text-zinc-500">Loading positions...</p>
            </div>
          </div>
        ) : holdingsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50 mb-4">
              <Briefcase className="h-8 w-8 text-zinc-600" />
            </div>
            <p className="text-sm font-semibold text-zinc-400">No positions logged yet</p>
            <p className="text-xs mt-1 text-zinc-600 max-w-xs text-center">
              Add the stocks you own on Robinhood, Webull, or any broker to start getting AI alerts
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add First Position
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left">
                  <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Price
                  </th>
                  <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Market Value
                  </th>
                  <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    P&L
                  </th>
                  <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Today
                  </th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {holdingsList.map((h) => (
                  <HoldingRow key={h.id} holding={h} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
