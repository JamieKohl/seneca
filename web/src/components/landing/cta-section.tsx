import Link from "next/link";
import { Shield } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Scam Firewall", href: "/scams" },
    { label: "Privacy Autopilot", href: "/privacy" },
    { label: "Pricing", href: "/checkout" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "mailto:contact@kohlcorp.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/terms#security" },
  ],
};

export function CTASection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Stop Losing Money to Scams & Hidden Fees
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Shield watches your back 24/7. Start your free protection today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-blue-700 px-8 py-3 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
            >
              Get Protected Free
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
        <footer className="mt-24 border-t border-zinc-800 pt-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-base font-bold text-white">
                  KohlCorp Shield
                </span>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed">
                AI-powered consumer protection that fights scams, tracks
                subscriptions, removes your data from brokers, and catches
                price discrimination.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-white mb-3">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/50 pt-8 sm:flex-row">
            <p className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} KohlCorp. All rights reserved.
            </p>
            <p className="text-xs text-zinc-600">
              KohlCorp Shield is a consumer protection tool. Always verify
              suspicious communications independently.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
