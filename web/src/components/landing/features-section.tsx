import {
  ShieldAlert,
  CreditCard,
  UserX,
  Search,
} from "lucide-react";

const features = [
  {
    icon: ShieldAlert,
    title: "Scam Firewall",
    description:
      "Paste any suspicious text, email, or call transcript and our AI instantly analyzes it for red flags, phishing patterns, and known scam tactics.",
    color: "text-red-400 bg-red-500/10",
  },
  {
    icon: CreditCard,
    title: "Subscription Hunter",
    description:
      "Track every subscription you pay for. We flag forgotten or unused ones and show you exactly how much you can save each month.",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: UserX,
    title: "Privacy Autopilot",
    description:
      "We track 190+ data brokers that sell your personal information and guide you through opting out — then monitor for re-listings.",
    color: "text-purple-400 bg-purple-500/10",
  },
  {
    icon: Search,
    title: "Price Watch",
    description:
      "Monitor products for price discrimination. We detect when companies show you higher prices based on your browsing history or location.",
    color: "text-blue-400 bg-blue-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Four Layers of Protection
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Shield monitors threats to your money and privacy around the clock.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
