"use client";

import { Shield } from "lucide-react";

const incidents = [
  {
    id: "INC-2024-0847",
    timestamp: "2024-12-14 09:23:41 EST",
    title: "INCIDENT: Phishing Attack Intercepted",
    severity: "CRITICAL",
    severityColor: "border-l-red-500 bg-red-500/5",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
    message:
      "Blocked credential harvesting email impersonating Chase Bank. Fake login portal at chase-verify-account[.]com targeting stored payment credentials.",
    resolution: "Threat Neutralized",
    resolutionColor: "text-green-400",
    saving: "Prevented potential $5,000+ loss",
    status: "MITIGATED",
    statusColor: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    id: "INC-2024-0851",
    timestamp: "2024-12-14 11:47:12 EST",
    title: "INCIDENT: Financial Drain Detected",
    severity: "HIGH",
    severityColor: "border-l-amber-500 bg-amber-500/5",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    message:
      "Adobe Creative Cloud subscription inactive for 4 months. Recurring charge of $54.99/mo detected with zero application launches in monitoring period.",
    resolution: "Savings: $660/year recovered",
    resolutionColor: "text-blue-400",
    saving: "Save $54.99/month",
    status: "REQUIRES ACTION",
    statusColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    id: "INC-2024-0863",
    timestamp: "2024-12-14 14:05:33 EST",
    title: "INCIDENT: Data Exposure Detected",
    severity: "HIGH",
    severityColor: "border-l-purple-500 bg-purple-500/5",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    message:
      "WhitePages publicly listing home address, phone number, and relative associations. Personal data accessible via public search with no authentication required.",
    resolution: "Opt-out submitted",
    resolutionColor: "text-green-400",
    saving: "Personal data exposed",
    status: "MITIGATED",
    statusColor: "bg-green-500/10 text-green-400 border-green-500/20",
  },
];

export function SampleAlertSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-2">
            CLASSIFIED
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            LATEST INCIDENT REPORTS
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Real-time threat interceptions from the Shield network.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`rounded-xl border border-zinc-800 ${incident.severityColor} border-l-4 p-5 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-zinc-500 font-data">
                  {incident.id}
                </span>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${incident.statusColor}`}
                >
                  {incident.status}
                </span>
              </div>

              {/* Severity + Timestamp */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${incident.badgeColor}`}
                >
                  {incident.severity}
                </span>
                <span className="text-[10px] text-zinc-600 font-data">
                  {incident.timestamp}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-white mb-2">
                {incident.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                {incident.message}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                <span className={`text-xs font-semibold ${incident.resolutionColor}`}>
                  {incident.resolution}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400">
            <Shield className="h-3.5 w-3.5 text-red-500" />
            Shield monitors threats 24/7 — incidents are detected and reported automatically
          </div>
        </div>
      </div>
    </section>
  );
}
