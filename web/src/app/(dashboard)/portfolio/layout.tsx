import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Positions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
