"use client";

import { useState } from "react";
import {
  Eye,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Zap,
  Search,
  Star,
} from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency, formatPercent, getChangeColor } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useStockQuote } from "@/hooks/useStockQuote";
import { toast } from "@/components/ui/toast";

const POPULAR_STOCKS = [
  "NVDA",
  "META",
  "AMD",
  "NFLX",
  "DIS",
  "PYPL",
  "BA",
  "JPM",
  "V",
  "WMT",
];

function WatchlistStockRow({
  symbol,
  onSelect,
  onRemove,
}: {
  symbol: string;
  onSelect: (s: string) => void;
  onRemove: (s: string) => void;
}) {
  const { quote, isLoading } = useStockQuote(symbol);
  const isUp = !quote || quote.change >= 0;

  return (
    <div className="group flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all">
      <button
        onClick={() => onSelect(symbol)}
        className="flex items-center gap-3 text-left flex-1"
      >
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold",
            isUp
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          )}
        >
          {symbol.slice(0, 2)}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{symbol}</p>
          <p className="text-xs text-zinc-500">
            {isLoading
              ? "Loading..."
              : quote
              ? formatCurrency(quote.price)
              : "No data"}
          </p>
        </div>
      </button>

      <div className="flex items-center gap-3">
        {/* Price change */}
        {!isLoading && quote && (
          <div className="flex items-center gap-1.5 text-right">
            {isUp ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            )}
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  getChangeColor(quote.change)
                )}
              >
                {formatPercent(quote.changePercent)}
              </p>
              <p className="text-[10px] text-zinc-600">
                {quote.change >= 0 ? "+" : ""}
                {formatCurrency(quote.change)}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <Link
          href="/signals"
          className="hidden sm:flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          <Zap className="h-3 w-3" />
          Signal
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(symbol);
          }}
          className="rounded-lg p-1.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function WatchlistPage() {
  const {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    setSelectedSymbol,
  } = useStore();
  const [addInput, setAddInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (symbol: string) => {
    const upper = symbol.trim().toUpperCase();
    if (upper && !watchlist.includes(upper)) {
      addToWatchlist(upper);
      toast.success(`${upper} added to watchlist`);
    }
    setAddInput("");
    setShowAdd(false);
  };

  const suggestedStocks = POPULAR_STOCKS.filter(
    (s) => !watchlist.includes(s)
  ).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <Star className="h-24 w-24 text-indigo-500" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
              <Eye className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Watchlist</h1>
              <p className="text-sm text-zinc-400">
                {watchlist.length} stocks tracked with live prices
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              showAdd
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            )}
          >
            {showAdd ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Stock
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add stock form */}
      {showAdd && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 animate-in slide-in-from-top-2 duration-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd(addInput);
            }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={addInput}
                onChange={(e) => setAddInput(e.target.value)}
                placeholder="Enter stock symbol (e.g. NVDA, META)..."
                autoFocus
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={!addInput.trim()}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors"
            >
              Add
            </button>
          </form>

          {/* Quick add suggestions */}
          {suggestedStocks.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-500">Popular:</span>
              {suggestedStocks.map((s) => (
                <button
                  key={s}
                  onClick={() => handleAdd(s)}
                  className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Watchlist */}
      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 py-16">
          <Eye className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-sm font-medium text-zinc-400">
            Your watchlist is empty
          </p>
          <p className="text-xs text-zinc-600 mt-1 mb-4">
            Add stocks to track their prices and get AI signals
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Stock
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {watchlist.map((symbol) => (
            <WatchlistStockRow
              key={symbol}
              symbol={symbol}
              onSelect={(s) => setSelectedSymbol(s)}
              onRemove={(s) => {
                removeFromWatchlist(s);
                toast.info(`${s} removed from watchlist`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
