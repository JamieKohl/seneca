"use client";

import { useState } from "react";
import {
  GitCompareArrows,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Activity,
  Percent,
  X,
} from "lucide-react";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  marketCap: string;
  pe: number;
  eps: number;
  dividend: number;
  beta: number;
  week52High: number;
  week52Low: number;
  avgVolume: string;
  sector: string;
  dayReturn: number;
  weekReturn: number;
  monthReturn: number;
  ytdReturn: number;
  yearReturn: number;
}

const stockDatabase: Record<string, StockData> = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", price: 234.56, change: 3.21, changePct: 1.39, marketCap: "$3.6T", pe: 31.2, eps: 7.52, dividend: 0.51, beta: 1.21, week52High: 248.30, week52Low: 164.08, avgVolume: "54.3M", sector: "Technology", dayReturn: 1.39, weekReturn: 3.21, monthReturn: 8.45, ytdReturn: 12.34, yearReturn: 28.67 },
  MSFT: { symbol: "MSFT", name: "Microsoft Corp.", price: 428.12, change: -2.34, changePct: -0.54, marketCap: "$3.2T", pe: 35.8, eps: 11.96, dividend: 0.75, beta: 0.89, week52High: 445.67, week52Low: 362.12, avgVolume: "22.1M", sector: "Technology", dayReturn: -0.54, weekReturn: 1.87, monthReturn: 5.23, ytdReturn: 8.91, yearReturn: 22.45 },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corp.", price: 142.89, change: 5.67, changePct: 4.13, marketCap: "$3.5T", pe: 68.4, eps: 2.09, dividend: 0.01, beta: 1.68, week52High: 153.13, week52Low: 66.25, avgVolume: "312.5M", sector: "Technology", dayReturn: 4.13, weekReturn: 8.92, monthReturn: 15.34, ytdReturn: 22.56, yearReturn: 178.34 },
  TSLA: { symbol: "TSLA", name: "Tesla Inc.", price: 387.45, change: -8.92, changePct: -2.25, marketCap: "$1.2T", pe: 112.3, eps: 3.45, dividend: 0, beta: 2.05, week52High: 412.56, week52Low: 138.82, avgVolume: "98.7M", sector: "Consumer Cyclical", dayReturn: -2.25, weekReturn: -4.12, monthReturn: 12.89, ytdReturn: 45.67, yearReturn: 89.23 },
  AMZN: { symbol: "AMZN", name: "Amazon.com Inc.", price: 218.34, change: 1.56, changePct: 0.72, marketCap: "$2.3T", pe: 42.1, eps: 5.19, dividend: 0, beta: 1.15, week52High: 228.67, week52Low: 166.21, avgVolume: "45.8M", sector: "Consumer Cyclical", dayReturn: 0.72, weekReturn: 2.34, monthReturn: 6.78, ytdReturn: 15.23, yearReturn: 34.56 },
  GOOG: { symbol: "GOOG", name: "Alphabet Inc.", price: 185.23, change: 0.89, changePct: 0.48, marketCap: "$2.3T", pe: 24.6, eps: 7.53, dividend: 0.20, beta: 1.05, week52High: 192.45, week52Low: 145.67, avgVolume: "24.3M", sector: "Technology", dayReturn: 0.48, weekReturn: 1.23, monthReturn: 4.56, ytdReturn: 10.89, yearReturn: 26.78 },
  META: { symbol: "META", name: "Meta Platforms", price: 612.45, change: 12.34, changePct: 2.06, marketCap: "$1.6T", pe: 28.3, eps: 21.64, dividend: 0.50, beta: 1.32, week52High: 638.40, week52Low: 414.50, avgVolume: "18.9M", sector: "Technology", dayReturn: 2.06, weekReturn: 5.67, monthReturn: 9.23, ytdReturn: 18.45, yearReturn: 52.34 },
  JPM: { symbol: "JPM", name: "JPMorgan Chase", price: 248.67, change: -1.23, changePct: -0.49, marketCap: "$710B", pe: 12.8, eps: 19.43, dividend: 4.60, beta: 1.08, week52High: 258.34, week52Low: 186.45, avgVolume: "9.8M", sector: "Financial Services", dayReturn: -0.49, weekReturn: 0.89, monthReturn: 3.45, ytdReturn: 7.23, yearReturn: 18.56 },
};

const suggestedPairs = [
  ["AAPL", "MSFT"], ["NVDA", "TSLA"], ["AMZN", "META"], ["GOOG", "JPM"],
];

const AVAILABLE = Object.keys(stockDatabase);

export default function ComparePage() {
  const [stocks, setStocks] = useState<string[]>(["AAPL", "NVDA"]);
  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const addStock = (symbol: string) => {
    if (stocks.length < 4 && !stocks.includes(symbol)) {
      setStocks([...stocks, symbol]);
    }
    setSearchInput("");
    setShowSearch(false);
  };

  const removeStock = (symbol: string) => {
    setStocks(stocks.filter((s) => s !== symbol));
  };

  const filteredSuggestions = AVAILABLE.filter(
    (s) => s.includes(searchInput.toUpperCase()) && !stocks.includes(s)
  );

  const data = stocks.map((s) => stockDatabase[s]).filter(Boolean);

  const metrics: { label: string; key: keyof StockData; icon: React.ElementType; format: (v: StockData[keyof StockData]) => string; highlight?: boolean }[] = [
    { label: "Price", key: "price", icon: DollarSign, format: (v) => `$${Number(v).toFixed(2)}` },
    { label: "Day Change", key: "changePct", icon: Activity, format: (v) => `${Number(v) > 0 ? "+" : ""}${Number(v).toFixed(2)}%`, highlight: true },
    { label: "Market Cap", key: "marketCap", icon: BarChart3, format: (v) => String(v) },
    { label: "P/E Ratio", key: "pe", icon: Percent, format: (v) => Number(v).toFixed(1) },
    { label: "EPS", key: "eps", icon: DollarSign, format: (v) => `$${Number(v).toFixed(2)}` },
    { label: "Dividend Yield", key: "dividend", icon: DollarSign, format: (v) => `${Number(v).toFixed(2)}%` },
    { label: "Beta", key: "beta", icon: Activity, format: (v) => Number(v).toFixed(2) },
    { label: "52W High", key: "week52High", icon: TrendingUp, format: (v) => `$${Number(v).toFixed(2)}` },
    { label: "52W Low", key: "week52Low", icon: TrendingDown, format: (v) => `$${Number(v).toFixed(2)}` },
    { label: "Avg Volume", key: "avgVolume", icon: BarChart3, format: (v) => String(v) },
    { label: "Sector", key: "sector", icon: BarChart3, format: (v) => String(v) },
  ];

  const returnPeriods: { label: string; key: keyof StockData }[] = [
    { label: "1D", key: "dayReturn" },
    { label: "1W", key: "weekReturn" },
    { label: "1M", key: "monthReturn" },
    { label: "YTD", key: "ytdReturn" },
    { label: "1Y", key: "yearReturn" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-cyan-500/10 via-zinc-900 to-zinc-900 p-6">
        <GitCompareArrows className="absolute -right-4 -top-4 h-32 w-32 text-cyan-500/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">Stock Comparison</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Compare up to 4 stocks side by side with key metrics and returns
          </p>
        </div>
      </div>

      {/* Stock selector */}
      <div className="flex flex-wrap items-center gap-3">
        {stocks.map((s) => (
          <div
            key={s}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2"
          >
            <span className="text-sm font-bold text-white">{s}</span>
            <span className="text-xs text-zinc-500">{stockDatabase[s]?.name}</span>
            <button onClick={() => removeStock(s)} className="ml-1 text-zinc-500 hover:text-red-400 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {stocks.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-700 px-3 py-2 text-xs text-zinc-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              Add Stock
            </button>
            {showSearch && (
              <div className="absolute left-0 top-full z-10 mt-2 w-56 rounded-lg border border-zinc-700 bg-zinc-900 p-2 shadow-xl">
                <input
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                  placeholder="Search symbol..."
                  className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none border border-zinc-700 focus:border-cyan-500/50 mb-2"
                />
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {filteredSuggestions.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => addStock(sym)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      <span className="font-medium">{sym}</span>
                      <span className="text-xs text-zinc-500">{stockDatabase[sym]?.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggested pairs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">Quick compare:</span>
        {suggestedPairs.map(([a, b]) => (
          <button
            key={`${a}-${b}`}
            onClick={() => setStocks([a, b])}
            className="rounded-md bg-zinc-800/50 px-2.5 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-colors border border-zinc-700/50"
          >
            {a} vs {b}
          </button>
        ))}
      </div>

      {data.length < 2 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
          <GitCompareArrows className="mx-auto h-10 w-10 text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400">Select at least 2 stocks to compare</p>
        </div>
      ) : (
        <>
          {/* Returns comparison */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Return Comparison</h3>
            <div className="space-y-3">
              {returnPeriods.map((period) => (
                <div key={period.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-zinc-500">{period.label}</span>
                    <div className="flex gap-4">
                      {data.map((stock) => {
                        const val = Number(stock[period.key]);
                        return (
                          <span
                            key={stock.symbol}
                            className={`text-xs font-medium ${val >= 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {stock.symbol}: {val > 0 ? "+" : ""}{val.toFixed(2)}%
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-1 h-2">
                    {data.map((stock) => {
                      const val = Number(stock[period.key]);
                      const maxAbs = Math.max(...data.map((d) => Math.abs(Number(d[period.key]))));
                      const width = maxAbs > 0 ? (Math.abs(val) / maxAbs) * 100 : 0;
                      return (
                        <div key={stock.symbol} className="flex-1 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${val >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
                            style={{ width: `${Math.max(width, 4)}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              {data.map((stock, i) => (
                <span key={stock.symbol} className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <span className={`h-2 w-2 rounded-full ${
                    i === 0 ? "bg-cyan-500" : i === 1 ? "bg-violet-500" : i === 2 ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  {stock.symbol}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics table */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-5 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Metric</th>
                    {data.map((stock) => (
                      <th key={stock.symbol} className="px-5 py-3 text-right text-xs font-bold text-white uppercase tracking-wide">
                        {stock.symbol}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, idx) => {
                    const values = data.map((d) => Number(d[metric.key]));
                    const best = metric.highlight
                      ? Math.max(...values)
                      : undefined;

                    return (
                      <tr key={metric.key} className={idx % 2 === 0 ? "bg-zinc-800/20" : ""}>
                        <td className="px-5 py-3 text-zinc-400 flex items-center gap-2">
                          <metric.icon className="h-3.5 w-3.5 text-zinc-600" />
                          {metric.label}
                        </td>
                        {data.map((stock) => {
                          const val = stock[metric.key];
                          const isBest = metric.highlight && Number(val) === best;
                          return (
                            <td
                              key={stock.symbol}
                              className={`px-5 py-3 text-right font-medium ${
                                metric.highlight
                                  ? Number(val) >= 0
                                    ? isBest ? "text-emerald-400" : "text-emerald-400/70"
                                    : "text-red-400"
                                  : "text-white"
                              }`}
                            >
                              {metric.format(val)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
