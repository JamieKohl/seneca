import useSWR from "swr";
import type { UserSettingsData } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<UserSettingsData>(
    "/api/settings",
    fetcher,
    { dedupingInterval: 10000 }
  );

  const saveSettings = async (settings: Partial<UserSettingsData>) => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    mutate();
  };

  const addPortfolio = async (name: string) => {
    await fetch("/api/settings/portfolios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    mutate();
  };

  const deletePortfolio = async (id: string) => {
    await fetch(`/api/settings/portfolios?id=${id}`, { method: "DELETE" });
    mutate();
  };

  const exportData = (type: "positions" | "alerts") => {
    window.open(`/api/settings/export?type=${type}`, "_blank");
  };

  return {
    settings: data,
    isLoading,
    error,
    saveSettings,
    addPortfolio,
    deletePortfolio,
    exportData,
    mutate,
  };
}
