"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Globe } from "./globe";

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 overflow-hidden bg-grid scanline-overlay">
      {/* Top gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-6rem)] flex-col lg:flex-row items-center justify-center gap-8 py-12">
          {/* Left: News content */}
          <div className="flex-1 max-w-2xl">
            {/* Breaking banner */}
            <div className="mb-6 inline-flex items-center gap-2 rounded bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white">
              <span className="h-2 w-2 rounded-full bg-white live-indicator" />
              BREAKING
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Consumer Fraud Losses Hit Record{" "}
              <span className="text-red-500">$12.5 Billion</span>
            </h1>

            <p className="mt-6 text-base text-zinc-400 leading-relaxed">
              Federal regulators report consumer fraud losses surged 14%
              year-over-year, with 2.6 million complaints filed in the latest
              reporting period. Identity theft, phishing, and subscription fraud
              continue to accelerate as threat actors deploy increasingly
              sophisticated tactics against unprotected consumers.
            </p>

            {/* Stats with trend arrows */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-2xl font-bold text-white font-data">$12.5B</p>
                <div className="mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs font-bold text-red-500 font-data">+14% YoY</span>
                </div>
                <p className="mt-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                  Total Fraud Losses
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-2xl font-bold text-white font-data">$133/mo</p>
                <div className="mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs font-bold text-red-500 font-data">+22% YoY</span>
                </div>
                <p className="mt-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                  Avg. Subscription Waste
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-2xl font-bold text-white font-data">190+</p>
                <div className="mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs font-bold text-red-500 font-data">+31 new</span>
                </div>
                <p className="mt-1 text-[10px] text-zinc-500 uppercase tracking-wider">
                  Active Data Brokers
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
              >
                Start Monitoring
              </Link>
              <a
                href="#threats"
                className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                View Threat Data
              </a>
            </div>
          </div>

          {/* Right: Globe */}
          <div className="flex-1 max-w-[500px] w-full hidden lg:block">
            <Globe />
          </div>
        </div>
      </div>
    </section>
  );
}
