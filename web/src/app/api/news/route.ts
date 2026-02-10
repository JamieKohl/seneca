import { NextRequest, NextResponse } from "next/server";
import { getCompanyNews } from "@/lib/finnhub";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol is required" },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cached = await prisma.cachedArticle.findMany({
      where: {
        symbol: symbol.toUpperCase(),
        createdAt: { gte: new Date(Date.now() - 3600000) }, // 1 hour cache
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    if (cached.length > 0) {
      return NextResponse.json({ articles: cached });
    }

    // Fetch from Finnhub
    const now = new Date();
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const articles = await getCompanyNews(
      symbol.toUpperCase(),
      weekAgo.toISOString().split("T")[0],
      now.toISOString().split("T")[0]
    );

    // Cache articles
    for (const article of articles.slice(0, 20)) {
      await prisma.cachedArticle.create({
        data: {
          symbol: symbol.toUpperCase(),
          headline: article.headline,
          summary: article.summary || "",
          source: article.source,
          url: article.url,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
        },
      });
    }

    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
