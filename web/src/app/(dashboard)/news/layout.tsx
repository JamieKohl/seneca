import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Market News",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
