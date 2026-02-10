"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { OnboardingFlow } from "@/components/onboarding";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <Topbar />
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
      <OnboardingFlow />
    </div>
  );
}
