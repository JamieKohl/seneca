import useSWR from "swr";
import type { Candle } from "@/types";

const fetcher = async (url: string): Promise<Candle[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch candles");
  }
  return response.json();
};

export function useCandles(
  symbol: string | null,
  resolution: string = "D",
  days: number = 90
) {
  const now = Math.floor(Date.now() / 1000);
  const from = now - days * 86400;

  const { data, error, isLoading } = useSWR<Candle[]>(
    symbol
      ? `/api/stocks/candles?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${now}`
      : null,
    fetcher,
    {
      refreshInterval: 60_000,
      revalidateOnFocus: true,
      dedupingInterval: 30_000,
    }
  );

  return {
    candles: data,
    isLoading,
    error: error as Error | undefined,
  };
}
