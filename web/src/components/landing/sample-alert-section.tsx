"use client";

import { ArrowUpCircle, ArrowDownCircle, MinusCircle, Bell } from "lucide-react";

const sampleAlerts = [
  {
    symbol: "TSLA",
    action: "BUY" as const,
    message: "Tesla announced Robotaxi launch date — go buy on Robinhood now",
    profit: "+$1,240 est. profit",
    confidence: 88,
    time: "2 min ago",
  },
  {
    symbol: "AMZN",
    action: "SELL" as const,
    message: "Amazon hit 52-week high, RSI overbought — sell on your broker and take profits",
    profit: "+$890 if you sell now",
    confidence: 79,
    time: "14 min ago",
  },
  {
    symbol: "NVDA",
    action: "HOLD" as const,
    message: "NVIDIA earnings next week — hold your position, don't sell yet",
    profit: "Wait for +$2,100 potential",
    confidence: 91,
    time: "1 hr ago",
  },
];

const actionConfig = {
  BUY: { icon: ArrowUpCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  SELL: { icon: ArrowDownCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  HOLD: { icon: MinusCircle, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
};

export function SampleAlertSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Alerts That Tell You Exactly What to Do
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Real examples of what you&apos;ll see in your dashboard.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {sampleAlerts.map((alert) => {
            const config = actionConfig[alert.action];
            const Icon = config.icon;
            return (
              <div
                key={alert.symbol}
                className={`rounded-xl border ${config.border} bg-zinc-900/80 p-5 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-1.5 ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <span className="text-lg font-bold text-white">{alert.symbol}</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${config.bg} ${config.color}`}>
                      {alert.action}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">{alert.time}</span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                  <span className="text-sm font-semibold text-emerald-400">
                    {alert.profit}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-16 rounded-full bg-zinc-800">
                      <div
                        className={`h-1.5 rounded-full ${
                          alert.action === "BUY"
                            ? "bg-green-500"
                            : alert.action === "SELL"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${alert.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{alert.confidence}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400">
            <Bell className="h-3.5 w-3.5 text-emerald-500" />
            These alerts are sent as push notifications too
          </div>
        </div>
      </div>
    </section>
  );
}
