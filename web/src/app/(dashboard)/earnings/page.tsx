"use client";

import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Star,
  Building2,
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface EarningsEvent {
  symbol: string;
  name: string;
  date: string;
  time: "BMO" | "AMC";
  epsEstimate: number;
  epsActual?: number;
  revenueEstimate: string;
  revenueActual?: string;
  surprise?: number;
  inWatchlist: boolean;
}

const earningsData: EarningsEvent[] = [
  { symbol: "AAPL", name: "Apple Inc.", date: "2026-02-12", time: "AMC", epsEstimate: 2.35, revenueEstimate: "$124.1B", inWatchlist: true },
  { symbol: "MSFT", name: "Microsoft Corp.", date: "2026-02-12", time: "AMC", epsEstimate: 3.22, revenueEstimate: "$68.7B", inWatchlist: true },
  { symbol: "NVDA", name: "NVIDIA Corp.", date: "2026-02-13", time: "AMC", epsEstimate: 0.89, revenueEstimate: "$38.2B", inWatchlist: true },
  { symbol: "TSLA", name: "Tesla Inc.", date: "2026-02-10", time: "AMC", epsEstimate: 0.78, epsActual: 0.85, revenueEstimate: "$26.1B", revenueActual: "$27.3B", surprise: 8.97, inWatchlist: true },
  { symbol: "AMZN", name: "Amazon.com Inc.", date: "2026-02-13", time: "AMC", epsEstimate: 1.47, revenueEstimate: "$187.3B", inWatchlist: false },
  { symbol: "META", name: "Meta Platforms", date: "2026-02-11", time: "AMC", epsEstimate: 6.78, epsActual: 7.12, revenueEstimate: "$46.9B", revenueActual: "$48.1B", surprise: 5.01, inWatchlist: false },
  { symbol: "GOOG", name: "Alphabet Inc.", date: "2026-02-11", time: "AMC", epsEstimate: 2.12, epsActual: 2.28, revenueEstimate: "$96.3B", revenueActual: "$98.1B", surprise: 7.55, inWatchlist: false },
  { symbol: "JPM", name: "JPMorgan Chase", date: "2026-02-14", time: "BMO", epsEstimate: 4.81, revenueEstimate: "$43.2B", inWatchlist: false },
  { symbol: "V", name: "Visa Inc.", date: "2026-02-14", time: "AMC", epsEstimate: 2.68, revenueEstimate: "$9.5B", inWatchlist: false },
  { symbol: "WMT", name: "Walmart Inc.", date: "2026-02-15", time: "BMO", epsEstimate: 1.63, revenueEstimate: "$168.4B", inWatchlist: false },
  { symbol: "DIS", name: "Walt Disney Co.", date: "2026-02-10", time: "AMC", epsEstimate: 1.45, epsActual: 1.52, revenueEstimate: "$24.1B", revenueActual: "$24.8B", surprise: 4.83, inWatchlist: false },
  { symbol: "NFLX", name: "Netflix Inc.", date: "2026-02-15", time: "AMC", epsEstimate: 5.12, revenueEstimate: "$10.8B", inWatchlist: false },
];

export default function EarningsPage() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [filter, setFilter] = useState<"all" | "watchlist" | "reported">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const filtered = earningsData.filter((e) => {
    if (filter === "watchlist") return e.inWatchlist;
    if (filter === "reported") return e.epsActual !== undefined;
    return true;
  });

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filtered.filter((e) => e.date === dateStr);
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const selectedEvents = selectedDate
    ? filtered.filter((e) => e.date === selectedDate)
    : filtered.sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-violet-500/10 via-zinc-900 to-zinc-900 p-6">
        <Calendar className="absolute -right-4 -top-4 h-32 w-32 text-violet-500/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">Earnings Calendar</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track upcoming and past earnings reports for stocks in your portfolio
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "watchlist", "reported"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setSelectedDate(null); }}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:text-white"
            }`}
          >
            {f === "all" ? "All Earnings" : f === "watchlist" ? "My Watchlist" : "Reported"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Calendar */}
        <div className="lg:col-span-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-semibold text-white">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <button onClick={nextMonth} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="p-2 text-center text-xs font-medium text-zinc-500">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const events = getEventsForDay(day);
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`relative rounded-lg p-2 text-center text-xs transition-colors min-h-[52px] ${
                    isSelected
                      ? "bg-violet-500/20 border border-violet-500/30"
                      : isToday
                        ? "bg-zinc-800 border border-zinc-700"
                        : "hover:bg-zinc-800/50 border border-transparent"
                  }`}
                >
                  <span className={`${isToday ? "text-violet-400 font-semibold" : "text-zinc-400"}`}>
                    {day}
                  </span>
                  {events.length > 0 && (
                    <div className="mt-1 flex justify-center gap-0.5">
                      {events.slice(0, 3).map((e) => (
                        <div
                          key={e.symbol}
                          className={`h-1.5 w-1.5 rounded-full ${
                            e.epsActual !== undefined
                              ? e.surprise && e.surprise > 0 ? "bg-emerald-500" : "bg-red-500"
                              : "bg-violet-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" />Upcoming</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Beat</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" />Missed</span>
          </div>
        </div>

        {/* Events list */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-white">
            {selectedDate
              ? `Earnings on ${new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
              : "All Upcoming Earnings"}
          </h3>
          {selectedEvents.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-500">No earnings events</p>
            </div>
          ) : (
            selectedEvents.map((e) => (
              <div
                key={e.symbol}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{e.symbol}</span>
                      {e.inWatchlist && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        e.time === "BMO" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {e.time === "BMO" ? "Before Open" : "After Close"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{e.name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide">EPS Est.</p>
                    <p className="text-sm font-semibold text-white">${e.epsEstimate.toFixed(2)}</p>
                    {e.epsActual !== undefined && (
                      <p className={`text-xs ${e.surprise && e.surprise > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        Actual: ${e.epsActual.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Revenue Est.</p>
                    <p className="text-sm font-semibold text-white">{e.revenueEstimate}</p>
                    {e.revenueActual && (
                      <p className={`text-xs ${e.surprise && e.surprise > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        Actual: {e.revenueActual}
                      </p>
                    )}
                  </div>
                </div>

                {e.surprise !== undefined && (
                  <div className={`flex items-center gap-1.5 rounded-lg p-2 text-xs font-medium ${
                    e.surprise > 0
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {e.surprise > 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {e.surprise > 0 ? "Beat" : "Missed"} by {Math.abs(e.surprise).toFixed(2)}%
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
