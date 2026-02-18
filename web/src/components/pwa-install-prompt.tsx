"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

export function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("kohlcorp-pwa-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShow(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("kohlcorp-pwa-dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-6 z-[55] max-w-sm rounded-xl border border-blue-600/20 bg-zinc-950 p-4 shadow-2xl shadow-black/50 animate-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-2 rounded-lg p-1 text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/10">
          <Smartphone className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            Install KohlCorp
          </p>
          <p className="text-xs text-zinc-400 mt-1 mb-3">
            Add to your home screen for instant access to alerts and live prices.
          </p>
          <button
            onClick={handleInstall}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
