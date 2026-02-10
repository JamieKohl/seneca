"use client";

import { cn, getSignalColor, timeAgo } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, Signal, ArrowRight } from "lucide-react";
import { useSignals } from "@/hooks/useSignals";
import Link from "next/link";

const signalIcons = {
  BUY: ArrowUpCircle,
  SELL: ArrowDownCircle,
  HOLD: MinusCircle,
};

export function RecentSignalsCard() {
  const { signals, isLoading } = useSignals();
  const signalsList = signals ?? [];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Signal className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
        </div>
        {signalsList.length > 0 && (
          <Link
            href="/signals"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      ) : signalsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/50 mb-3">
            <Signal className="h-6 w-6 text-zinc-600" />
          </div>
          <p className="text-sm font-medium">No alerts yet</p>
          <p className="text-xs mt-1 text-zinc-600">Generate signals to get started</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/50">
          {signalsList.slice(0, 5).map((signal) => {
            const Icon = signalIcons[signal.signalType as keyof typeof signalIcons] ?? MinusCircle;
            return (
              <div key={signal.id} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg p-1.5", getSignalColor(signal.signalType))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{signal.symbol}</p>
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold", getSignalColor(signal.signalType))}>
                        {signal.signalType}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{timeAgo(signal.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-10 rounded-full bg-zinc-800">
                      <div
                        className={cn(
                          "h-1 rounded-full",
                          signal.signalType === "BUY" ? "bg-green-500" : signal.signalType === "SELL" ? "bg-red-500" : "bg-yellow-500"
                        )}
                        style={{ width: `${signal.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">
                      {(signal.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
