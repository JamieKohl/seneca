"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AllocationChartProps {
  holdings?: { symbol: string; quantity: number; avgCostBasis: number }[];
  data?: { name: string; value: number }[];
}

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export function AllocationChart({ holdings, data }: AllocationChartProps) {
  // Build chart data from holdings or use explicit data
  const chartData = data ?? (holdings ?? []).map((h) => ({
    name: h.symbol,
    value: parseFloat((h.avgCostBasis * h.quantity).toFixed(2)),
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-zinc-500 text-sm">
        No holdings to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => [
            `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
          ]}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: "#a1a1aa", fontSize: "12px" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
