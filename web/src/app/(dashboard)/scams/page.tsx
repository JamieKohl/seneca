"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Send,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  Loader2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ScamType = "call" | "text" | "email";

interface AnalysisResult {
  riskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  category: string;
  redFlags: string[];
  analysis: string;
  recommendedAction: string;
}

interface HistoryItem {
  id: string;
  type: ScamType;
  content: string;
  riskScore: number;
  createdAt: string;
}

const typeConfig = {
  call: { label: "Call", icon: Phone },
  text: { label: "Text", icon: MessageSquare },
  email: { label: "Email", icon: Mail },
} as const;

function getRiskColor(score: number) {
  if (score > 80) return "text-red-500";
  if (score > 60) return "text-orange-500";
  if (score > 30) return "text-yellow-500";
  return "text-green-500";
}

function getRiskBgColor(score: number) {
  if (score > 80) return "bg-red-500/10 border-red-500/20";
  if (score > 60) return "bg-orange-500/10 border-orange-500/20";
  if (score > 30) return "bg-yellow-500/10 border-yellow-500/20";
  return "bg-green-500/10 border-green-500/20";
}

function getRiskLevelBadge(level: string) {
  switch (level) {
    case "critical":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "low":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
}

export default function ScamFirewallPage() {
  const [type, setType] = useState<ScamType>("text");
  const [sender, setSender] = useState("");
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/scams/analyze");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch {
        // silently fail
      } finally {
        setHistoryLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch("/api/scams/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, sender, content }),
      });
      const data = await res.json();
      setResult(data);

      // Refresh history after new analysis
      const historyRes = await fetch("/api/scams/analyze");
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }
    } catch {
      // handle error silently
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-red-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-red-500/5 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-400" />
            <h1 className="text-2xl font-bold text-white">Scam Firewall</h1>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Submit suspicious messages, calls, or emails for AI-powered scam
            detection and analysis.
          </p>
        </div>
      </div>

      {/* Analysis Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-5">
          {/* Type Selector */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Message Type
            </label>
            <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/30 p-1 w-fit">
              {(["call", "text", "email"] as const).map((t) => {
                const config = typeConfig[t];
                const Icon = config.icon;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                      type === t
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sender Field */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Sender{" "}
              <span className="normal-case tracking-normal text-zinc-600">
                (optional - phone number or email)
              </span>
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={
                type === "email"
                  ? "e.g. suspicious@example.com"
                  : "e.g. +1 (555) 123-4567"
              }
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Suspicious Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the suspicious message, email body, or describe the phone call here..."
              rows={6}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing || !content.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-600 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      {/* Analysis Result */}
      {result && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <Shield className="h-5 w-5 text-blue-500" />
            Analysis Result
          </h2>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6">
            {/* Risk Score + Level + Category row */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Risk Score */}
              <div
                className={cn(
                  "flex flex-col items-center rounded-xl border p-5",
                  getRiskBgColor(result.riskScore)
                )}
              >
                <span
                  className={cn(
                    "text-5xl font-black tabular-nums",
                    getRiskColor(result.riskScore)
                  )}
                >
                  {result.riskScore}
                </span>
                <span className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Risk Score
                </span>
              </div>

              <div className="space-y-3">
                {/* Risk Level Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Risk Level
                  </span>
                  <span
                    className={cn(
                      "rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider",
                      getRiskLevelBadge(result.riskLevel)
                    )}
                  >
                    {result.riskLevel}
                  </span>
                </div>

                {/* Category */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Category
                  </span>
                  <span className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300">
                    {result.category}
                  </span>
                </div>

                {/* Recommended Action */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Action
                  </span>
                  <span
                    className={cn(
                      "rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider",
                      result.recommendedAction === "block"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : result.recommendedAction === "report"
                        ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20"
                    )}
                  >
                    {result.recommendedAction}
                  </span>
                </div>
              </div>
            </div>

            {/* Red Flags */}
            {result.redFlags && result.redFlags.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  Red Flags Detected
                </h3>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2"
                    >
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      <span className="text-sm text-zinc-300">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Analysis */}
            {result.analysis && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-white">
                  AI Analysis
                </h3>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {result.analysis}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Analyses */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Clock className="h-5 w-5 text-zinc-400" />
          Recent Analyses
        </h2>

        {historyLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-600" />
              <p className="text-sm text-zinc-500">Loading history...</p>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/50 mb-4">
              <ShieldAlert className="h-7 w-7 text-zinc-600" />
            </div>
            <p className="text-sm font-semibold text-zinc-400">
              No analyses yet
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Submit a suspicious message above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const config = typeConfig[item.type] ?? typeConfig.text;
              const Icon = config.icon;
              return (
                <div
                  key={item.id}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="rounded-lg bg-zinc-800 p-2 shrink-0">
                        <Icon className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            {config.label}
                          </span>
                          <span
                            className={cn(
                              "rounded-md border px-2 py-0.5 text-[10px] font-bold",
                              getRiskBgColor(item.riskScore),
                              getRiskColor(item.riskScore)
                            )}
                          >
                            Risk: {item.riskScore}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-zinc-300 line-clamp-2">
                          {item.content.length > 100
                            ? item.content.slice(0, 100) + "..."
                            : item.content}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
