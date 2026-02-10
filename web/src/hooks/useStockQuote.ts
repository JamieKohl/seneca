import useSWR from "swr";
import type { StockQuote } from "@/types";

const fetcher = async (url: string): Promise<StockQuote> => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("Failed to fetch stock quote");
    throw error;
  }
  return response.json();
};

export function useStockQuote(symbol: string | null) {
  const { data, error, isLoading } = useSWR<StockQuote>(
    symbol ? `/api/stocks/quote?symbol=${encodeURIComponent(symbol)}` : null,
    fetcher,
    {
      refreshInterval: 15_000,
      revalidateOnFocus: true,
      dedupingInterval: 5_000,
    }
  );

  return {
    quote: data,
    isLoading,
    error: error as Error | undefined,
  };
}
