import { NextRequest, NextResponse } from "next/server";
import { analyzeStock } from "@/lib/ai-service";

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
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: "AI analysis failed" },
      { status: 500 }
    );
  }
}
