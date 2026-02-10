import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-invert prose-zinc prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">1. Agreement to Terms</h2>
            <p className="text-zinc-400 leading-relaxed">
              By accessing or using KohlCorp (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">2. Description of Service</h2>
            <p className="text-zinc-400 leading-relaxed">
              KohlCorp is a broker companion application that provides AI-powered stock market analysis, buy/sell/hold alerts, and portfolio tracking. KohlCorp does NOT connect to, access, or control any brokerage accounts. Users manually log their positions and receive informational alerts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">3. Not Financial Advice</h2>
            <p className="text-zinc-400 leading-relaxed">
              <strong className="text-white">KohlCorp does not provide financial advice, investment recommendations, or brokerage services.</strong> All signals, predictions, alerts, and analysis are for informational purposes only. You should consult a qualified financial advisor before making any investment decisions. Past performance does not guarantee future results.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">4. User Accounts</h2>
            <p className="text-zinc-400 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">5. Subscription & Billing</h2>
            <p className="text-zinc-400 leading-relaxed">
              Paid plans are billed on a monthly basis. You may cancel at any time; your subscription will remain active until the end of the current billing period. Refunds are available within 30 days of initial purchase. Free trials automatically convert to paid subscriptions unless cancelled.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">6. Limitation of Liability</h2>
            <p className="text-zinc-400 leading-relaxed">
              KohlCorp shall not be liable for any financial losses incurred from acting on alerts, signals, or predictions provided by the Service. Users trade at their own risk and are solely responsible for their investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">7. Termination</h2>
            <p className="text-zinc-400 leading-relaxed">
              We may terminate or suspend your account at any time without prior notice for conduct that we determine violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">8. Changes to Terms</h2>
            <p className="text-zinc-400 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or in-app notification. Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mt-8 mb-3">9. Contact</h2>
            <p className="text-zinc-400 leading-relaxed">
              For questions about these Terms, contact us at{" "}
              <a href="mailto:contact@kohlcorp.com" className="text-emerald-500 hover:text-emerald-400">
                contact@kohlcorp.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
