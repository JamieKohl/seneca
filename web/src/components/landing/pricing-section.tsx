import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Solo",
    price: "$9.99",
    period: "/month",
    description: "Complete protection for one person",
    features: [
      "Unlimited scam analysis",
      "Subscription tracking & alerts",
      "Data broker opt-out for 1 person",
      "Price discrimination monitoring",
      "Email & push alerts",
      "Alert history & reports",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Family",
    price: "$19.99",
    period: "/month",
    description: "Protect your whole household",
    features: [
      "Everything in Solo",
      "Up to 5 family members",
      "Family scam dashboard",
      "Shared subscription tracking",
      "Priority data broker removal",
      "Dedicated support",
    ],
    cta: "Start Family Trial",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            14-day free trial. Cancel anytime. No hidden fees.
          </p>
        </div>

        <div className="mt-16 mx-auto grid max-w-3xl gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-8 ${
                plan.highlighted
                  ? "border-blue-600/50 bg-blue-600/5"
                  : "border-zinc-800 bg-zinc-900/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-700 px-4 py-1 text-xs font-bold text-white">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-400">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-blue-600" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/checkout"
                className={`mt-8 block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                  plan.highlighted
                    ? "bg-blue-700 text-white hover:bg-blue-800"
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
