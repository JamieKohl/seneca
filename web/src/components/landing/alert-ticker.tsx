"use client";

const alerts = [
  { symbol: "AAPL", action: "BUY", est: "+8.2%", reason: "Strong earnings beat" },
  { symbol: "TSLA", action: "BUY", est: "+14.5%", reason: "New product launch incoming" },
  { symbol: "MSFT", action: "HOLD", est: "+2.1%", reason: "Steady growth, wait for dip" },
  { symbol: "NVDA", action: "BUY", est: "+11.3%", reason: "AI demand surge" },
  { symbol: "AMZN", action: "SELL", est: "-4.7%", reason: "Overbought, take profits" },
  { symbol: "GOOGL", action: "BUY", est: "+6.8%", reason: "Cloud revenue accelerating" },
  { symbol: "META", action: "HOLD", est: "+1.9%", reason: "Mixed signals, stay put" },
  { symbol: "JPM", action: "BUY", est: "+5.4%", reason: "Rate environment favorable" },
];

const actionStyles: Record<string, string> = {
  BUY: "text-green-400 bg-green-500/10 border-green-500/20",
  SELL: "text-red-400 bg-red-500/10 border-red-500/20",
  HOLD: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

export function AlertTicker() {
  // Double the alerts for seamless loop
  const doubled = [...alerts, ...alerts];

  return (
    <div className="relative overflow-hidden border-y border-zinc-800 bg-zinc-900/30 py-4">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-zinc-950 to-transparent" />

      <div className="flex animate-[scroll_30s_linear_infinite] gap-6 whitespace-nowrap">
        {doubled.map((alert, i) => (
          <div
            key={`${alert.symbol}-${i}`}
            className="flex shrink-0 items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2"
          >
            <span className="text-sm font-bold text-white">{alert.symbol}</span>
            <span
              className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                actionStyles[alert.action]
              }`}
            >
              {alert.action}
            </span>
            <span className="text-xs text-zinc-400">{alert.reason}</span>
            <span
              className={`text-xs font-semibold ${
                alert.action === "SELL" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {alert.est}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
