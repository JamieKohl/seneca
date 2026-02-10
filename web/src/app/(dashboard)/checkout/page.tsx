"use client";

import { useState } from "react";
import {
  Check,
  CreditCard,
  Shield,
  Zap,
  Crown,
  Building2,
  ArrowLeft,
  Lock,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    icon: Zap,
    description: "Get started with basic alerts",
    features: [
      "5 positions tracked",
      "Daily buy/sell/hold alerts",
      "Basic profit estimates",
      "Market news feed",
      "Email notifications",
    ],
    color: "border-zinc-700",
    iconColor: "text-zinc-400 bg-zinc-800",
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    period: "/month",
    icon: Crown,
    description: "For serious traders who want an edge",
    popular: true,
    features: [
      "Unlimited positions tracked",
      "Real-time instant broker alerts",
      "Advanced AI profit estimates",
      "AI-powered news insights",
      "Push notifications to your phone",
      "Alert history & accuracy scorecard",
      "Confidence score breakdowns",
      "Technical analysis (RSI, MACD, etc.)",
      "Priority support",
    ],
    color: "border-emerald-500/50",
    iconColor: "text-emerald-400 bg-emerald-500/10",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: -1,
    period: "",
    icon: Building2,
    description: "For teams and institutions",
    features: [
      "Everything in Pro",
      "API access for custom integrations",
      "Custom alert rules & strategies",
      "Team dashboards & collaboration",
      "Dedicated account manager",
      "99.9% uptime SLA guarantee",
      "Custom onboarding",
    ],
    color: "border-zinc-700",
    iconColor: "text-purple-400 bg-purple-500/10",
  },
];

const faqs = [
  {
    q: "Do you connect to my broker account?",
    a: "No, never. We never access your Robinhood, Webull, or any broker account. You manually log your positions, and we send you alerts telling you when to act on your broker.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, cancel anytime with one click. No contracts, no hidden fees. Your subscription ends at the end of the billing period.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes! Pro comes with a 7-day free trial. You won't be charged until the trial ends, and you can cancel anytime during the trial.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) as well as Apple Pay and Google Pay.",
  },
  {
    q: "How accurate are the AI alerts?",
    a: "Our AI alerts have an 84% historical accuracy rate. You can verify this yourself on the Alert History page where we show every past alert and whether it was correct.",
  },
];

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activePlan = plans.find((p) => p.id === selectedPlan)!;

  const formatCardNumber = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 16);
    return nums.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const nums = value.replace(/\D/g, "").slice(0, 4);
    if (nums.length >= 3) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
    return nums;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    alert("Payment processed! Welcome to " + activePlan.name + "!");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-emerald-500/10 via-zinc-900/50 to-purple-500/10 p-8">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent" />
        <div className="relative">
          <h1 className="text-3xl font-bold text-white">Upgrade Your Alerts</h1>
          <p className="mt-2 text-zinc-400">
            Get faster, smarter broker alerts. Cancel anytime.
          </p>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={cn(
              "relative rounded-xl border p-6 text-left transition-all",
              selectedPlan === plan.id
                ? plan.popular
                  ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/50"
                  : "border-zinc-600 bg-zinc-800/50 ring-1 ring-zinc-600"
                : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                <Star className="h-3 w-3" /> Most Popular
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("rounded-lg p-2", plan.iconColor)}>
                <plan.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-white">
                {plan.price === -1 ? "Custom" : plan.price === 0 ? "Free" : `$${plan.price}`}
              </span>
              {plan.period && plan.price > 0 && (
                <span className="text-sm text-zinc-500">{plan.period}</span>
              )}
            </div>
            <p className="text-sm text-zinc-400 mb-4">{plan.description}</p>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span className="text-xs text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
            {/* Selection indicator */}
            <div className={cn(
              "mt-4 rounded-lg py-2 text-center text-sm font-medium transition-colors",
              selectedPlan === plan.id
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-400"
            )}>
              {selectedPlan === plan.id ? "Selected" : "Select Plan"}
            </div>
          </button>
        ))}
      </div>

      {/* Payment Form */}
      {selectedPlan !== "free" && selectedPlan !== "enterprise" && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <CreditCard className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Payment Details</h3>
              <p className="text-sm text-zinc-400">7-day free trial, then ${activePlan.price}/month</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">Name on Card</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-400">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 pr-12 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">Expiry</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-400">CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  required
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 disabled:opacity-50 transition-all"
            >
              {processing ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Start 7-Day Free Trial
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                SSL Encrypted
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                Cancel Anytime
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedPlan === "enterprise" && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
          <Building2 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Enterprise Plan</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Get a custom quote for your team. Includes API access, custom alert rules, and dedicated support.
          </p>
          <a
            href="mailto:contact@kohlmeyerequity.com"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            Contact Sales
          </a>
        </div>
      )}

      {selectedPlan === "free" && (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-8 text-center">
          <Zap className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">You're on Free</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            The Free plan is already active on your account. Upgrade to Pro for unlimited positions and real-time alerts.
          </p>
          <button
            onClick={() => setSelectedPlan("pro")}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <Crown className="h-4 w-4" />
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Money-back Guarantee */}
      <div className="flex items-center justify-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <Shield className="h-6 w-6 text-emerald-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">30-Day Money-Back Guarantee</p>
          <p className="text-xs text-zinc-400">Not satisfied? Get a full refund within 30 days, no questions asked.</p>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-white">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="h-4 w-4 text-zinc-500 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-zinc-400">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
