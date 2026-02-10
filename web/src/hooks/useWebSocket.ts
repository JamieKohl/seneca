"use client";

import { useEffect, useRef, useCallback } from "react";

interface PriceUpdate {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

type OnPriceCallback = (
  symbol: string,
  price: number,
  volume: number,
  timestamp: number
) => void;

/**
 * Hook for real-time stock price updates.
 *
 * Since we cannot expose the Finnhub API key to the client, this hook
 * uses a polling fallback that fetches quotes from our own API route
 * every 15 seconds.
 *
 * Pass an array of symbols to watch and a callback that receives each
 * price update.
 */
export function useWebSocket(symbols: string[], onPrice: OnPriceCallback) {
  const onPriceRef = useRef(onPrice);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep the callback ref up to date without causing re-renders
  useEffect(() => {
    onPriceRef.current = onPrice;
  }, [onPrice]);

  const fetchQuotes = useCallback(async () => {
    if (symbols.length === 0) return;

    const results = await Promise.allSettled(
      symbols.map(async (symbol) => {
        const response = await fetch(
          `/api/stocks/quote?symbol=${encodeURIComponent(symbol)}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch quote for ${symbol}`);
        }
        const data = await response.json();
        return {
          symbol,
          price: data.price,
          volume: data.volume,
          timestamp: data.timestamp,
        } as PriceUpdate;
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        const { symbol, price, volume, timestamp } = result.value;
        onPriceRef.current(symbol, price, volume, timestamp);
      }
    }
  }, [symbols]);

  useEffect(() => {
    // Fetch immediately on mount / symbols change
    fetchQuotes();

    // Then poll every 15 seconds
    intervalRef.current = setInterval(fetchQuotes, 15_000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchQuotes]);
}
