import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function getChangeColor(value: number): string {
  if (value > 0) return "text-green-500";
  if (value < 0) return "text-red-500";
  return "text-gray-500";
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment) {
    case "bullish":
      return "text-green-500 bg-green-500/10";
    case "bearish":
      return "text-red-500 bg-red-500/10";
    default:
      return "text-gray-500 bg-gray-500/10";
  }
}

export function getSignalColor(signal: string): string {
  switch (signal) {
    case "BUY":
      return "text-green-500 bg-green-500/10 border-green-500/20";
    case "SELL":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    default:
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  }
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
