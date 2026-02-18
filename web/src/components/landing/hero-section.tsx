import Link from "next/link";
import { Shield, AlertTriangle, DollarSign, Eye } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-16 overflow-hidden bg-grid">
      {/* Top gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/5 px-4 py-1.5 text-xs font-medium text-blue-500">
            <Shield className="h-3.5 w-3.5" />
            AI-Powered Consumer Protection
          </div>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your AI Bodyguard for{" "}
            <span className="text-blue-600">Money & Privacy</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Americans lost $12.5B to fraud last year. Hidden subscriptions drain
            $133/month on average. Data brokers sell your info to anyone who asks.
            Shield fights back — automatically.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
            >
              Start Free Protection
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Key stats */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-12">
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              <span className="text-2xl font-bold text-white">$12.5B</span>
              <span className="text-xs text-zinc-500">Lost to fraud in 2024</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DollarSign className="h-6 w-6 text-amber-400" />
              <span className="text-2xl font-bold text-white">$133/mo</span>
              <span className="text-xs text-zinc-500">Avg. wasted on subscriptions</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Eye className="h-6 w-6 text-purple-400" />
              <span className="text-2xl font-bold text-white">190+</span>
              <span className="text-xs text-zinc-500">Data brokers selling your info</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
