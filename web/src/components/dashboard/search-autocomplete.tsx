"use client";

import { useState, useRef, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, Clock, X } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  type: "stock" | "page";
  href: string;
}

const popularStocks: SearchResult[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 234.56, change: 1.39, type: "stock", href: "/signals?symbol=AAPL" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 142.89, change: 4.13, type: "stock", href: "/signals?symbol=NVDA" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 387.45, change: -2.25, type: "stock", href: "/signals?symbol=TSLA" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 428.12, change: -0.54, type: "stock", href: "/signals?symbol=MSFT" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 218.34, change: 0.72, type: "stock", href: "/signals?symbol=AMZN" },
  { symbol: "META", name: "Meta Platforms", price: 612.45, change: 2.06, type: "stock", href: "/signals?symbol=META" },
  { symbol: "GOOG", name: "Alphabet Inc.", price: 185.23, change: 0.48, type: "stock", href: "/signals?symbol=GOOG" },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 178.90, change: 3.21, type: "stock", href: "/signals?symbol=AMD" },
];

const pages: SearchResult[] = [
  { symbol: "", name: "Dashboard", price: 0, change: 0, type: "page", href: "/dashboard" },
  { symbol: "", name: "My Positions", price: 0, change: 0, type: "page", href: "/portfolio" },
  { symbol: "", name: "AI Signals", price: 0, change: 0, type: "page", href: "/signals" },
  { symbol: "", name: "Price Alerts", price: 0, change: 0, type: "page", href: "/price-alerts" },
  { symbol: "", name: "Earnings Calendar", price: 0, change: 0, type: "page", href: "/earnings" },
  { symbol: "", name: "Stock Comparison", price: 0, change: 0, type: "page", href: "/compare" },
  { symbol: "", name: "Leaderboard", price: 0, change: 0, type: "page", href: "/leaderboard" },
  { symbol: "", name: "Settings", price: 0, change: 0, type: "page", href: "/settings" },
];

export function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? [
        ...popularStocks.filter(
          (s) =>
            s.symbol.toLowerCase().includes(query.toLowerCase()) ||
            s.name.toLowerCase().includes(query.toLowerCase())
        ),
        ...pages.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
      ]
    : [];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      window.location.href = results[selectedIndex].href;
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search stocks, pages..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 py-2 pl-9 pr-16 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => { setQuery(""); setIsOpen(false); }}
              className="rounded p-0.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-zinc-700 bg-zinc-800 px-1.5 text-[10px] text-zinc-500">
            {typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent) ? "⌘" : "Ctrl+"}K
          </kbd>
        </div>
      </div>

      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="mx-auto h-6 w-6 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-500">No results for &quot;{query}&quot;</p>
            </div>
          ) : (
            <>
              {results.filter((r) => r.type === "stock").length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Stocks
                  </p>
                  {results
                    .filter((r) => r.type === "stock")
                    .map((result, idx) => (
                      <Link
                        key={result.symbol}
                        href={result.href}
                        onClick={() => { setIsOpen(false); setQuery(""); }}
                        className={`flex items-center justify-between px-4 py-2.5 transition-colors ${
                          selectedIndex === idx ? "bg-zinc-800" : "hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-white">
                            {result.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{result.symbol}</p>
                            <p className="text-xs text-zinc-500">{result.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">${result.price.toFixed(2)}</p>
                          <p className={`text-xs flex items-center gap-0.5 justify-end ${result.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {result.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {result.change >= 0 ? "+" : ""}{result.change.toFixed(2)}%
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
              {results.filter((r) => r.type === "page").length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Pages
                  </p>
                  {results
                    .filter((r) => r.type === "page")
                    .map((result) => (
                      <Link
                        key={result.href}
                        href={result.href}
                        onClick={() => { setIsOpen(false); setQuery(""); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/50 transition-colors"
                      >
                        <Clock className="h-4 w-4 text-zinc-500" />
                        <span className="text-sm text-zinc-300">{result.name}</span>
                      </Link>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
