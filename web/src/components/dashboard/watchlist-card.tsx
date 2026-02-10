"use client";

import { TrendingUp, TrendingDown, Plus, X } from "lucide-react";
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

  return (
    <div
      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-800/50 transition-colors"
      onClick={() => onSelect?.(symbol)}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            !quote || quote.change >= 0 ? "bg-green-500/10" : "bg-red-500/10"
          )}
        >
          {!quote || quote.change >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{symbol}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          {isLoading ? (
            <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
          ) : quote ? (
            <>
              <p className="text-sm font-medium text-white">
                {formatCurrency(quote.price)}
              </p>
              <p className={cn("text-xs font-medium", getChangeColor(quote.change))}>
                {formatPercent(quote.changePercent)}
              </p>
            </>
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
            className="rounded p-1 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300"
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
      <div className="flex items-center justify-between border-b border-zinc-800 p-4">
        <h3 className="font-semibold text-white">Watchlist</h3>
        <button
          onClick={onAdd}
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="divide-y divide-zinc-800">
        {watchlist.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-zinc-500">
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
