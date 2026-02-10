import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeStock } from "@/lib/ai-service";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");

  try {
    const where = symbol ? { symbol: symbol.toUpperCase() } : {};
    const signals = await prisma.signal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ signals });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch signals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { symbol } = await req.json();
    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    const analysis = await analyzeStock(symbol.toUpperCase(), []);

    const signal = await prisma.signal.create({
      data: {
        symbol: symbol.toUpperCase(),
        signalType: analysis.signal,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        technicalData: JSON.stringify({}),
        sentimentScore: null,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    return NextResponse.json(signal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate signal" },
      { status: 500 }
    );
  }
}
