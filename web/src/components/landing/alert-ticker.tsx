"use client";

const alerts = [
  { type: "Scam", severity: "HIGH", reason: "Phishing email blocked — fake PayPal password reset" },
  { type: "Subscription", severity: "SAVE", reason: "Unused Hulu subscription — save $17.99/mo" },
  { type: "Privacy", severity: "WARN", reason: "Spokeo re-listed your data — opt-out again" },
  { type: "Price", severity: "FLAG", reason: "Flight $120 higher than incognito price" },
  { type: "Scam", severity: "HIGH", reason: "IRS impersonation call detected — auto-blocked" },
  { type: "Subscription", severity: "SAVE", reason: "3 free trials expiring this week — cancel now" },
  { type: "Privacy", severity: "DONE", reason: "BeenVerified opt-out confirmed" },
  { type: "Scam", severity: "MED", reason: "Suspicious Amazon order text — likely smishing" },
];

const severityStyles: Record<string, string> = {
  HIGH: "text-red-400 bg-red-500/10 border-red-500/20",
  MED: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  SAVE: "text-blue-500 bg-blue-600/10 border-blue-600/20",
  WARN: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  FLAG: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  DONE: "text-green-400 bg-green-500/10 border-green-500/20",
};

export function AlertTicker() {
  const doubled = [...alerts, ...alerts];

  return (
    <div className="relative overflow-hidden border-y border-zinc-800 bg-zinc-900/30 py-4">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-zinc-950 to-transparent" />

      <div className="flex animate-[scroll_30s_linear_infinite] gap-6 whitespace-nowrap">
        {doubled.map((alert, i) => (
          <div
            key={`${alert.type}-${i}`}
            className="flex shrink-0 items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2"
          >
            <span className="text-sm font-bold text-white">{alert.type}</span>
            <span
              className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                severityStyles[alert.severity]
              }`}
            >
              {alert.severity}
            </span>
            <span className="text-xs text-zinc-400">{alert.reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
