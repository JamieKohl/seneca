import Link from "next/link";
import {
  ArrowLeft,
  Compass,
  Brain,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Globe,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

const values = [
  {
    icon: Shield,
    title: "Security First",
    description:
      "We never connect to your broker. Your financial data stays yours. We only work with the position data you voluntarily share.",
    color: "text-blue-500 bg-blue-600/10",
  },
  {
    icon: Brain,
    title: "AI Transparency",
    description:
      "Every alert comes with a confidence score and reasoning. We show our track record publicly so you can verify our accuracy.",
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Speed Matters",
    description:
      "Markets move fast. Our AI processes thousands of data points in real-time so you get alerts the moment opportunity strikes.",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: Users,
    title: "Built for Everyone",
    description:
      "Whether you have 1 stock or 100, a free plan or Pro, we deliver the same quality AI analysis to every trader.",
    color: "text-purple-400 bg-purple-500/10",
  },
];

const stats = [
  { value: "50K+", label: "Active Traders" },
  { value: "84%", label: "Alert Accuracy" },
  { value: "$2.4B", label: "Positions Tracked" },
  { value: "15", label: "Markets Covered" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-600/20">
            <Compass className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About KohlCorp</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We&apos;re building the smartest broker companion in the world. Our AI watches the market 24/7 so you can trade with confidence when it matters.
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">Our Mission</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Most people don&apos;t have time to watch the stock market all day. They own stocks on Robinhood, Webull, or Fidelity, but they miss the right moment to buy or sell. KohlCorp solves this. We use artificial intelligence to analyze market data, news sentiment, and technical indicators, then send you a simple alert: &quot;Open your broker and buy TSLA now.&quot; No complexity. No jargon. Just clear, actionable alerts with confidence scores and reasoning.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center"
            >
              <p className="text-2xl font-bold text-blue-500">
                {stat.value}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <h2 className="text-xl font-bold mb-6">Our Values</h2>
        <div className="grid gap-4 sm:grid-cols-2 mb-12">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${value.color}`}
              >
                <value.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white mb-1">
                Important Disclaimer
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                KohlCorp is not a registered investment advisor, broker-dealer, or financial institution. All alerts, signals, and predictions are for informational purposes only and should not be construed as financial advice. Trading involves risk and past performance does not guarantee future results. Always consult a qualified financial advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
