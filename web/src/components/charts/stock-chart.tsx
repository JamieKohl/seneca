"use client";

import { useEffect, useRef, useState } from "react";
import type { Candle } from "@/types";

interface StockChartProps {
  symbol: string;
  candles?: Candle[];
  height?: number;
}

export function StockChart({ symbol, candles, height = 400 }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    async function initChart() {
      const lc = await import("lightweight-charts");

      if (!mounted || !containerRef.current) return;

      // Clean up existing chart
      if (chartRef.current) {
        chartRef.current.remove();
      }

      const chart = lc.createChart(containerRef.current, {
        height,
        layout: {
          background: { type: lc.ColorType.Solid, color: "transparent" },
          textColor: "#a1a1aa",
        },
        grid: {
          vertLines: { color: "#27272a" },
          horzLines: { color: "#27272a" },
        },
        crosshair: {
          mode: lc.CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: "#3f3f46",
        },
        timeScale: {
          borderColor: "#3f3f46",
          timeVisible: true,
        },
      });

      chartRef.current = chart;

      const candlestickSeries = chart.addSeries(lc.CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderDownColor: "#ef4444",
        borderUpColor: "#22c55e",
        wickDownColor: "#ef4444",
        wickUpColor: "#22c55e",
      });

      // Volume series
      const volumeSeries = chart.addSeries(lc.HistogramSeries, {
        color: "#3f3f46",
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
      });

      chart.priceScale("volume").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      if (!candles || candles.length === 0) {
        // Show empty state
        setIsLoading(false);
        return;
      }

      candlestickSeries.setData(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        candles.map((c) => ({
          time: c.time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        })) as any
      );

      volumeSeries.setData(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        candles.map((c) => ({
          time: c.time,
          value: c.volume,
          color: c.close >= c.open ? "#22c55e33" : "#ef444433",
        })) as any
      );

      chart.timeScale().fitContent();
      setIsLoading(false);
    }

    initChart();

    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol, candles, height]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      )}
      {!isLoading && (!candles || candles.length === 0) && (
        <div className="flex h-[400px] items-center justify-center text-zinc-500 text-sm">
          No chart data available
        </div>
      )}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
