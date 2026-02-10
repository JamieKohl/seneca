"use client";

import { cn, getSignalColor, timeAgo } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, Signal } from "lucide-react";
import { useSignals } from "@/hooks/useSignals";

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
      <div className="border-b border-zinc-800 p-4">
        <h3 className="font-semibold text-white">Recent Signals</h3>
      </div>
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      ) : signalsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
          <Signal className="h-8 w-8 mb-2 text-zinc-700" />
          <p className="text-sm">No signals yet</p>
          <p className="text-xs mt-1">Generate signals in AI Signals</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800">
          {signalsList.slice(0, 5).map((signal) => {
            const Icon = signalIcons[signal.signalType as keyof typeof signalIcons] ?? MinusCircle;
            return (
              <div key={signal.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg p-1.5", getSignalColor(signal.signalType))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{signal.symbol}</p>
                    <p className="text-xs text-zinc-500">{timeAgo(signal.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", getSignalColor(signal.signalType))}>
                    {signal.signalType}
                  </span>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {(signal.confidence * 100).toFixed(0)}% confidence
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
