import {
  Bell,
  TrendingUp,
  DollarSign,
  Newspaper,
  Brain,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Instant Buy/Sell Alerts",
    description:
      "Get notified the moment our AI detects a buy, sell, or hold opportunity — like \"BUY NOW\" or \"SELL NOW\" pushed straight to your dashboard.",
  },
  {
    icon: Newspaper,
    title: "News-Driven Insights",
    description:
      "\"Tesla just launched a new product — you should buy now.\" We scan breaking news and translate it into actionable alerts with context.",
  },
  {
    icon: DollarSign,
    title: "Profit Estimates",
    description:
      "Every alert comes with an estimated profit range so you know what you could make before you act.",
  },
  {
    icon: Brain,
    title: "AI Predictions",
    description:
      "Machine learning models analyze patterns, sentiment, and fundamentals to predict where stocks are headed next.",
  },
  {
    icon: TrendingUp,
    title: "Market Tracking",
    description:
      "Real-time price tracking across major stocks and indices. Always know what the market is doing at a glance.",
  },
  {
    icon: Target,
    title: "Confidence Scores",
    description:
      "Every signal comes with a confidence score so you can weigh the strength of each prediction before deciding.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Your AI-Powered Market Copilot
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            We watch the market so you don&apos;t have to. Get alerts, not noise.
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
