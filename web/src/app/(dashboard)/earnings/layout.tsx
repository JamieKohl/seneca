import type { Metadata } from "next";

export const metadata: Metadata = { title: "Earnings Calendar" };

export default function EarningsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
