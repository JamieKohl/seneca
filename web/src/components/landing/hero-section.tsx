import Link from "next/link";
import { Globe } from "./globe";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-4rem)] items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Headline */}
          <div className="flex flex-col justify-center py-12 lg:py-0">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Know When to{" "}
              <span className="text-emerald-500">Buy, Sell, or Hold</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-zinc-400">
              AI-powered alerts that tell you exactly when to act. Get real-time
              buy/sell signals, news-driven insights, and profit estimates
              — before the market moves.
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
