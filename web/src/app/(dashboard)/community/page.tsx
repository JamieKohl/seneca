"use client";

import { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter,
  Flame,
  Star,
  Send,
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  avatar: string;
  tier: "free" | "pro";
  content: string;
  symbol?: string;
  signal?: "BUY" | "SELL" | "HOLD";
  confidence?: number;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

const posts: Post[] = [
  {
    id: "1",
    author: "AlphaTrader99",
    avatar: "bg-emerald-500",
    tier: "pro",
    content: "Just got the BUY alert on NVDA with 92% confidence. The AI reasoning about the data center demand growth is spot on. Loading up.",
    symbol: "NVDA",
    signal: "BUY",
    confidence: 92,
    likes: 47,
    comments: 12,
    timestamp: "2 hours ago",
    liked: false,
  },
  {
    id: "2",
    author: "NightOwlCapital",
    avatar: "bg-blue-500",
    tier: "pro",
    content: "KohlCorp's SELL alert on TSLA last week saved me from a 15% drop. This app pays for itself.",
    symbol: "TSLA",
    signal: "SELL",
    confidence: 78,
    likes: 83,
    comments: 24,
    timestamp: "4 hours ago",
    liked: true,
  },
  {
    id: "3",
    author: "ValueHunter",
    avatar: "bg-teal-500",
    tier: "free",
    content: "Anyone else watching JPM earnings this week? The AI prediction chart shows strong upside potential. Thinking of adding to my position on Fidelity.",
    symbol: "JPM",
    likes: 21,
    comments: 8,
    timestamp: "6 hours ago",
    liked: false,
  },
  {
    id: "4",
    author: "DiamondHands42",
    avatar: "bg-orange-500",
    tier: "free",
    content: "New to KohlCorp! Just logged all my Robinhood positions. Love how it tracks everything without needing broker access. The sector breakdown is chef's kiss.",
    likes: 35,
    comments: 6,
    timestamp: "8 hours ago",
    liked: false,
  },
  {
    id: "5",
    author: "MomentumKing",
    avatar: "bg-pink-500",
    tier: "pro",
    content: "The price alerts feature is underrated. Set alerts for AAPL at $230 and META at $600 — both triggered within a day. Immediate notifications.",
    symbol: "AAPL",
    likes: 56,
    comments: 15,
    timestamp: "12 hours ago",
    liked: true,
  },
];

export default function CommunityPage() {
  const [feed, setFeed] = useState(posts);
  const [newPost, setNewPost] = useState("");
  const [filter, setFilter] = useState<"trending" | "latest" | "signals">("trending");

  const handleLike = (id: string) => {
    setFeed(feed.map((p) =>
      p.id === id
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const filteredPosts = filter === "signals" ? feed.filter((p) => p.signal) : feed;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-indigo-500/10 via-zinc-900 to-zinc-900 p-6">
        <MessageSquare className="absolute -right-4 -top-4 h-32 w-32 text-indigo-500/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">Community</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Share insights, discuss signals, and learn from other traders
          </p>
        </div>
      </div>

      {/* Compose */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            Y
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your trade idea or market insight..."
              rows={2}
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500/50 focus:outline-none transition-colors"
            />
            <div className="mt-2 flex justify-end">
              <button
                disabled={!newPost.trim()}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {([
          { key: "trending" as const, label: "Trending", icon: Flame },
          { key: "latest" as const, label: "Latest", icon: Clock },
          { key: "signals" as const, label: "Signals Only", icon: TrendingUp },
        ]).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
              filter === f.key
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:text-white"
            }`}
          >
            <f.icon className="h-3.5 w-3.5" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3"
          >
            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full ${post.avatar} flex items-center justify-center text-xs font-bold text-white`}>
                  {post.author[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{post.author}</span>
                    {post.tier === "pro" && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500">{post.timestamp}</span>
                </div>
              </div>
              {post.signal && (
                <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${
                  post.signal === "BUY"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : post.signal === "SELL"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-amber-500/10 text-amber-400"
                }`}>
                  {post.signal === "BUY" ? <TrendingUp className="h-3.5 w-3.5" /> : post.signal === "SELL" ? <TrendingDown className="h-3.5 w-3.5" /> : null}
                  {post.symbol} · {post.signal}
                  {post.confidence && <span className="ml-1 opacity-70">{post.confidence}%</span>}
                </div>
              )}
            </div>

            {/* Content */}
            <p className="text-sm text-zinc-300 leading-relaxed">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  post.liked ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <ThumbsUp className={`h-3.5 w-3.5 ${post.liked ? "fill-indigo-400" : ""}`} />
                {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <MessageSquare className="h-3.5 w-3.5" />
                {post.comments}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
