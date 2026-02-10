import {
  Bell,
  TrendingUp,
  DollarSign,
  Newspaper,
  Brain,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Broker Action Alerts",
    description:
      "\"Go on Robinhood and sell TSLA now\" — we tell you exactly when to open your broker and what to do.",
  },
  {
    icon: Wallet,
    title: "Position Tracking",
    description:
      "Log what you own on Robinhood, Webull, or any broker. We track live prices and match your real positions.",
  },
  {
    icon: Newspaper,
    title: "News-Driven Alerts",
    description:
      "\"Tesla just launched a new product — go buy on Robinhood.\" We scan breaking news and tell you when to act.",
  },
  {
    icon: DollarSign,
    title: "Profit Estimates",
    description:
      "Every alert shows how much you could make or lose based on your actual position size. No guessing.",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    description:
      "Machine learning models analyze patterns, sentiment, and fundamentals to predict where your stocks are headed.",
  },
  {
    icon: TrendingUp,
    title: "Live Market Data",
    description:
      "Real-time prices for every stock in your portfolio. Always know what your broker positions are worth.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Your AI Sidekick for Any Broker
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            We watch the market. You trade on Robinhood, Webull, or wherever you invest.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <feature.icon className="h-5 w-5 text-emerald-500" />
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
