"use client";

import { useState } from "react";
import {
  Brain,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  RefreshCw,
  Activity,
} from "lucide-react";
import { cn, formatCurrency, formatPercent, getSignalColor } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { usePredictions } from "@/hooks/usePredictions";
import { PredictionChart } from "@/components/charts/prediction-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import type { PredictionData } from "@/app/api/predictions/route";

const signalIcons = {
  BUY: ArrowUpCircle,
  SELL: ArrowDownCircle,
  HOLD: MinusCircle,
};

const riskColors = {
  LOW: "text-green-500 bg-green-500/10",
  MEDIUM: "text-yellow-500 bg-yellow-500/10",
  HIGH: "text-red-500 bg-red-500/10",
};

export default function PredictionsPage() {
  const { selectedSymbol, setSelectedSymbol, watchlist } = useStore();
  const { predictions, isLoading, error, refresh } = usePredictions(watchlist);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const selectedPrediction = predictions?.find(
    (p) => p.symbol === selectedSymbol
  );

  // Compute summary stats from live predictions
  const activePredictions = predictions?.filter(
    (p) => p.signalType !== "HOLD"
  );
  const avgConfidence =
    predictions && predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.confidence, 0) /
        predictions.length
      : 0;
  const bestPick = predictions
    ?.filter((p) => p.direction === "up")
    .sort((a, b) => b.predictedMove - a.predictedMove)[0];
  const avgReturn =
    predictions && predictions.length > 0
      ? predictions.reduce((sum, p) => sum + p.predictedMove, 0) /
        predictions.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
          <Target className="h-24 w-24 text-cyan-500" />
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <Brain className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Predictions</h1>
              <p className="text-sm text-zinc-400">
                AI-powered price predictions with entry/exit targets
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Prediction Accuracy"
          value={`${(avgConfidence * 100).toFixed(0)}%`}
          change={
            avgConfidence >= 0.7
              ? "High confidence"
              : "Moderate confidence"
          }
          changeValue={avgConfidence >= 0.7 ? 1 : 0}
          icon={Target}
          description="Average model confidence"
        />
        <StatCard
          title="Active Predictions"
          value={`${activePredictions?.length ?? 0}`}
          change={`${predictions?.filter((p) => p.signalType === "BUY").length ?? 0} buy, ${predictions?.filter((p) => p.signalType === "SELL").length ?? 0} sell`}
          changeValue={1}
          icon={Activity}
          description="Non-hold predictions"
        />
        <StatCard
          title="Best Pick"
          value={bestPick?.symbol ?? "—"}
          change={
            bestPick ? `${formatPercent(bestPick.predictedMove)} predicted` : "No picks yet"
          }
          changeValue={bestPick?.predictedMove ?? 0}
          icon={TrendingUp}
          description={
            bestPick
              ? `Target: ${formatCurrency(bestPick.priceTarget)}`
              : undefined
          }
        />
        <StatCard
          title="Avg Predicted Return"
          value={formatPercent(avgReturn)}
          change={avgReturn > 0 ? "Bullish outlook" : "Bearish outlook"}
          changeValue={avgReturn}
          icon={BarChart3}
          description="Across all watchlist stocks"
        />
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Area (2/3) */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {selectedSymbol} Prediction
              </h2>
              {selectedPrediction && (
                <p className="text-sm text-zinc-400">
                  {selectedPrediction.direction === "up" ? "Bullish" : "Bearish"}{" "}
                  — {(selectedPrediction.confidence * 100).toFixed(0)}% confidence
                </p>
              )}
            </div>
            {selectedPrediction && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold",
                    getSignalColor(selectedPrediction.signalType)
                  )}
                >
                  {selectedPrediction.direction === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {selectedPrediction.signalType}
                </span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex h-[500px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
            </div>
          ) : error ? (
            <div className="flex h-[500px] items-center justify-center text-zinc-500">
              Failed to load prediction data. Check your API connection.
            </div>
          ) : selectedPrediction ? (
            <PredictionChart
              symbol={selectedPrediction.symbol}
              candles={selectedPrediction.candles}
              predictedCandles={selectedPrediction.predictedCandles}
              priceTarget={selectedPrediction.priceTarget}
              stopLoss={selectedPrediction.stopLoss}
              direction={selectedPrediction.direction}
              entryPrice={selectedPrediction.entryPrice}
              height={500}
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center text-zinc-500">
              No prediction data available for {selectedSymbol}
            </div>
          )}

          {/* Price targets summary under chart */}
          {selectedPrediction && (
            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-zinc-800 pt-4">
              <div>
                <p className="text-xs text-zinc-500">Entry Price</p>
                <p className="text-sm font-semibold text-yellow-500">
                  {formatCurrency(selectedPrediction.entryPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Price Target</p>
                <p className="text-sm font-semibold text-green-500">
                  {formatCurrency(selectedPrediction.priceTarget)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Stop Loss</p>
                <p className="text-sm font-semibold text-red-500">
                  {formatCurrency(selectedPrediction.stopLoss)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Prediction Cards (1/3) */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Watchlist Predictions
          </h2>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-500">
              Failed to load predictions.
            </div>
          ) : (
            predictions?.map((prediction) => {
              const Icon = signalIcons[prediction.signalType];
              const isSelected = prediction.symbol === selectedSymbol;

              return (
                <button
                  key={prediction.symbol}
                  onClick={() => setSelectedSymbol(prediction.symbol)}
                  className={cn(
                    "w-full rounded-xl border bg-zinc-900/50 p-4 text-left transition-all hover:bg-zinc-900",
                    isSelected
                      ? "border-emerald-500/50 ring-1 ring-emerald-500/20"
                      : prediction.signalType === "BUY"
                      ? "border-green-500/20"
                      : prediction.signalType === "SELL"
                      ? "border-red-500/20"
                      : "border-zinc-800"
                  )}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "rounded-lg p-1.5",
                          getSignalColor(prediction.signalType)
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white">
                          {prediction.symbol}
                        </span>
                        <p className="text-xs text-zinc-400">
                          {formatCurrency(prediction.currentPrice)}
                          <span
                            className={cn(
                              "ml-1",
                              prediction.changePercent >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            )}
                          >
                            {formatPercent(prediction.changePercent)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-bold",
                          getSignalColor(prediction.signalType)
                        )}
                      >
                        {prediction.signalType}
                      </span>
                    </div>
                  </div>

                  {/* Direction arrow and predicted move */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {prediction.direction === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          prediction.direction === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {formatPercent(prediction.predictedMove)} predicted
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {prediction.timeframe}
                    </span>
                  </div>

                  {/* Confidence bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                      <span>Confidence</span>
                      <span>{(prediction.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-zinc-800">
                      <div
                        className={cn(
                          "h-1 rounded-full",
                          prediction.signalType === "BUY"
                            ? "bg-green-500"
                            : prediction.signalType === "SELL"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        )}
                        style={{
                          width: `${prediction.confidence * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Target / Stop */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-500">
                      Target: {formatCurrency(prediction.priceTarget)}
                    </span>
                    <span className="text-red-500">
                      Stop: {formatCurrency(prediction.stopLoss)}
                    </span>
                  </div>

                  {/* Risk badge */}
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        riskColors[prediction.riskLevel]
                      )}
                    >
                      {prediction.riskLevel} Risk
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
