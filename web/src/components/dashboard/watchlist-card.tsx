"use client";

import { TrendingUp, TrendingDown, Plus, X, Eye } from "lucide-react";
import { cn, formatCurrency, formatPercent, getChangeColor } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useStockQuote } from "@/hooks/useStockQuote";

interface WatchlistCardProps {
  onRemove?: (symbol: string) => void;
  onAdd?: () => void;
  onSelect?: (symbol: string) => void;
}

function WatchlistRow({ symbol, onSelect, onRemove }: { symbol: string; onSelect?: (s: string) => void; onRemove?: (s: string) => void }) {
  const { quote, isLoading } = useStockQuote(symbol);
  const isUp = !quote || quote.change >= 0;

  return (
    <div
      className="group flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-800/50 transition-colors"
      onClick={() => onSelect?.(symbol)}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold",
            isUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}
        >
          {symbol.slice(0, 2)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{symbol}</p>
          <p className="text-xs text-zinc-500">
            {isLoading ? "Loading..." : quote ? formatCurrency(quote.price) : "—"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          {isLoading ? (
            <div className="h-4 w-14 animate-pulse rounded bg-zinc-800" />
          ) : quote ? (
            <div className="flex items-center gap-1">
              {isUp ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={cn("text-sm font-medium", getChangeColor(quote.change))}>
                {formatPercent(quote.changePercent)}
              </span>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">—</p>
          )}
        </div>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(symbol);
            }}
            className="rounded p-1 text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-zinc-700 hover:text-zinc-300 transition-all"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function WatchlistCard({
  onRemove,
  onAdd,
  onSelect,
}: WatchlistCardProps) {
  const { watchlist } = useStore();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-white">Watchlist</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">{watchlist.length} stocks</span>
          <button
            onClick={onAdd}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-zinc-800/50">
        {watchlist.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-500">
            No stocks in watchlist
          </div>
        ) : (
          watchlist.map((symbol) => (
            <WatchlistRow
              key={symbol}
              symbol={symbol}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
}
