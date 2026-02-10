"use client";

import { useState } from "react";
import {
  Save,
  Key,
  Bell,
  Shield,
  ExternalLink,
  Crown,
  Check,
  Smartphone,
  Monitor,
  Mail,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const brokers = [
  { name: "Robinhood", color: "border-green-500 bg-green-500/10 text-green-400" },
  { name: "Webull", color: "border-blue-500 bg-blue-500/10 text-blue-400" },
  { name: "Fidelity", color: "border-emerald-500 bg-emerald-500/10 text-emerald-400" },
  { name: "Other", color: "border-zinc-600 bg-zinc-800 text-zinc-300" },
];

export default function SettingsPage() {
  const [finnhubKey, setFinnhubKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("Robinhood");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    signals: true,
    priceAlerts: true,
    news: false,
    portfolio: true,
  });
  const [alertPref, setAlertPref] = useState("watchlistOnly");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-800/50 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="relative">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-zinc-400" />
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Configure your broker, API keys, and alert preferences
          </p>
        </div>
      </div>

      {/* Plan Status */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <Crown className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Free Plan</p>
              <p className="text-xs text-zinc-400">5 positions, daily alerts</p>
            </div>
          </div>
          <Link
            href="/checkout"
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <Crown className="h-4 w-4" />
            Upgrade to Pro
          </Link>
        </div>
      </div>

      {/* Broker Selection */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Your Broker</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Select your broker so alerts say the right thing (e.g. &quot;Go sell on Robinhood&quot;).
          We never connect to or access your broker account.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brokers.map((broker) => (
            <button
              key={broker.name}
              onClick={() => setSelectedBroker(broker.name)}
              className={cn(
                "relative rounded-lg border px-4 py-3 text-sm font-semibold transition-all",
                selectedBroker === broker.name
                  ? broker.color
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300"
              )}
            >
              {selectedBroker === broker.name && (
                <Check className="absolute right-2 top-2 h-3.5 w-3.5" />
              )}
              {broker.name}
            </button>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">API Keys</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Finnhub API Key
            </label>
            <input
              type="password"
              value={finnhubKey}
              onChange={(e) => setFinnhubKey(e.target.value)}
              placeholder="Enter your Finnhub API key"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Get a free key at finnhub.io — used for real-time stock quotes
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="Enter your Anthropic API key"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Required for AI signal generation — powers the buy/sell/hold engine
            </p>
          </div>
        </div>
      </div>

      {/* Alert Notifications */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Alert Notifications</h3>
        </div>
        <p className="mb-4 text-xs text-zinc-500">
          Choose which alerts you want to receive.
        </p>
        <div className="space-y-1">
          {Object.entries(notifications).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-zinc-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {key === "signals" && <Bell className="h-4 w-4 text-zinc-500" />}
                {key === "priceAlerts" && <Monitor className="h-4 w-4 text-zinc-500" />}
                {key === "news" && <Mail className="h-4 w-4 text-zinc-500" />}
                {key === "portfolio" && <Smartphone className="h-4 w-4 text-zinc-500" />}
                <span className="text-sm text-zinc-300 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  value ? "bg-emerald-600" : "bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    value ? "left-[22px]" : "left-0.5"
                  )}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Get instant push notifications on your device when a new alert fires —
          never miss a move on your broker.
        </p>
        <button
          onClick={() => {
            if ("Notification" in window) {
              Notification.requestPermission();
            }
          }}
          className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
        >
          <Bell className="h-4 w-4" />
          Enable Push Notifications
        </button>
      </div>

      {/* Watchlist Alert Preferences */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Alert Scope</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Only receive alerts for stocks on your watchlist, or get alerts for all tracked stocks.
        </p>
        <div className="space-y-2">
          {[
            { id: "watchlistOnly", label: "Only my watchlist stocks", desc: "Focused alerts for your top picks" },
            { id: "allStocks", label: "All tracked stocks", desc: "Get alerts for every stock we monitor" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setAlertPref(option.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                alertPref === option.id
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  alertPref === option.id ? "border-emerald-500 bg-emerald-500" : "border-zinc-600"
                )}
              >
                {alertPref === option.id && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">{option.label}</p>
                <p className="text-xs text-zinc-500">{option.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={cn(
          "flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all",
          saved
            ? "bg-green-600 text-white"
            : "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500"
        )}
      >
        {saved ? (
          <>
            <Check className="h-4 w-4" />
            Saved!
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save Settings
          </>
        )}
      </button>
    </div>
  );
}
