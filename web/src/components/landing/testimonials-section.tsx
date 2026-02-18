"use client";

const caseFiles = [
  {
    caseId: "CASE #SF-2024-0291",
    threatLevel: "CRITICAL",
    threatColor: "bg-red-500/10 text-red-400 border-red-500/20",
    avatar: "MT",
    avatarColor: "bg-red-500/20 text-red-400",
    summary:
      "Shield intercepted a credential harvesting email that bypassed standard spam filters. The attack impersonated a vendor invoice with a near-identical domain. Potential loss prevented: $8,000+.",
    resolution: "Threat Neutralized",
    savings: "$8,000+ prevented",
  },
  {
    caseId: "CASE #FD-2024-0447",
    threatLevel: "HIGH",
    threatColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    avatar: "SK",
    avatarColor: "bg-amber-500/20 text-amber-400",
    summary:
      "Financial monitoring detected 6 dormant subscriptions with active billing. Subject was unaware of recurring charges totaling $87/month. All services flagged for cancellation review.",
    resolution: "Financial Drain Stopped",
    savings: "$1,044/year recovered",
  },
  {
    caseId: "CASE #PV-2024-0512",
    threatLevel: "HIGH",
    threatColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    avatar: "DR",
    avatarColor: "bg-purple-500/20 text-purple-400",
    summary:
      "Data broker surveillance identified personal information listed across 23 broker sites including home address, phone number, and employment history. Automated opt-out requests dispatched to all registries.",
    resolution: "Data Exposure Contained",
    savings: "23 brokers cleared",
  },
  {
    caseId: "CASE #PD-2024-0623",
    threatLevel: "MEDIUM",
    threatColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    avatar: "JL",
    avatarColor: "bg-blue-500/20 text-blue-400",
    summary:
      "Price intelligence detected $200 markup on consumer electronics based on browsing history and device fingerprint. Identical product confirmed at lower price via clean session verification.",
    resolution: "Price Manipulation Exposed",
    savings: "$200 overcharge detected",
  },
  {
    caseId: "CASE #SF-2024-0701",
    threatLevel: "CRITICAL",
    threatColor: "bg-red-500/10 text-red-400 border-red-500/20",
    avatar: "CW",
    avatarColor: "bg-red-500/20 text-red-400",
    summary:
      "Automated call analysis flagged daily scam calls targeting elderly subjects. Shield identified IRS impersonation patterns and auto-blocked 47 fraudulent calls over a 30-day period.",
    resolution: "Threat Neutralized",
    savings: "47 scam calls blocked",
  },
  {
    caseId: "CASE #FD-2024-0789",
    threatLevel: "HIGH",
    threatColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    avatar: "AP",
    avatarColor: "bg-amber-500/20 text-amber-400",
    summary:
      "Monitoring flagged 3 forgotten free trials converting to paid subscriptions and a suspicious phishing text. Total financial impact prevented exceeded monthly Shield coverage cost within first week.",
    resolution: "Financial Drain Stopped",
    savings: "$660/year recovered",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden border-t border-zinc-800/50 py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-2">
            DECLASSIFIED
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            CASE FILES: THREATS NEUTRALIZED
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
            Documented threat interceptions from the Shield intelligence network
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseFiles.map((caseFile) => (
            <div
              key={caseFile.caseId}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-zinc-500 font-data">
                  {caseFile.caseId}
                </span>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${caseFile.threatColor}`}
                >
                  {caseFile.threatLevel}
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  INCIDENT SUMMARY:
                </span>
                {caseFile.summary}
              </p>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    RESOLUTION:
                  </p>
                  <p className="text-xs font-semibold text-green-400">
                    {caseFile.resolution}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    IMPACT:
                  </p>
                  <p className="text-xs font-semibold text-blue-400 font-data">
                    {caseFile.savings}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
