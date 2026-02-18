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
    title: "Welcome to Shield Intelligence Center",
    description:
      "Your automated threat intelligence platform. Shield detects fraud, monitors financial drains, surveils data brokers, and intercepts price manipulation — in real time.",
    color: "text-blue-500 bg-blue-600/10",
  },
  {
    icon: ShieldAlert,
    title: "Fraud Detection Module",
    description:
      "Submit any suspicious text, email, or call transcript for AI-powered threat analysis. Shield identifies red flags and assigns risk scores to neutralize scam attempts.",
    color: "text-red-400 bg-red-500/10",
  },
  {
    icon: CreditCard,
    title: "Financial Monitoring Module",
    description:
      "Track active subscriptions so Shield can flag unused drains on your finances. The average consumer loses $133/month to forgotten recurring charges.",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: Bell,
    title: "Threat Monitoring Active",
    description:
      "Shield monitors all defense layers 24/7 and dispatches incident alerts when action is required. Your readiness score is displayed on the Threat Overview dashboard.",
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
                Activate Monitoring
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
