import useSWR from "swr";
import type { PredictionData } from "@/app/api/predictions/route";

const fetcher = async (url: string): Promise<PredictionData[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch predictions");
  }
  return response.json();
};

export function usePredictions(symbols: string[]) {
  const key =
    symbols.length > 0
      ? `/api/predictions?symbols=${symbols.map(encodeURIComponent).join(",")}`
      : null;

  const { data, error, isLoading, mutate } = useSWR<PredictionData[]>(
    key,
    fetcher,
    {
      refreshInterval: 60_000,
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
    }
  );

  return {
    predictions: data,
    isLoading,
    error: error as Error | undefined,
    refresh: mutate,
  };
}
