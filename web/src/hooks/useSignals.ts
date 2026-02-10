import useSWR from "swr";
import type { Signal } from "@/types";

const fetcher = async (url: string): Promise<Signal[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("Failed to fetch signals");
    throw error;
  }
  const data = await response.json();
  // API returns { signals: [...] }
  return data.signals ?? data;
};

export function useSignals(symbol?: string | null) {
  const params = symbol ? `?symbol=${encodeURIComponent(symbol)}` : "";

  const { data, error, isLoading } = useSWR<Signal[]>(
    `/api/signals${params}`,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 10_000,
    }
  );

  return {
    signals: data,
    isLoading,
    error: error as Error | undefined,
  };
}
