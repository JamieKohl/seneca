"use client";

import { useState } from "react";
import { Plus, TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { PortfolioChart } from "@/components/charts/portfolio-chart";
import { AllocationChart } from "@/components/charts/allocation-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  cn,
  formatCurrency,
  formatPercent,
  getChangeColor,
} from "@/lib/utils";
import { DollarSign, BarChart3, PieChart } from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useStockQuote } from "@/hooks/useStockQuote";

function HoldingRow({ holding }: { holding: { symbol: string; quantity: number; avgCostBasis: number } }) {
  const { quote } = useStockQuote(holding.symbol);
  const currentPrice = quote?.price ?? 0;
  const marketValue = currentPrice * holding.quantity;
  const totalCost = holding.avgCostBasis * holding.quantity;
  const pnl = marketValue - totalCost;
  const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  const dayChangePercent = quote?.changePercent ?? 0;

  return (
    <tr className="hover:bg-zinc-800/50">
      <td className="px-4 py-3">
        <span className="font-semibold text-white">{holding.symbol}</span>
      </td>
      <td className="px-4 py-3 text-sm text-zinc-300">
        {holding.quantity}
      </td>
      <td className="px-4 py-3 text-sm text-zinc-300">
        {formatCurrency(holding.avgCostBasis)}
      </td>
      <td className="px-4 py-3 text-sm text-white font-medium">
        {currentPrice > 0 ? formatCurrency(currentPrice) : "—"}
      </td>
      <td className="px-4 py-3 text-sm text-white">
        {currentPrice > 0 ? formatCurrency(marketValue) : "—"}
      </td>
      <td className="px-4 py-3">
        {currentPrice > 0 ? (
          <div className={cn("text-sm font-medium", getChangeColor(pnl))}>
            {formatCurrency(pnl)}
            <span className="ml-1 text-xs">
              ({formatPercent(pnlPercent)})
            </span>
          </div>
        ) : (
          <span className="text-sm text-zinc-500">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {quote ? (
          <div className="flex items-center gap-1">
            {dayChangePercent >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn("text-sm", getChangeColor(dayChangePercent))}>
              {formatPercent(dayChangePercent)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-zinc-500">—</span>
        )}
      </td>
    </tr>
  );
}

export default function PortfolioPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ symbol: "", quantity: "", avgCost: "", date: "" });
  const [submitting, setSubmitting] = useState(false);
  const { holdings, isLoading, mutate } = usePortfolio();

  const holdingsList = holdings ?? [];

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
        setFormData({ symbol: "", quantity: "", avgCost: "", date: "" });
        setShowAddForm(false);
        mutate();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-sm text-zinc-400">
            Track your holdings and performance
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Holding
        </button>
      </div>

      {/* Add Holding Form */}
      {showAddForm && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Add New Holding
          </h3>
          <form onSubmit={handleAddHolding} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Symbol</label>
              <input
                type="text"
                placeholder="AAPL"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Quantity</label>
              <input
                type="number"
                placeholder="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Avg Cost</label>
              <input
                type="number"
                step="0.01"
                placeholder="150.00"
                value={formData.avgCost}
                onChange={(e) => setFormData({ ...formData, avgCost: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-zinc-400">Purchase Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Holdings"
          value={`${holdingsList.length}`}
          description={holdingsList.length === 0 ? "Add your first holding" : "Active positions"}
          icon={PieChart}
        />
        <StatCard
          title="Positions"
          value={holdingsList.length > 0 ? holdingsList.map(h => h.symbol).join(", ") : "—"}
          description="Your symbols"
          icon={BarChart3}
        />
        <StatCard
          title="Total Cost Basis"
          value={formatCurrency(holdingsList.reduce((s, h) => s + h.avgCostBasis * h.quantity, 0))}
          icon={DollarSign}
        />
        <StatCard
          title="Status"
          value={isLoading ? "Loading..." : "Live"}
          description="Real-time quotes"
          icon={TrendingUp}
        />
      </div>

      {/* Charts - only show if there are holdings */}
      {holdingsList.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Portfolio Value
            </h3>
            <PortfolioChart />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Allocation</h3>
            <AllocationChart holdings={holdingsList} />
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="border-b border-zinc-800 p-4">
          <h3 className="text-lg font-semibold text-white">Holdings</h3>
        </div>
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
          </div>
        ) : holdingsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <Briefcase className="h-12 w-12 mb-3 text-zinc-700" />
            <p className="text-sm font-medium">No holdings yet</p>
            <p className="text-xs mt-1">Click "Add Holding" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs font-medium uppercase text-zinc-500">
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Avg Cost</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Market Value</th>
                  <th className="px-4 py-3">P&L</th>
                  <th className="px-4 py-3">Day Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {holdingsList.map((h) => (
                  <HoldingRow key={h.id} holding={h} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
