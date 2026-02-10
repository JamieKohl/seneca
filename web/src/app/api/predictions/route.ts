import { NextRequest, NextResponse } from "next/server";
import { getCandles, getQuote } from "@/lib/finnhub";
import { getYahooCandles } from "@/lib/yahoo-finance";
import { prisma } from "@/lib/db";

export interface PredictionData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  candles: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  predictedCandles: Array<{ time: number; value: number }>;
  direction: "up" | "down";
  signalType: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  priceTarget: number;
  stopLoss: number;
  entryPrice: number;
  predictedMove: number;
  timeframe: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
}

function computePrediction(
  symbol: string,
  candles: Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>,
  signal: {
    signalType: string;
    confidence: number;
    reasoning: string;
    expiresAt: Date | null;
  } | null,
  currentPrice: number,
  change: number,
  changePercent: number
): PredictionData {
  const lastCandle = candles[candles.length - 1];
  const close = lastCandle?.close ?? currentPrice;

  // Compute simple moving averages for trend detection
  const recentCloses = candles.slice(-20).map((c) => c.close);
  const sma20 =
    recentCloses.length > 0
      ? recentCloses.reduce((a, b) => a + b, 0) / recentCloses.length
      : close;
  const longerCloses = candles.slice(-50).map((c) => c.close);
  const sma50 =
    longerCloses.length > 0
      ? longerCloses.reduce((a, b) => a + b, 0) / longerCloses.length
      : close;

  // Determine direction from signal or technicals
  let direction: "up" | "down";
  let signalType: "BUY" | "SELL" | "HOLD";
  let confidence: number;
  let reasoning: string;

  if (signal) {
    signalType = signal.signalType as "BUY" | "SELL" | "HOLD";
    confidence = signal.confidence;
    reasoning = signal.reasoning;
    direction = signalType === "SELL" ? "down" : "up";
  } else {
    // Derive from technicals if no AI signal exists
    const trend = close > sma20 && sma20 > sma50 ? "up" : close < sma20 && sma20 < sma50 ? "down" : "neutral";
    direction = trend === "down" ? "down" : "up";
    signalType = trend === "up" ? "BUY" : trend === "down" ? "SELL" : "HOLD";

    // Compute a rough confidence from how far price is from SMAs
    const deviation = Math.abs(close - sma20) / sma20;
    confidence = Math.min(0.5 + deviation * 5, 0.95);
    reasoning = `Technical analysis: Price ${close > sma20 ? "above" : "below"} 20-day SMA (${sma20.toFixed(2)}), ${close > sma50 ? "above" : "below"} 50-day SMA (${sma50.toFixed(2)}).`;
  }

  // Compute price target and stop-loss based on volatility
  const recentHighs = candles.slice(-20).map((c) => c.high);
  const recentLows = candles.slice(-20).map((c) => c.low);
  const avgRange =
    recentHighs.length > 0
      ? recentHighs.reduce((a, b, i) => a + (b - recentLows[i]), 0) /
        recentHighs.length
      : close * 0.02;

  const volatilityMultiplier = 2.5;
  const priceTarget =
    direction === "up"
      ? close + avgRange * volatilityMultiplier
      : close - avgRange * volatilityMultiplier;
  const stopLoss =
    direction === "up"
      ? close - avgRange * 1.5
      : close + avgRange * 1.5;

  const predictedMove = ((priceTarget - close) / close) * 100;

  // Generate predicted price trajectory (extending 14 days into the future)
  const lastTime = lastCandle?.time ?? Math.floor(Date.now() / 1000);
  const daySeconds = 86400;
  const predictionDays = 14;
  const predictedCandles: Array<{ time: number; value: number }> = [
    { time: lastTime, value: close },
  ];

  for (let i = 1; i <= predictionDays; i++) {
    const progress = i / predictionDays;
    // Ease-out curve for more natural prediction trajectory
    const easedProgress = 1 - Math.pow(1 - progress, 2);
    const predicted = close + (priceTarget - close) * easedProgress;
    predictedCandles.push({
      time: lastTime + i * daySeconds,
      value: parseFloat(predicted.toFixed(2)),
    });
  }

  const riskLevel: "LOW" | "MEDIUM" | "HIGH" =
    confidence >= 0.8 ? "LOW" : confidence >= 0.6 ? "MEDIUM" : "HIGH";

  return {
    symbol,
    currentPrice,
    change,
    changePercent,
    candles,
    predictedCandles,
    direction,
    signalType,
    confidence,
    reasoning,
    priceTarget: parseFloat(priceTarget.toFixed(2)),
    stopLoss: parseFloat(stopLoss.toFixed(2)),
    entryPrice: close,
    predictedMove: parseFloat(predictedMove.toFixed(2)),
    timeframe: "2W",
    riskLevel,
    createdAt: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const symbolsParam = req.nextUrl.searchParams.get("symbols");

  if (!symbolsParam) {
    return NextResponse.json(
      { error: "symbols parameter is required (comma-separated)" },
      { status: 400 }
    );
  }

  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 10);

  try {
    const now = Math.floor(Date.now() / 1000);
    const from = now - 90 * 86400;

    const predictions: PredictionData[] = await Promise.all(
      symbols.map(async (symbol) => {
        // Fetch candles, quote, and latest signal in parallel
        // Try Finnhub candles first, fall back to Yahoo Finance
        const finnhubCandles = await getCandles(symbol, "D", from, now).catch(() => []);
        const candlesPromise = finnhubCandles.length > 0
          ? Promise.resolve(finnhubCandles)
          : getYahooCandles(symbol, 90).catch(() => []);

        const [candles, quote, signals] = await Promise.all([
          candlesPromise,
          getQuote(symbol).catch(() => null),
          prisma.signal
            .findMany({
              where: {
                symbol,
                expiresAt: { gte: new Date() },
              },
              orderBy: { createdAt: "desc" },
              take: 1,
            })
            .catch(() => []),
        ]);

        const currentPrice = quote?.price ?? candles[candles.length - 1]?.close ?? 0;
        const change = quote?.change ?? 0;
        const changePercent = quote?.changePercent ?? 0;
        const latestSignal = signals.length > 0 ? signals[0] : null;

        return computePrediction(
          symbol,
          candles,
          latestSignal,
          currentPrice,
          change,
          changePercent
        );
      })
    );

    return NextResponse.json(predictions);
  } catch (error) {
    console.error("Failed to generate predictions:", error);
    return NextResponse.json(
      { error: "Failed to generate predictions" },
      { status: 500 }
    );
  }
}
