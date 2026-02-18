"use client";

import { useState } from "react";
import {
  Check,
  CreditCard,
  Shield,
  Zap,
  Crown,
  Users,
  ArrowLeft,
  Lock,
  Star,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    icon: Zap,
    description: "Basic protection for one person",
    features: [
      "3 scam analyses per day",
      "5 tracked subscriptions",
      "Basic data broker list",
      "Email alerts only",
    ],
    color: "border-zinc-700",
    iconColor: "text-zinc-400 bg-zinc-800",
  },
  {
    id: "solo",
    name: "Solo",
    price: 9.99,
    period: "/month",
    icon: Crown,
    description: "Full protection for one person",
    popular: true,
    features: [
      "Unlimited scam analyses",
      "Unlimited subscription tracking",
      "Full data broker opt-out service",
      "Price discrimination monitoring",
      "Push & email notifications",
      "Priority AI analysis",
      "Export all your data",
      "Priority support",
    ],
    color: "border-blue-600/50",
    iconColor: "text-blue-500 bg-blue-600/10",
  },
  {
    id: "family",
    name: "Family",
    price: 19.99,
    period: "/month",
    icon: Users,
    description: "Protect your whole household",
    features: [
      "Everything in Solo",
      "Up to 5 family members",
      "Family dashboard overview",
      "Shared scam blocklist",
      "Elder fraud protection mode",
      "Family spending insights",
      "Dedicated family support",
    ],
    color: "border-zinc-700",
    iconColor: "text-purple-400 bg-purple-500/10",
  },
];

const faqs = [
  {
    q: "What data do you collect?",
    a: "We only collect what you submit: suspicious messages for analysis, subscriptions you add, and products you track. We never access your email, bank, or phone without explicit action from you.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, cancel anytime with one click. No contracts, no hidden fees. Your subscription ends at the end of the billing period.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Solo and Family plans come with a 7-day free trial. You won't be charged until the trial ends, and you can cancel anytime during the trial.",
  },
  {
    q: "How does the scam analysis work?",
    a: "Paste any suspicious text, email, or call transcript and our AI analyzes it for red flags, categorizes the scam type, and gives you a risk score with recommended actions.",
  },
  {
    q: "What are data broker opt-outs?",
    a: "Data brokers collect and sell your personal info. Shield tracks 190+ brokers, helps you opt out, and monitors for re-listings so your data stays private.",
  },
];

export default function CheckoutPage() {
  const { subscription, isPaid, upgrade, cancel, isLoading } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState("solo");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activePlan = plans.find((p) => p.id === selectedPlan)!;
  const currentPlan = subscription?.plan ?? "free";

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
    try {
      await upgrade(selectedPlan as "solo" | "family");
      const { toast } = await import("@/components/ui/toast");
      toast.success(`Welcome to ${activePlan.name}! Your 7-day trial has started.`);
    } catch {
      const { toast } = await import("@/components/ui/toast");
      toast.error("Something went wrong. Please try again.");
    }
    setProcessing(false);
  };

  const handleCancel = async () => {
    await cancel();
    const { toast } = await import("@/components/ui/toast");
    toast.info("Subscription canceled. You'll retain access until the end of your billing period.");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

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
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-blue-600/10 via-zinc-900/50 to-purple-500/10 p-8">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/5 to-transparent" />
        <div className="relative">
          <h1 className="text-3xl font-bold text-white">
            {isPaid ? "Manage Your Subscription" : "Upgrade Your Protection"}
          </h1>
          <p className="mt-2 text-zinc-400">
            {isPaid
              ? `You're on the ${subscription?.plan === "family" ? "Family" : "Solo"} plan (${subscription?.status === "trialing" ? "trial" : "active"})`
              : "Get full protection for you and your family. Cancel anytime."}
          </p>
          {isPaid && subscription?.status !== "canceled" && (
            <button
              onClick={handleCancel}
              className="mt-4 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
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
              currentPlan === plan.id
                ? "border-blue-600 bg-blue-600/5 ring-1 ring-blue-600/50"
                : selectedPlan === plan.id
                  ? plan.popular
                    ? "border-blue-600 bg-blue-600/5 ring-1 ring-blue-600/50"
                    : "border-zinc-600 bg-zinc-800/50 ring-1 ring-zinc-600"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-blue-700 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                <Star className="h-3 w-3" /> Most Popular
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className={cn("rounded-lg p-2", plan.iconColor)}>
                <plan.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              {currentPlan === plan.id && (
                <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-[10px] font-medium text-blue-500">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-3xl font-bold text-white">
                {plan.price === 0 ? "Free" : `$${plan.price}`}
              </span>
              {plan.period && plan.price > 0 && (
                <span className="text-sm text-zinc-500">{plan.period}</span>
              )}
            </div>
            <p className="text-sm text-zinc-400 mb-4">{plan.description}</p>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                  <span className="text-xs text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
            <div className={cn(
              "mt-4 rounded-lg py-2 text-center text-sm font-medium transition-colors",
              currentPlan === plan.id
                ? "bg-blue-700 text-white"
                : selectedPlan === plan.id
                  ? "bg-blue-700 text-white"
                  : "bg-zinc-800 text-zinc-400"
            )}>
              {currentPlan === plan.id ? "Current Plan" : selectedPlan === plan.id ? "Selected" : "Select Plan"}
            </div>
          </button>
        ))}
      </div>

      {/* Payment Form */}
      {(selectedPlan === "solo" || selectedPlan === "family") && !isPaid && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-lg bg-blue-600/10 p-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
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
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
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
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 pr-12 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
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
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
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
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-600 disabled:opacity-50 transition-all"
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
                <Shield className="h-3.5 w-3.5 text-blue-600" />
                SSL Encrypted
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Lock className="h-3.5 w-3.5 text-blue-600" />
                Cancel Anytime
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedPlan === "free" && !isPaid && (
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-8 text-center">
          <Zap className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">You&apos;re on Free</h3>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            The Free plan is already active on your account. Upgrade to Solo for unlimited protection.
          </p>
          <button
            onClick={() => setSelectedPlan("solo")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            <Crown className="h-4 w-4" />
            Upgrade to Solo
          </button>
        </div>
      )}

      {/* Money-back Guarantee */}
      <div className="flex items-center justify-center gap-3 rounded-xl border border-blue-600/20 bg-blue-600/5 p-4">
        <Shield className="h-6 w-6 text-blue-600 shrink-0" />
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
