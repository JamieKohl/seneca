"use client";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 4 }: TableSkeletonProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-zinc-800 px-4 py-3 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1">
            <div className="h-3 rounded skeleton-shimmer" style={{ width: `${60 + Math.random() * 30}%` }} />
          </div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex border-b border-zinc-800/50 px-4 py-3.5 gap-4">
          {Array.from({ length: cols }).map((_, col) => (
            <div key={col} className="flex-1">
              <div
                className="h-3.5 rounded skeleton-shimmer"
                style={{
                  width: `${40 + Math.random() * 40}%`,
                  animationDelay: `${(row * cols + col) * 0.05}s`,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
