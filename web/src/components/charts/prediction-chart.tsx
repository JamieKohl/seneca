"use client";

import { useEffect, useRef, useState } from "react";
import type { Candle } from "@/types";

interface PredictionChartProps {
  symbol: string;
  candles: Candle[];
  predictedCandles: Array<{ time: number; value: number }>;
  priceTarget: number;
  stopLoss: number;
  direction: "up" | "down";
  entryPrice: number;
  height?: number;
}

export function PredictionChart({
  symbol,
  candles,
  predictedCandles,
  priceTarget,
  stopLoss,
  direction,
  entryPrice,
  height = 500,
}: PredictionChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || candles.length === 0) return;

    let mounted = true;

    async function initChart() {
      const lc = await import("lightweight-charts");

      if (!mounted || !containerRef.current) return;

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

      // Candlestick series for historical data
      const candlestickSeries = chart.addSeries(lc.CandlestickSeries, {
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderDownColor: "#ef4444",
        borderUpColor: "#22c55e",
        wickDownColor: "#ef4444",
        wickUpColor: "#22c55e",
      });

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

      // Volume series
      const volumeSeries = chart.addSeries(lc.HistogramSeries, {
        color: "#3f3f46",
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
      });

      chart.priceScale("volume").applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      volumeSeries.setData(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        candles.map((c) => ({
          time: c.time,
          value: c.volume,
          color: c.close >= c.open ? "#22c55e33" : "#ef444433",
        })) as any
      );

      // Prediction line series (dashed line extending into the future)
      if (predictedCandles.length > 0) {
        const predictionSeries = chart.addSeries(lc.LineSeries, {
          color: direction === "up" ? "#22c55e" : "#ef4444",
          lineWidth: 2,
          lineStyle: lc.LineStyle.Dashed,
          priceLineVisible: false,
          lastValueVisible: true,
          crosshairMarkerVisible: true,
        });

        predictionSeries.setData(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          predictedCandles.map((c) => ({
            time: c.time,
            value: c.value,
          })) as any
        );

        // Prediction confidence band (upper and lower area)
        const spread = Math.abs(priceTarget - entryPrice);
        const bandSeries = chart.addSeries(lc.LineSeries, {
          color: direction === "up" ? "#22c55e22" : "#ef444422",
          lineWidth: 0,
          lineVisible: false,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });

        const upperBand = chart.addSeries(lc.LineSeries, {
          color: direction === "up" ? "#22c55e33" : "#ef444433",
          lineWidth: 1,
          lineStyle: lc.LineStyle.Dotted,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });

        const lowerBand = chart.addSeries(lc.LineSeries, {
          color: direction === "up" ? "#22c55e33" : "#ef444433",
          lineWidth: 1,
          lineStyle: lc.LineStyle.Dotted,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });

        upperBand.setData(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          predictedCandles.map((c) => ({
            time: c.time,
            value: c.value + spread * 0.3,
          })) as any
        );

        lowerBand.setData(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          predictedCandles.map((c) => ({
            time: c.time,
            value: c.value - spread * 0.3,
          })) as any
        );
      }

      // Price target horizontal line
      candlestickSeries.createPriceLine({
        price: priceTarget,
        color: "#22c55e",
        lineWidth: 1,
        lineStyle: lc.LineStyle.Dashed,
        axisLabelVisible: true,
        title: `Target: $${priceTarget.toFixed(2)}`,
      });

      // Stop-loss horizontal line
      candlestickSeries.createPriceLine({
        price: stopLoss,
        color: "#ef4444",
        lineWidth: 1,
        lineStyle: lc.LineStyle.Dashed,
        axisLabelVisible: true,
        title: `Stop: $${stopLoss.toFixed(2)}`,
      });

      // Entry price line
      candlestickSeries.createPriceLine({
        price: entryPrice,
        color: "#eab308",
        lineWidth: 1,
        lineStyle: lc.LineStyle.Dotted,
        axisLabelVisible: true,
        title: `Entry: $${entryPrice.toFixed(2)}`,
      });

      // Add BUY/SELL marker on the last candle
      const lastCandle = candles[candles.length - 1];
      if (lastCandle) {
        candlestickSeries.setMarkers([
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            time: lastCandle.time as any,
            position: direction === "up" ? "belowBar" : "aboveBar",
            color: direction === "up" ? "#22c55e" : "#ef4444",
            shape: direction === "up" ? "arrowUp" : "arrowDown",
            text: direction === "up" ? "BUY" : "SELL",
          },
        ]);
      }

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
  }, [symbol, candles, predictedCandles, priceTarget, stopLoss, direction, entryPrice, height]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
        </div>
      )}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
