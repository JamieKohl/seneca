import { randomBytes } from "crypto";

export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `KOHL-${code}`;
}

export const REWARD_TIERS = [
  { count: 1, reward: "1 Week Pro Free", daysGranted: 7 },
  { count: 3, reward: "1 Month Pro Free", daysGranted: 30 },
  { count: 5, reward: "3 Months Pro Free", daysGranted: 90 },
  { count: 10, reward: "Lifetime Pro", daysGranted: 36500 },
];

export function computeProDaysEarned(referralCount: number): number {
  let days = 0;
  for (const tier of REWARD_TIERS) {
    if (referralCount >= tier.count) {
      days = tier.daysGranted;
    }
  }
  return days;
}

export function nextRewardIn(referralCount: number): number {
  for (const tier of REWARD_TIERS) {
    if (referralCount < tier.count) {
      return tier.count - referralCount;
    }
  }
  return 0;
}
