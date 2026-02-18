"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  ArrowRight,
  ShieldAlert,
  Bell,
  CreditCard,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: Shield,
    title: "Welcome to Kohlcorp Shield",
    description:
      "Your AI-powered consumer protection platform. We fight scams, track subscriptions, protect your privacy, and catch price discrimination — automatically.",
    color: "text-blue-500 bg-blue-600/10",
  },
  {
    icon: ShieldAlert,
    title: "Scam Firewall",
    description:
      "Paste any suspicious text, email, or call transcript and our AI will instantly analyze it for red flags and tell you if it's a scam.",
    color: "text-red-400 bg-red-500/10",
  },
  {
    icon: CreditCard,
    title: "Track Your Subscriptions",
    description:
      "Add your subscriptions so Shield can flag unused ones and help you save money. The average person wastes $133/month on forgotten subscriptions.",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: Bell,
    title: "Get Protected",
    description:
      "Shield monitors threats 24/7 and sends you alerts when action is needed. You'll also see your protection score on the dashboard.",
    color: "text-blue-400 bg-blue-500/10",
  },
];

export function OnboardingFlow() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem("kohlcorp-onboarding-complete");
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const complete = () => {
    localStorage.setItem("kohlcorp-onboarding-complete", "true");
    setShow(false);
  };

  if (!show) return null;

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Progress */}
        <div className="flex gap-1 p-4 pb-0">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-blue-600" : "bg-zinc-800"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${currentStep.color}`}>
            <currentStep.icon className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">{currentStep.title}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed">{currentStep.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-zinc-800 p-4">
          <button
            onClick={complete}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => {
              if (isLastStep) {
                complete();
              } else {
                setStep(step + 1);
              }
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            {isLastStep ? (
              <>
                <Sparkles className="h-4 w-4" />
                Get Protected
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
