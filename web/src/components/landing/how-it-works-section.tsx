import { Plug, Shield, PiggyBank } from "lucide-react";

const steps = [
  {
    icon: Plug,
    step: "01",
    title: "Connect",
    description:
      "Sign up and tell Shield what to protect. Add your subscriptions, forward suspicious messages, and start privacy scans.",
  },
  {
    icon: Shield,
    step: "02",
    title: "Shield Monitors",
    description:
      "Our AI continuously watches for scams, forgotten subscriptions, data broker listings, and price manipulation — 24/7.",
  },
  {
    icon: PiggyBank,
    step: "03",
    title: "You Save",
    description:
      "Get instant alerts when threats are found. Cancel wasteful subscriptions, block scams, and reclaim your privacy — all from one dashboard.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Three steps to total protection.
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
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                Step {step.step}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">
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
