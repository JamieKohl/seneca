import { NextRequest, NextResponse } from "next/server";
import { getCandles } from "@/lib/finnhub";
import { getYahooCandles } from "@/lib/yahoo-finance";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const resolution = req.nextUrl.searchParams.get("resolution") || "D";
  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol is required" },
      { status: 400 }
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const defaultFrom = now - 90 * 86400; // 90 days ago

  try {
    // Try Finnhub first, fall back to Yahoo Finance for candle data
    let candles = await getCandles(
      symbol.toUpperCase(),
      resolution,
      from ? parseInt(from) : defaultFrom,
      to ? parseInt(to) : now
    ).catch(() => []);

    if (candles.length === 0) {
      const days = from
        ? Math.ceil((now - parseInt(from)) / 86400)
        : 90;
      candles = await getYahooCandles(symbol.toUpperCase(), days);
    }

    return NextResponse.json(candles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch candles" },
      { status: 500 }
    );
  }
}
