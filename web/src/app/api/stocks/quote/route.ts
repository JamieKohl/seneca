import { NextRequest, NextResponse } from "next/server";
import { getQuote } from "@/lib/finnhub";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol is required" },
      { status: 400 }
    );
  }

  try {
    const quote = await getQuote(symbol.toUpperCase());
    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}
