"use client";

import { cn, getChangeColor } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeValue?: number;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeValue = 0,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <Icon className="h-5 w-5 text-zinc-500" />
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-white">{value}</p>
        {change && (
          <p className={cn("mt-1 text-sm font-medium", getChangeColor(changeValue))}>
            {change}
          </p>
        )}
        {description && (
          <p className="mt-1 text-xs text-zinc-500">{description}</p>
        )}
      </div>
    </div>
  );
}
