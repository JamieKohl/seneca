import type { Metadata } from "next";

export const metadata: Metadata = { title: "Price Alerts" };

export default function PriceAlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
