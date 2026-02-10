import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Track your broker positions for free",
    features: [
      "5 positions tracked",
      "Daily buy/sell/hold alerts",
      "Basic profit estimates",
      "Market news feed",
      "Email notifications",
    ],
    cta: "Get Started",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious investors who want an edge",
    features: [
      "Unlimited positions tracked",
      "Real-time instant broker alerts",
      "Advanced profit estimates",
      "AI-powered news insights",
      "Push notifications to your phone",
      "Alert history & scorecard",
      "Confidence score breakdowns",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and institutions",
    features: [
      "Everything in Pro",
      "API access",
      "Custom alert rules",
      "Team dashboards",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Us",
    href: "/register",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-8 ${
                plan.highlighted
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-zinc-800 bg-zinc-900/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-zinc-400">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
