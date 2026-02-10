import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Never Miss a Move on Your Broker
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            We watch. You trade. Get AI alerts that tell you exactly when to open Robinhood and act.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-emerald-600 px-8 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-8 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Kohlmeyer Equity. All rights reserved.
        </div>
      </div>
    </section>
  );
}
