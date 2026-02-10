"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  ArrowRight,
  Briefcase,
  Bell,
  Eye,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "Welcome to KohlCorp",
    description:
      "Your AI-powered broker companion. We watch the market 24/7 and tell you exactly when to open your broker and act.",
    color: "text-emerald-400 bg-emerald-500/10",
  },
  {
    icon: Briefcase,
    title: "Log Your Positions",
    description:
      "Tell us what stocks you own on Robinhood, Webull, or any broker. We never connect to your account — all data is self-reported.",
    color: "text-blue-400 bg-blue-500/10",
  },
  {
    icon: Eye,
    title: "Build Your Watchlist",
    description:
      "Add stocks you're interested in buying. Our AI will watch them for entry opportunities and alert you when it's time to act.",
    color: "text-violet-400 bg-violet-500/10",
  },
  {
    icon: Bell,
    title: "Get Smart Alerts",
    description:
      "Receive buy, sell, and hold alerts with confidence scores and reasoning. Each alert tells you exactly what to do on your broker.",
    color: "text-amber-400 bg-amber-500/10",
  },
];

export function OnboardingFlow() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedBroker, setSelectedBroker] = useState("");

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
                i <= step ? "bg-emerald-500" : "bg-zinc-800"
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

          {/* Broker selection on step 1 */}
          {step === 1 && (
            <div className="mt-6 grid grid-cols-2 gap-2">
              {["Robinhood", "Webull", "Fidelity", "Other"].map((broker) => (
                <button
                  key={broker}
                  onClick={() => setSelectedBroker(broker)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                    selectedBroker === broker
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {selectedBroker === broker && <Check className="inline h-3.5 w-3.5 mr-1" />}
                  {broker}
                </button>
              ))}
            </div>
          )}
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
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            {isLastStep ? (
              <>
                <Sparkles className="h-4 w-4" />
                Get Started
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
