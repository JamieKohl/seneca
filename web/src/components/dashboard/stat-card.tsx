"use client";

import { cn, getChangeColor } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeValue?: number;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeValue = 0,
  icon: Icon,
  description,
  iconColor = "text-blue-600 bg-blue-600/10",
}: StatCardProps) {
  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white truncate font-data">{value}</p>
          {change && (
            <div className="mt-1 flex items-center gap-1">
              {changeValue > 0 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : changeValue < 0 ? (
                <TrendingDown className="h-3 w-3 text-green-500" />
              ) : null}
              <p className={cn("text-sm font-medium", getChangeColor(changeValue))}>
                {change}
              </p>
            </div>
          )}
          {description && (
            <p className="mt-1 text-xs text-zinc-500 truncate">{description}</p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
