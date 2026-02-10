import { create } from "zustand";
import type { Notification } from "@/types";

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "signal",
    title: "BUY Signal: NVDA",
    body: "AI detected strong buy opportunity. Open your broker and buy NVDA now.",
    symbol: "NVDA",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    actionUrl: "/signals",
  },
  {
    id: "n2",
    type: "price",
    title: "TSLA hit $248.50",
    body: "Tesla crossed your price alert threshold of $245. Up 3.2% today.",
    symbol: "TSLA",
    read: false,
    createdAt: new Date(Date.now() - 22 * 60_000).toISOString(),
    actionUrl: "/portfolio",
  },
  {
    id: "n3",
    type: "signal",
    title: "SELL Signal: AMZN",
    body: "AI recommends selling AMZN. Confidence: 78%. Open Robinhood to act.",
    symbol: "AMZN",
    read: false,
    createdAt: new Date(Date.now() - 45 * 60_000).toISOString(),
    actionUrl: "/signals",
  },
  {
    id: "n4",
    type: "news",
    title: "Breaking: Fed Rate Decision",
    body: "Federal Reserve holds rates steady. Markets reacting positively.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    actionUrl: "/news",
  },
  {
    id: "n5",
    type: "price",
    title: "AAPL earnings beat",
    body: "Apple reported $1.52 EPS vs $1.43 expected. After-hours up 4.1%.",
    symbol: "AAPL",
    read: true,
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
    actionUrl: "/news",
  },
  {
    id: "n6",
    type: "signal",
    title: "HOLD Signal: MSFT",
    body: "AI recommends holding MSFT. Confidence: 82%. No action needed right now.",
    symbol: "MSFT",
    read: true,
    createdAt: new Date(Date.now() - 8 * 3600_000).toISOString(),
    actionUrl: "/signals",
  },
  {
    id: "n7",
    type: "system",
    title: "Welcome to KohlCorp!",
    body: "Your account is set up. Add your broker positions to start getting alerts.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
    actionUrl: "/portfolio",
  },
];

interface AppState {
  // State
  selectedSymbol: string;
  watchlist: string[];
  sidebarOpen: boolean;
  notifications: Notification[];

  // Actions
  setSelectedSymbol: (symbol: string) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  toggleSidebar: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  // Default state
  selectedSymbol: "AAPL",
  watchlist: ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"],
  sidebarOpen: true,
  notifications: SAMPLE_NOTIFICATIONS,

  // Actions
  setSelectedSymbol: (symbol: string) =>
    set({ selectedSymbol: symbol }),

  addToWatchlist: (symbol: string) =>
    set((state) => {
      if (state.watchlist.includes(symbol)) {
        return state;
      }
      return { watchlist: [...state.watchlist, symbol] };
    }),

  removeFromWatchlist: (symbol: string) =>
    set((state) => ({
      watchlist: state.watchlist.filter((s) => s !== symbol),
    })),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  markNotificationRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clearNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
