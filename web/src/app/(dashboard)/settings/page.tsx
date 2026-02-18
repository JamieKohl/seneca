"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Bell,
  Shield,
  Crown,
  Check,
  Smartphone,
  Settings,
  Clock,
  Download,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [plan, setPlan] = useState("free");
  const [notifications, setNotifications] = useState({
    scams: true,
    subscriptions: true,
    privacy: true,
    priceWatch: true,
  });
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
        if (data.quietHoursEnabled !== undefined) setQuietHoursEnabled(data.quietHoursEnabled);
        if (data.quietStart) setQuietStart(data.quietStart);
        if (data.quietEnd) setQuietEnd(data.quietEnd);
        if (data.plan) setPlan(data.plan);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notifications,
        quietHoursEnabled,
        quietStart,
        quietEnd,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

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
            Configure your Shield protection and notification preferences
          </p>
        </div>
      </div>

      {/* Plan Status */}
      <div className="rounded-xl border border-blue-600/20 bg-blue-600/5 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600/10 p-2">
              <Crown className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {plan === "solo" ? "Solo Plan" : plan === "family" ? "Family Plan" : "Free Plan"}
              </p>
              <p className="text-xs text-zinc-400">
                {plan === "free" ? "Limited protection features" : "Full protection enabled"}
              </p>
            </div>
          </div>
          {plan === "free" && (
            <Link
              href="/checkout"
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
            >
              <Crown className="h-4 w-4" />
              Upgrade to Solo
            </Link>
          )}
        </div>
      </div>

      {/* Alert Notifications */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-white">Alert Notifications</h3>
        </div>
        <p className="mb-4 text-xs text-zinc-500">
          Choose which Shield alerts you want to receive.
        </p>
        <div className="space-y-1">
          {[
            { key: "scams", label: "Scam Alerts", desc: "Get notified when threats are detected" },
            { key: "subscriptions", label: "Subscription Alerts", desc: "Unused subscription reminders" },
            { key: "privacy", label: "Privacy Alerts", desc: "Data broker status changes" },
            { key: "priceWatch", label: "Price Watch Alerts", desc: "Price discrimination detected" },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-zinc-800/50 transition-colors cursor-pointer"
            >
              <div>
                <span className="text-sm text-zinc-300">{item.label}</span>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  notifications[item.key as keyof typeof notifications] ? "bg-blue-700" : "bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                    notifications[item.key as keyof typeof notifications] ? "left-[22px]" : "left-0.5"
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
          <Smartphone className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-white">Push Notifications</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Get instant push notifications on your device when Shield detects a threat.
        </p>
        <button
          onClick={() => {
            if ("Notification" in window) {
              Notification.requestPermission();
            }
          }}
          className="flex items-center gap-2 rounded-lg border border-blue-600/30 bg-blue-600/5 px-4 py-2.5 text-sm font-medium text-blue-500 hover:bg-blue-600/10 transition-colors"
        >
          <Bell className="h-4 w-4" />
          Enable Push Notifications
        </button>
      </div>

      {/* Alert Schedule */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-white">Alert Schedule</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Set quiet hours when you don&apos;t want to receive alert notifications.
        </p>
        <div className="space-y-4">
          <label className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-zinc-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-zinc-500" />
              <span className="text-sm text-zinc-300">Enable Quiet Hours</span>
            </div>
            <button
              onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                quietHoursEnabled ? "bg-blue-700" : "bg-zinc-700"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                  quietHoursEnabled ? "left-[22px]" : "left-0.5"
                )}
              />
            </button>
          </label>
          {quietHoursEnabled && (
            <div className="grid grid-cols-2 gap-4 pl-10">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Start Time
                </label>
                <input
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                  End Time
                </label>
                <input
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Data */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-white">Export Data</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Download your Shield protection data and alert history.
        </p>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Alerts
          </button>
          <button
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Subscriptions
          </button>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={cn(
          "flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all",
          saved
            ? "bg-green-600 text-white"
            : "bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-600"
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
