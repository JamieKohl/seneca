import type { Candle, Signal, AIAnalysis } from "@/types";

const BASE_URL = process.env.AI_SERVICE_URL ?? "http://localhost:8000";

interface SentimentInput {
  headline: string;
  summary: string;
}

interface SentimentResult {
  headline: string;
  sentiment: "bullish" | "bearish" | "neutral";
  score: number;
}

interface HealthCheckResponse {
  status: string;
  version?: string;
  uptime?: number;
}

class AIServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AIServiceError";
    this.status = status;
  }
}

async function fetchAIService<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.detail ?? errorBody.message ?? response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new AIServiceError(
      `AI Service error (${response.status}): ${errorMessage}`,
      response.status
    );
  }

  const data = await response.json();
  return data as T;
}

/**
 * Send candle data to the AI service for stock analysis.
 * Returns a comprehensive AI analysis including signal, confidence, and reasoning.
 */
export async function analyzeStock(
  symbol: string,
  candles: Candle[]
): Promise<AIAnalysis> {
  return fetchAIService<AIAnalysis>("/analyze", {
    method: "POST",
    body: JSON.stringify({ symbol, candles }),
  });
}

/**
 * Generate trading signals for a list of symbols.
 * The AI service will fetch necessary data and return signals.
 */
export async function generateSignals(symbols: string[]): Promise<Signal[]> {
  const query = symbols.join(",");
  return fetchAIService<Signal[]>(
    `/signals/generate?symbols=${encodeURIComponent(query)}`
  );
}

/**
 * Analyze sentiment of news articles.
 * Accepts an array of headlines with summaries and returns sentiment scores.
 */
export async function analyzeSentiment(
  articles: SentimentInput[]
): Promise<SentimentResult[]> {
  return fetchAIService<SentimentResult[]>("/sentiment/analyze", {
    method: "POST",
    body: JSON.stringify({ articles }),
  });
}

/**
 * Check if the AI microservice is healthy and reachable.
 */
export async function healthCheck(): Promise<HealthCheckResponse> {
  return fetchAIService<HealthCheckResponse>("/health");
}
