import type { StockQuote, Candle, StockSearchResult, NewsArticle } from "@/types";

const BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY ?? "";

// Rate limiting: max 60 calls per minute
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_CALLS_PER_WINDOW = 60;
const callTimestamps: number[] = [];

// Cache configuration
const QUOTE_CACHE_TTL = 15_000; // 15 seconds
const CANDLE_CACHE_TTL = 3_600_000; // 1 hour
const DEFAULT_CACHE_TTL = 60_000; // 1 minute fallback

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, { data, expiresAt: Date.now() + ttl });
}

async function enforceRateLimit(): Promise<void> {
  const now = Date.now();

  // Remove timestamps outside the current window
  while (callTimestamps.length > 0 && callTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    callTimestamps.shift();
  }

  if (callTimestamps.length >= MAX_CALLS_PER_WINDOW) {
    const oldestInWindow = callTimestamps[0];
    const waitMs = oldestInWindow + RATE_LIMIT_WINDOW_MS - now;
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  callTimestamps.push(Date.now());
}

async function fetchFinnhub<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  await enforceRateLimit();

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("token", API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Finnhub rate limit exceeded. Please wait before retrying.");
    }
    throw new Error(
      `Finnhub API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as T;
}

// Raw Finnhub response types
interface FinnhubQuoteResponse {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

interface FinnhubCandleResponse {
  s: string; // Status ("ok" or "no_data")
  t?: number[]; // Timestamps
  o?: number[]; // Open prices
  h?: number[]; // High prices
  l?: number[]; // Low prices
  c?: number[]; // Close prices
  v?: number[]; // Volumes
}

interface FinnhubSearchResponse {
  count: number;
  result: Array<{
    symbol: string;
    description: string;
    type: string;
  }>;
}

interface FinnhubNewsResponse {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

interface FinnhubProfileResponse {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export async function getQuote(symbol: string): Promise<StockQuote> {
  const cacheKey = `quote:${symbol}`;
  const cached = getCached<StockQuote>(cacheKey);
  if (cached) return cached;

  const raw = await fetchFinnhub<FinnhubQuoteResponse>("/quote", { symbol });

  const quote: StockQuote = {
    symbol,
    price: raw.c,
    change: raw.d,
    changePercent: raw.dp,
    high: raw.h,
    low: raw.l,
    open: raw.o,
    previousClose: raw.pc,
    volume: 0, // Volume not provided by /quote endpoint
    timestamp: raw.t,
  };

  setCache(cacheKey, quote, QUOTE_CACHE_TTL);
  return quote;
}

export async function getCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<Candle[]> {
  const cacheKey = `candles:${symbol}:${resolution}:${from}:${to}`;
  const cached = getCached<Candle[]>(cacheKey);
  if (cached) return cached;

  const raw = await fetchFinnhub<FinnhubCandleResponse>("/stock/candle", {
    symbol,
    resolution,
    from: from.toString(),
    to: to.toString(),
  });

  if (raw.s !== "ok" || !raw.t || !raw.o || !raw.h || !raw.l || !raw.c || !raw.v) {
    return [];
  }

  const candles: Candle[] = raw.t.map((time, i) => ({
    time,
    open: raw.o![i],
    high: raw.h![i],
    low: raw.l![i],
    close: raw.c![i],
    volume: raw.v![i],
  }));

  setCache(cacheKey, candles, CANDLE_CACHE_TTL);
  return candles;
}

export async function searchSymbols(query: string): Promise<StockSearchResult[]> {
  const cacheKey = `search:${query}`;
  const cached = getCached<StockSearchResult[]>(cacheKey);
  if (cached) return cached;

  const raw = await fetchFinnhub<FinnhubSearchResponse>("/search", { q: query });

  const results: StockSearchResult[] = raw.result.map((item) => ({
    symbol: item.symbol,
    description: item.description,
    type: item.type,
  }));

  setCache(cacheKey, results, DEFAULT_CACHE_TTL);
  return results;
}

export async function getCompanyNews(
  symbol: string,
  from: string,
  to: string
): Promise<NewsArticle[]> {
  const cacheKey = `news:${symbol}:${from}:${to}`;
  const cached = getCached<NewsArticle[]>(cacheKey);
  if (cached) return cached;

  const raw = await fetchFinnhub<FinnhubNewsResponse[]>("/company-news", {
    symbol,
    from,
    to,
  });

  const articles: NewsArticle[] = raw.map((item) => ({
    id: item.id.toString(),
    symbol,
    headline: item.headline,
    summary: item.summary || undefined,
    source: item.source || undefined,
    url: item.url || undefined,
    publishedAt: new Date(item.datetime * 1000).toISOString(),
  }));

  setCache(cacheKey, articles, DEFAULT_CACHE_TTL);
  return articles;
}

export async function getCompanyProfile(
  symbol: string
): Promise<FinnhubProfileResponse> {
  const cacheKey = `profile:${symbol}`;
  const cached = getCached<FinnhubProfileResponse>(cacheKey);
  if (cached) return cached;

  const profile = await fetchFinnhub<FinnhubProfileResponse>(
    "/stock/profile2",
    { symbol }
  );

  setCache(cacheKey, profile, CANDLE_CACHE_TTL);
  return profile;
}

/** Clear all cached entries. Useful for testing. */
export function clearCache(): void {
  cache.clear();
}
