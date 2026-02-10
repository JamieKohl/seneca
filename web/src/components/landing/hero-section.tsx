import Link from "next/link";
import { Globe } from "./globe";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden bg-grid">
      {/* Top gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Headline */}
          <div className="flex flex-col justify-center py-12 lg:py-0">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your AI Copilot for{" "}
              <span className="text-emerald-500">Robinhood & Beyond</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-zinc-400">
              We watch the market 24/7 so you don&apos;t have to. Log your positions,
              and we&apos;ll tell you exactly when to open your broker and buy, sell,
              or hold — with profit estimates and news-driven reasoning.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                Get Alerts Free
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right: Globe */}
          <div className="relative flex items-center justify-center">
            <Globe />
          </div>
        </div>
      </div>
    </section>
  );
}
