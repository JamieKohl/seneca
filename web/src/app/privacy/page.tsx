import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-invert prose-zinc prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">1. Information We Collect</h2>
            <p className="text-zinc-400 leading-relaxed">
              We collect information you provide directly: account details (name, email), portfolio data you manually enter (stock symbols, share quantities, cost basis), and preferences (broker, notification settings). We also collect usage data including pages visited, features used, and device information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">2. What We Do NOT Collect</h2>
            <p className="text-zinc-400 leading-relaxed">
              <strong className="text-white">We never access, connect to, or store your brokerage account credentials.</strong> We have no ability to view your actual broker holdings, execute trades, or transfer funds. All position data is self-reported by you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>To provide AI-powered alerts and predictions based on your watchlist</li>
              <li>To track and display your self-reported portfolio performance</li>
              <li>To send notifications (email, push) about market alerts</li>
              <li>To improve our AI models and service quality</li>
              <li>To process payments for premium subscriptions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">4. Data Security</h2>
            <p className="text-zinc-400 leading-relaxed">
              We use industry-standard encryption (TLS/SSL) for all data in transit. Portfolio data and account information are stored encrypted at rest. We conduct regular security audits and follow best practices for data protection.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">5. Cookies</h2>
            <p className="text-zinc-400 leading-relaxed">
              We use essential cookies for authentication and session management, and optional analytics cookies to understand how the Service is used. You can manage cookie preferences through the cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">6. Third-Party Services</h2>
            <p className="text-zinc-400 leading-relaxed">
              We use third-party services for market data (Finnhub), payment processing (Stripe), and analytics. These services have their own privacy policies. We do not sell your personal information to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">7. Data Retention</h2>
            <p className="text-zinc-400 leading-relaxed">
              We retain your account data for as long as your account is active. You can request deletion of your account and all associated data at any time by contacting us. Alert history and analytics data may be retained in anonymized form.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">8. Your Rights</h2>
            <p className="text-zinc-400 leading-relaxed">
              You have the right to access, correct, or delete your personal data. You may opt out of non-essential communications at any time. For EU residents, we comply with GDPR requirements including the right to data portability.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">9. Contact</h2>
            <p className="text-zinc-400 leading-relaxed">
              For privacy-related questions, contact us at{" "}
              <a href="mailto:privacy@kohlcorp.com" className="text-emerald-500 hover:text-emerald-400">
                privacy@kohlcorp.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
