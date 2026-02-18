"use client";

import { ShieldAlert, CreditCard, UserX, Shield } from "lucide-react";

const sampleAlerts = [
  {
    type: "Scam Blocked",
    icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    message: "Blocked a phishing email pretending to be Chase Bank asking you to \"verify your account\" via a fake link.",
    saving: "Prevented potential $5,000+ loss",
    score: 95,
    time: "2 min ago",
  },
  {
    type: "Subscription Found",
    icon: CreditCard,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    message: "You haven't opened Adobe Creative Cloud in 4 months but you're still paying $54.99/mo. Cancel to save $660/yr.",
    saving: "Save $54.99/month",
    score: 82,
    time: "14 min ago",
  },
  {
    type: "Privacy Alert",
    icon: UserX,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    message: "WhitePages is publicly listing your home address, phone number, and relatives. We can help you opt out in 2 minutes.",
    saving: "Personal data exposed",
    score: 88,
    time: "1 hr ago",
  },
];

export function SampleAlertSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Real-Time Protection in Action
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Here&apos;s what Shield catches for you every day.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {sampleAlerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.type}
                className={`rounded-xl border ${alert.border} bg-zinc-900/80 p-5 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-1.5 ${alert.bg}`}>
                      <Icon className={`h-4 w-4 ${alert.color}`} />
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${alert.bg} ${alert.color}`}>
                      {alert.type}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">{alert.time}</span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                  <span className="text-sm font-semibold text-blue-500">
                    {alert.saving}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-16 rounded-full bg-zinc-800">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: `${alert.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{alert.score}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400">
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            Shield runs 24/7 — these alerts are sent to you automatically
          </div>
        </div>
      </div>
    </section>
  );
}
