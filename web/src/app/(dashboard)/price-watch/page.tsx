"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Loader2,
  Eye,
  Globe,
  Shield,
  Lightbulb,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface PriceSnapshot {
  price: number;
  context: string;
  timestamp: string;
}

interface PriceWatch {
  id: string;
  productName: string;
  productUrl: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  notes?: string;
  flagged: boolean;
  priceSnapshots: PriceSnapshot[];
  createdAt: string;
}

export default function PriceWatchPage() {
  const [watches, setWatches] = useState<PriceWatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [snapshotFormId, setSnapshotFormId] = useState<string | null>(null);
  const [snapshotPrice, setSnapshotPrice] = useState("");
  const [snapshotContext, setSnapshotContext] = useState("");
  const [form, setForm] = useState({
    productName: "",
    productUrl: "",
    currentPrice: "",
    notes: "",
  });

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    try {
      const res = await fetch("/api/price-watch");
      if (res.ok) {
        const data = await res.json();
        setWatches(data);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/price-watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.productName,
          productUrl: form.productUrl,
          currentPrice: parseFloat(form.currentPrice),
          notes: form.notes || undefined,
        }),
      });
      if (res.ok) {
        const newWatch = await res.json();
        setWatches((prev) => [newWatch, ...prev]);
        setForm({ productName: "", productUrl: "", currentPrice: "", notes: "" });
        setShowForm(false);
      }
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSnapshot = async (watchId: string) => {
    if (!snapshotPrice) return;
    try {
      const watch = watches.find((w) => w.id === watchId);
      if (!watch) return;

      const newSnapshot: PriceSnapshot = {
        price: parseFloat(snapshotPrice),
        context: snapshotContext || "Manual check",
        timestamp: new Date().toISOString(),
      };

      const updatedSnapshots = [...(watch.priceSnapshots || []), newSnapshot];
      const allPrices = updatedSnapshots.map((s) => s.price);
      const newLowest = Math.min(...allPrices, watch.lowestPrice);
      const newHighest = Math.max(...allPrices, watch.highestPrice);
      const priceDiff = newHighest - newLowest;
      const flagged = priceDiff > newLowest * 0.05;

      const res = await fetch("/api/price-watch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: watchId,
          currentPrice: parseFloat(snapshotPrice),
          flagged,
          priceSnapshots: updatedSnapshots,
        }),
      });

      if (res.ok) {
        setWatches((prev) =>
          prev.map((w) =>
            w.id === watchId
              ? {
                  ...w,
                  currentPrice: parseFloat(snapshotPrice),
                  lowestPrice: newLowest,
                  highestPrice: newHighest,
                  flagged,
                  priceSnapshots: updatedSnapshots,
                }
              : w
          )
        );
        setSnapshotFormId(null);
        setSnapshotPrice("");
        setSnapshotContext("");
      }
    } catch {
      // silently fail
    }
  };

  const truncateUrl = (url: string, maxLength = 40) => {
    try {
      const parsed = new URL(url);
      const display = parsed.hostname + parsed.pathname;
      return display.length > maxLength
        ? display.slice(0, maxLength) + "..."
        : display;
    } catch {
      return url.length > maxLength ? url.slice(0, maxLength) + "..." : url;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-blue-600/20 bg-gradient-to-r from-blue-600/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <Shield className="h-24 w-24 text-blue-600" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
              <Search className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wider">PRICE MANIPULATION MONITOR</h1>
              <p className="text-sm text-zinc-400">
                Monitor products for price discrimination
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              showForm
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "bg-blue-700 text-white hover:bg-blue-600"
            )}
          >
            {showForm ? (
              <>
                <Eye className="h-4 w-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Add Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-blue-600/20 bg-blue-600/5 p-5 animate-in slide-in-from-top-2 duration-200"
        >
          <h3 className="text-sm font-semibold text-white mb-4">
            Add Product to Monitor
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Product Name
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) =>
                  setForm({ ...form, productName: e.target.value })
                }
                placeholder="e.g., Nike Air Max 90"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Product URL
              </label>
              <input
                type="url"
                value={form.productUrl}
                onChange={(e) =>
                  setForm({ ...form, productUrl: e.target.value })
                }
                placeholder="https://example.com/product"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Current Price You See
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.currentPrice}
                onChange={(e) =>
                  setForm({ ...form, currentPrice: e.target.value })
                }
                placeholder="99.99"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Notes (optional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional context..."
                rows={1}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none resize-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={
                !form.productName || !form.productUrl || !form.currentPrice || isSubmitting
              }
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-40 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Product
            </button>
          </div>
        </form>
      )}

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-medium text-zinc-400">
              Monitoring
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{watches.length}</p>
          <p className="text-xs text-zinc-600">Products tracked</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs font-medium text-zinc-400">Flagged</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {watches.filter((w) => w.flagged).length}
          </p>
          <p className="text-xs text-zinc-600">Possible price discrimination</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-zinc-400">
              Snapshots
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {watches.reduce(
              (acc, w) => acc + (w.priceSnapshots?.length || 0),
              0
            )}
          </p>
          <p className="text-xs text-zinc-600">Total price observations</p>
        </div>
      </div>

      {/* Monitored Products */}
      {watches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 py-16">
          <Shield className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-sm font-medium text-zinc-400">
            No products being monitored
          </p>
          <p className="text-xs text-zinc-600 mt-1 mb-4">
            Add a product to start tracking price differences
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {watches.map((watch) => {
            const priceDiff = watch.highestPrice - watch.lowestPrice;
            const priceDiffPercent =
              watch.lowestPrice > 0
                ? ((priceDiff / watch.lowestPrice) * 100).toFixed(1)
                : "0.0";

            return (
              <div
                key={watch.id}
                className={cn(
                  "rounded-xl border bg-zinc-900/50 overflow-hidden transition-colors",
                  watch.flagged
                    ? "border-red-500/30"
                    : "border-zinc-800 hover:border-zinc-700"
                )}
              >
                {/* Flagged Banner */}
                {watch.flagged && (
                  <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 border-b border-red-500/20">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-xs font-semibold text-red-400">
                      Price Discrimination Detected
                    </span>
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* Product Name & URL */}
                  <div>
                    <h3 className="text-sm font-bold text-white truncate">
                      {watch.productName}
                    </h3>
                    <a
                      href={watch.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-500 transition-colors mt-0.5"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {truncateUrl(watch.productUrl)}
                      </span>
                    </a>
                  </div>

                  {/* Prices */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-zinc-800/50 p-2 text-center">
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                        Current
                      </p>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {formatCurrency(watch.currentPrice)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-zinc-800/50 p-2 text-center">
                      <p className="text-[10px] font-medium text-blue-600 uppercase tracking-wider flex items-center justify-center gap-0.5">
                        <TrendingDown className="h-2.5 w-2.5" />
                        Lowest
                      </p>
                      <p className="text-sm font-bold text-blue-500 mt-0.5">
                        {formatCurrency(watch.lowestPrice)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-zinc-800/50 p-2 text-center">
                      <p className="text-[10px] font-medium text-red-500 uppercase tracking-wider flex items-center justify-center gap-0.5">
                        <TrendingUp className="h-2.5 w-2.5" />
                        Highest
                      </p>
                      <p className="text-sm font-bold text-red-400 mt-0.5">
                        {formatCurrency(watch.highestPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Price Spread Indicator */}
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                        Price Spread
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold",
                          watch.flagged ? "text-red-400" : "text-zinc-400"
                        )}
                      >
                        {formatCurrency(priceDiff)} ({priceDiffPercent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          watch.flagged
                            ? "bg-gradient-to-r from-amber-500 to-red-500"
                            : "bg-blue-600/60"
                        )}
                        style={{
                          width: `${Math.min(parseFloat(priceDiffPercent) * 4, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Snapshots Count */}
                  {watch.priceSnapshots && watch.priceSnapshots.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Globe className="h-3 w-3" />
                      <span>
                        {watch.priceSnapshots.length} price snapshot
                        {watch.priceSnapshots.length !== 1 ? "s" : ""} recorded
                      </span>
                    </div>
                  )}

                  {/* Add Snapshot */}
                  {snapshotFormId === watch.id ? (
                    <div className="space-y-2 rounded-lg border border-blue-600/20 bg-blue-600/5 p-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={snapshotPrice}
                        onChange={(e) => setSnapshotPrice(e.target.value)}
                        placeholder="Price observed"
                        autoFocus
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
                      />
                      <select
                        value={snapshotContext}
                        onChange={(e) => setSnapshotContext(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-blue-600 focus:outline-none"
                      >
                        <option value="">Select context...</option>
                        <option value="Incognito mode">Incognito mode</option>
                        <option value="Different device">
                          Different device
                        </option>
                        <option value="VPN">VPN</option>
                        <option value="Cleared cookies">
                          Cleared cookies
                        </option>
                        <option value="Mobile browser">Mobile browser</option>
                        <option value="Desktop browser">Desktop browser</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddSnapshot(watch.id)}
                          disabled={!snapshotPrice}
                          className="flex-1 rounded-lg bg-blue-700 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-40 transition-colors"
                        >
                          Save Snapshot
                        </button>
                        <button
                          onClick={() => {
                            setSnapshotFormId(null);
                            setSnapshotPrice("");
                            setSnapshotContext("");
                          }}
                          className="rounded-lg bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSnapshotFormId(watch.id)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs font-medium text-zinc-400 hover:border-blue-600/50 hover:text-blue-500 hover:bg-blue-600/5 transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                      Add Price Snapshot
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
            <Lightbulb className="h-4 w-4 text-amber-400" />
          </div>
          <h2 className="text-sm font-bold text-white">
            How to Check for Price Discrimination
          </h2>
        </div>
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800">
              <Eye className="h-3 w-3 text-zinc-400" />
            </div>
            <span className="text-sm text-zinc-400">
              Check prices in incognito/private mode to avoid cookie-based
              pricing
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800">
              <DollarSign className="h-3 w-3 text-zinc-400" />
            </div>
            <span className="text-sm text-zinc-400">
              Compare across different devices (phone, tablet, laptop) for
              device-based pricing
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800">
              <Globe className="h-3 w-3 text-zinc-400" />
            </div>
            <span className="text-sm text-zinc-400">
              Use a VPN to check from different locations to detect
              geo-based pricing
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800">
              <Shield className="h-3 w-3 text-zinc-400" />
            </div>
            <span className="text-sm text-zinc-400">
              Clear cookies before checking to eliminate tracking-based price
              adjustments
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
