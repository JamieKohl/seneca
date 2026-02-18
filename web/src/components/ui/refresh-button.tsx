"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RefreshButtonProps {
  onRefresh: () => void | Promise<void>;
  className?: string;
}

export function RefreshButton({ onRefresh, className }: RefreshButtonProps) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = async () => {
    setSpinning(true);
    await onRefresh();
    setTimeout(() => setSpinning(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={spinning}
      className={cn(
        "rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors btn-invert-click",
        className
      )}
      title="Refresh"
    >
      <RefreshCw className={cn("h-4 w-4", spinning && "refresh-spin")} />
    </button>
  );
}
