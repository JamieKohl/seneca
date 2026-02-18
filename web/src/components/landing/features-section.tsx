import {
  ShieldAlert,
  CreditCard,
  UserX,
  Search,
} from "lucide-react";

const features = [
  {
    icon: ShieldAlert,
    title: "FRAUD DETECTION & INTERCEPTION",
    classification: "CRITICAL",
    stat: "2.6M+ complaints/year",
    borderColor: "border-l-red-500",
    badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
    description:
      "Real-time analysis of suspicious communications using AI pattern recognition. Automatically identifies phishing, vishing, smishing, and social engineering attacks before they reach you.",
  },
  {
    icon: CreditCard,
    title: "FINANCIAL DRAIN MONITORING",
    classification: "HIGH",
    stat: "$133/mo avg. waste",
    borderColor: "border-l-amber-500",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    description:
      "Continuous monitoring of recurring charges and subscription activity. Detects dormant services, identifies billing anomalies, and calculates cumulative financial impact of unused subscriptions.",
  },
  {
    icon: UserX,
    title: "DATA BROKER SURVEILLANCE",
    classification: "HIGH",
    stat: "190+ registries tracked",
    borderColor: "border-l-purple-500",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    description:
      "Automated surveillance of 190+ data broker registries for unauthorized personal data listings. Dispatches opt-out requests and monitors for re-listing violations.",
  },
  {
    icon: Search,
    title: "PRICE DISCRIMINATION DETECTION",
    classification: "MEDIUM",
    stat: "Up to $200+ overcharges",
    borderColor: "border-l-blue-500",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    description:
      "Detects dynamic pricing manipulation based on browsing history, device fingerprinting, and geographic location. Compares cross-platform pricing to expose discriminatory algorithms.",
  },
];

export function FeaturesSection() {
  return (
    <section id="threats" className="py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-2">
            INTELLIGENCE BRIEFING
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            THREAT COVERAGE AREAS
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Four layers of automated protection against consumer threats.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`rounded-xl border border-zinc-800 ${feature.borderColor} border-l-4 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.badgeColor.split(' ')[0]}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${feature.badgeColor}`}
                >
                  {feature.classification}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider">
                {feature.title}
              </h3>
              <p className="mt-1 text-xs text-red-400 font-data font-semibold">
                {feature.stat}
              </p>
              <p className="mt-3 text-sm text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
