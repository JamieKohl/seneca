"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usePortfolio } from "@/hooks/usePortfolio";

interface PortfolioChartProps {
  data?: { date: string; value: number }[];
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  const { holdings } = usePortfolio();
  const holdingsList = holdings ?? [];

  // If no explicit data passed and no holdings, show empty state
  if (!data && holdingsList.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-zinc-500 text-sm">
        Add holdings to see portfolio performance
      </div>
    );
  }

  // Use passed data or generate from cost basis as a baseline
  const chartData = data ?? holdingsList.map((h, i) => ({
    date: new Date(h.purchaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: h.avgCostBasis * h.quantity,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-zinc-500 text-sm">
        No data to display
      </div>
    );
  }

  const startValue = chartData[0]?.value ?? 0;
  const endValue = chartData[chartData.length - 1]?.value ?? 0;
  const isPositive = endValue >= startValue;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="date"
          stroke="#71717a"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#71717a"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => [
            `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            "Portfolio Value",
          ]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={isPositive ? "#22c55e" : "#ef4444"}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: isPositive ? "#22c55e" : "#ef4444" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
