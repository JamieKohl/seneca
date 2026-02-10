"use client";

import { useState } from "react";
import { Save, Key, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const [finnhubKey, setFinnhubKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [notifications, setNotifications] = useState({
    signals: true,
    priceAlerts: true,
    news: false,
    portfolio: true,
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-zinc-400">
          Configure your API keys and preferences
        </p>
      </div>

      {/* API Keys */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">API Keys</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Finnhub API Key
            </label>
            <input
              type="password"
              value={finnhubKey}
              onChange={(e) => setFinnhubKey(e.target.value)}
              placeholder="Enter your Finnhub API key"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Get a free key at finnhub.io
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-400">
              Anthropic API Key
            </label>
            <input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="Enter your Anthropic API key"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Required for AI signal generation
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Alert Notifications</h3>
        </div>
        <p className="mb-4 text-xs text-zinc-500">
          Choose how and when you want to receive buy/sell/hold alerts.
        </p>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <label
              key={key}
              className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-800/50"
            >
              <span className="text-sm text-zinc-300 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  value ? "bg-emerald-600" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    value ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Get instant push notifications on your device when a new alert fires.
        </p>
        <button
          onClick={() => {
            if ("Notification" in window) {
              Notification.requestPermission();
            }
          }}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Enable Push Notifications
        </button>
      </div>

      {/* Watchlist Alert Preferences */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-white">Watchlist Alerts</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Only receive alerts for stocks on your watchlist, or get alerts for all tracked stocks.
        </p>
        <div className="space-y-2">
          {["watchlistOnly", "allStocks"].map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-800/50 cursor-pointer"
            >
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  (option === "watchlistOnly")
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-zinc-600"
                }`}
              >
                {option === "watchlistOnly" && (
                  <div className="mt-0.5 ml-0.5 h-2 w-2 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm text-zinc-300">
                {option === "watchlistOnly"
                  ? "Only my watchlist stocks"
                  : "All tracked stocks"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Save */}
      <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
        <Save className="h-4 w-4" />
        Save Settings
      </button>
    </div>
  );
}
