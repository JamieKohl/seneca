import { NextRequest, NextResponse } from "next/server";
import { searchSymbols } from "@/lib/finnhub";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchSymbols(query);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search symbols" },
      { status: 500 }
    );
  }
}
