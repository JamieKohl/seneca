import { Radar, Cpu, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Radar,
    step: "01",
    title: "DETECT",
    description:
      "Shield continuously scans incoming communications, financial transactions, and data broker registries for indicators of compromise targeting your identity and finances.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "ANALYZE",
    description:
      "AI-powered threat analysis cross-references patterns against known fraud signatures, financial anomalies, and privacy violations to assess risk severity in real-time.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "NEUTRALIZE",
    description:
      "Threats are automatically intercepted, fraudulent communications blocked, opt-out requests dispatched, and you receive a detailed incident report with recommended actions.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-2">
            OPERATIONAL PROTOCOL
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            HOW SHIELD RESPONDS TO THREATS
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Automated threat detection, analysis, and neutralization.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-[calc(50%+40px)] hidden h-px w-[calc(100%-80px)] bg-zinc-800 md:block" />
              )}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <step.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-blue-600 font-data">
                PHASE {step.step}
              </div>
              <h3 className="mt-3 text-xl font-bold text-white tracking-wider">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
