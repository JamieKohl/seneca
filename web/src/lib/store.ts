import { create } from "zustand";

interface AppState {
  // State
  selectedSymbol: string;
  watchlist: string[];
  sidebarOpen: boolean;

  // Actions
  setSelectedSymbol: (symbol: string) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Default state
  selectedSymbol: "AAPL",
  watchlist: ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"],
  sidebarOpen: true,

  // Actions
  setSelectedSymbol: (symbol: string) =>
    set({ selectedSymbol: symbol }),

  addToWatchlist: (symbol: string) =>
    set((state) => {
      if (state.watchlist.includes(symbol)) {
        return state; // Already in watchlist, no change
      }
      return { watchlist: [...state.watchlist, symbol] };
    }),

  removeFromWatchlist: (symbol: string) =>
    set((state) => ({
      watchlist: state.watchlist.filter((s) => s !== symbol),
    })),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
