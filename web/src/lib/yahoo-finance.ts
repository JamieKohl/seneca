import type { Candle } from "@/types";

const CANDLE_CACHE_TTL = 300_000; // 5 minutes

interface CacheEntry {
  data: Candle[];
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Fetch historical candle data from Yahoo Finance (free, no API key required).
 * Uses the chart endpoint which returns OHLCV data.
 */
export async function getYahooCandles(
  symbol: string,
  days: number = 90
): Promise<Candle[]> {
  const cacheKey = `yahoo:${symbol}:${days}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const now = Math.floor(Date.now() / 1000);
  const from = now - days * 86400;

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${from}&period2=${now}&interval=1d`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const result = data?.chart?.result?.[0];

  if (!result) {
    throw new Error(`No data returned for symbol ${symbol}`);
  }

  const timestamps: number[] = result.timestamp ?? [];
  const quote = result.indicators?.quote?.[0];

  if (!quote || timestamps.length === 0) {
    return [];
  }

  const candles: Candle[] = [];

  for (let i = 0; i < timestamps.length; i++) {
    const open = quote.open?.[i];
    const high = quote.high?.[i];
    const low = quote.low?.[i];
    const close = quote.close?.[i];
    const volume = quote.volume?.[i];

    // Skip entries with null values (market holidays, etc.)
    if (open == null || high == null || low == null || close == null) {
      continue;
    }

    candles.push({
      time: timestamps[i],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume ?? 0,
    });
  }

  cache.set(cacheKey, { data: candles, expiresAt: Date.now() + CANDLE_CACHE_TTL });
  return candles;
}
