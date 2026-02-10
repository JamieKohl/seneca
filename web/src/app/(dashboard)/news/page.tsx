"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Newspaper,
  Rss,
} from "lucide-react";
import { cn, getSentimentColor, timeAgo } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { NewsArticle } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
};

const sentimentIcons = {
  bullish: TrendingUp,
  bearish: TrendingDown,
  neutral: Minus,
};

export default function NewsPage() {
  const { watchlist } = useStore();
  const [symbolFilter, setSymbolFilter] = useState<string>("all");

  // Fetch news for each watchlist symbol
  const newsQueries = watchlist.map((symbol) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSWR<{ articles: NewsArticle[] }>(
      `/api/news?symbol=${encodeURIComponent(symbol)}`,
      fetcher,
      { dedupingInterval: 60_000 }
    )
  );

  const isLoading = newsQueries.some((q) => q.isLoading);
  const allArticles: NewsArticle[] = newsQueries
    .flatMap((q) => q.data?.articles ?? [])
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

  const filtered =
    symbolFilter === "all"
      ? allArticles
      : allArticles.filter((n) => n.symbol === symbolFilter);

  const bullishCount = allArticles.filter((n) => n.sentiment === "bullish").length;
  const bearishCount = allArticles.filter((n) => n.sentiment === "bearish").length;
  const neutralCount = allArticles.length - bullishCount - bearishCount;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <Rss className="h-24 w-24 text-amber-500" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Newspaper className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Market News</h1>
            <p className="text-sm text-zinc-400">
              Latest news with AI-powered sentiment analysis for your watchlist
            </p>
          </div>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-500">Bullish</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{bullishCount}</p>
          <p className="text-xs text-zinc-500">articles</p>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-red-500">Bearish</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{bearishCount}</p>
          <p className="text-xs text-zinc-500">articles</p>
        </div>
        <div className="rounded-xl border border-zinc-700 bg-zinc-500/5 p-4">
          <div className="flex items-center gap-2">
            <Minus className="h-5 w-5 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">Neutral / Unscored</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{neutralCount}</p>
          <p className="text-xs text-zinc-500">articles</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSymbolFilter("all")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            symbolFilter === "all"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:bg-zinc-800/50"
          )}
        >
          All Symbols
        </button>
        {watchlist.map((sym) => (
          <button
            key={sym}
            onClick={() => setSymbolFilter(sym)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              symbolFilter === sym
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-800/50"
            )}
          >
            {sym}
          </button>
        ))}
      </div>

      {/* News Feed */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Newspaper className="h-12 w-12 mb-3 text-zinc-700" />
          <p className="text-sm font-medium">No news articles found</p>
          <p className="text-xs mt-1">News will appear here for your watchlist stocks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((article) => {
            const sentiment = article.sentiment ?? "neutral";
            const SentimentIcon = sentimentIcons[sentiment as keyof typeof sentimentIcons] ?? Minus;
            const score = article.sentimentScore ?? 0;

            return (
              <div
                key={article.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-white">
                        {article.symbol}
                      </span>
                      {article.sentiment && (
                        <span
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                            getSentimentColor(sentiment)
                          )}
                        >
                          <SentimentIcon className="h-3 w-3" />
                          {sentiment}
                        </span>
                      )}
                      {article.publishedAt && (
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
                          {timeAgo(article.publishedAt)}
                        </span>
                      )}
                      {article.source && (
                        <span className="text-xs text-zinc-600">
                          {article.source}
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-white">
                      {article.headline}
                    </h3>
                    {article.summary && (
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {article.summary}
                      </p>
                    )}
                  </div>
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {/* Sentiment Score Bar */}
                {score !== 0 && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-zinc-500">Sentiment Score:</span>
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-800">
                      <div
                        className={cn(
                          "h-1.5 rounded-full",
                          score > 0.3
                            ? "bg-green-500"
                            : score < -0.3
                            ? "bg-red-500"
                            : "bg-zinc-500"
                        )}
                        style={{
                          width: `${Math.abs(score) * 100}%`,
                          marginLeft:
                            score < 0
                              ? `${(1 - Math.abs(score)) * 50}%`
                              : "50%",
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-400">
                      {score > 0 ? "+" : ""}
                      {score.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
