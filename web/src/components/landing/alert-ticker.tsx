"use client";

const alerts = [
  { time: "14:32 EST", headline: "FTC reports 2.6M fraud complaints filed in latest period" },
  { time: "13:47 EST", headline: "Phishing attacks targeting bank customers up 34% this quarter" },
  { time: "12:15 EST", headline: "New data broker registry exposes 12M consumer records" },
  { time: "11:58 EST", headline: "FBI IC3 warns of surge in cryptocurrency investment fraud" },
  { time: "11:23 EST", headline: "Average consumer loses $133/mo to unused subscriptions" },
  { time: "10:41 EST", headline: "Identity theft complaints reach all-time high in 2024" },
  { time: "09:55 EST", headline: "Price discrimination detected across major e-commerce platforms" },
  { time: "09:12 EST", headline: "Romance scam losses exceed $1.3B annually, FTC reports" },
];

export function AlertTicker() {
  const doubled = [...alerts, ...alerts];

  return (
    <div className="relative overflow-hidden border-y border-zinc-800 bg-zinc-900/30 py-3">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-zinc-950 to-transparent" />

      {/* LIVE label */}
      <div className="absolute left-0 top-0 z-20 h-full flex items-center pl-4">
        <div className="flex items-center gap-2 rounded bg-red-600 px-3 py-1 shadow-lg shadow-red-600/20">
          <span className="h-2 w-2 rounded-full bg-white live-indicator" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            LIVE THREAT FEED
          </span>
        </div>
      </div>

      <div className="flex animate-[scroll_40s_linear_infinite] gap-8 whitespace-nowrap pl-48">
        {doubled.map((alert, i) => (
          <div
            key={`alert-${i}`}
            className="flex shrink-0 items-center gap-3"
          >
            <span className="text-[10px] font-bold text-red-400/70 font-data">
              [{alert.time}]
            </span>
            <span className="text-xs text-zinc-300 font-medium">
              {alert.headline}
            </span>
            <span className="text-zinc-700">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
