"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("kohlcorp-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("kohlcorp-cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("kohlcorp-cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[55] border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-lg p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-zinc-300">
              We use cookies to improve your experience and analyze site traffic.
            </p>
            <Link
              href="/privacy"
              className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              Learn more in our Privacy Policy
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={decline}
            className="rounded p-1 text-zinc-600 hover:text-zinc-400 transition-colors sm:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
