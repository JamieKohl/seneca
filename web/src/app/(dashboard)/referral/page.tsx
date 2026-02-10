"use client";

import { useState } from "react";
import {
  Gift,
  Copy,
  Check,
  Users,
  Crown,
  Share2,
  Zap,
  Star,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

const referralCode = "KOHL-7X9KM2";
const referralLink = `https://kohlcorp.com/register?ref=${referralCode}`;

const rewards = [
  { count: 1, reward: "1 Week Pro Free", icon: Zap, earned: true },
  { count: 3, reward: "1 Month Pro Free", icon: Star, earned: true },
  { count: 5, reward: "3 Months Pro Free", icon: Crown, earned: false },
  { count: 10, reward: "Lifetime Pro", icon: Gift, earned: false },
];

const referrals = [
  { name: "J***n", date: "Feb 8, 2026", status: "active" as const },
  { name: "S***a", date: "Feb 5, 2026", status: "active" as const },
  { name: "M***k", date: "Jan 28, 2026", status: "active" as const },
  { name: "A***e", date: "Jan 15, 2026", status: "pending" as const },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-pink-500/10 via-zinc-900 to-zinc-900 p-6">
        <Gift className="absolute -right-4 -top-4 h-32 w-32 text-pink-500/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">Refer & Earn</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Invite friends and earn free Pro access. Both you and your friend get rewarded.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center">
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-xs text-zinc-500 mt-1">Successful Referrals</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center">
          <p className="text-2xl font-bold text-emerald-400">37 days</p>
          <p className="text-xs text-zinc-500 mt-1">Pro Time Earned</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center">
          <p className="text-2xl font-bold text-pink-400">2 more</p>
          <p className="text-xs text-zinc-500 mt-1">Until Next Reward</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">Your Referral Link</h3>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-300 truncate">
            {referralLink}
          </div>
          <button
            onClick={() => handleCopy(referralLink)}
            className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-3 text-sm font-medium text-white hover:bg-pink-500 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">Your code:</span>
          <button
            onClick={() => handleCopy(referralCode)}
            className="flex items-center gap-1.5 rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-mono font-bold text-white hover:bg-zinc-700 transition-colors"
          >
            {referralCode}
            <Copy className="h-3 w-3 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* Rewards Tiers */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Reward Tiers</h3>
        </div>
        <div className="space-y-3">
          {rewards.map((r) => (
            <div
              key={r.count}
              className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                r.earned
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-zinc-800 bg-zinc-800/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  r.earned ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                }`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{r.reward}</p>
                  <p className="text-xs text-zinc-500">{r.count} referral{r.count > 1 ? "s" : ""} needed</p>
                </div>
              </div>
              {r.earned ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <Check className="h-3 w-3" />
                  Earned
                </span>
              ) : (
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-500">Locked</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Your Referrals</h3>
        </div>
        <div className="space-y-2">
          {referrals.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-zinc-800/30 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm text-white">{r.name}</p>
                  <p className="text-xs text-zinc-500">{r.date}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                r.status === "active"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}>
                {r.status === "active" ? "Active" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
