import useSWR from "swr";
import type { PortfolioHolding, PortfolioSummary } from "@/types";

interface PortfolioResponse {
  holdings: PortfolioHolding[];
  summary: PortfolioSummary;
}

const fetcher = async (url: string): Promise<PortfolioResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("Failed to fetch portfolio");
    throw error;
  }
  return response.json();
};

export function usePortfolio() {
  const { data, error, isLoading, mutate } = useSWR<PortfolioResponse>(
    "/api/portfolio",
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 10_000,
    }
  );

  return {
    holdings: data?.holdings,
    summary: data?.summary,
    isLoading,
    error: error as Error | undefined,
    mutate,
  };
}
