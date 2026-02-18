import { create } from "zustand";
import type { Notification } from "@/types";

const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "scam",
    title: "Phishing Attempt Blocked",
    body: "We detected a suspicious email claiming to be from your bank. Risk score: 92/100.",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    actionUrl: "/scams",
  },
  {
    id: "n2",
    type: "subscription",
    title: "Unused Subscription Found",
    body: "You haven't used your Audible subscription in 3 months. Save $14.95/mo by cancelling.",
    read: false,
    createdAt: new Date(Date.now() - 22 * 60_000).toISOString(),
    actionUrl: "/subscriptions",
  },
  {
    id: "n3",
    type: "privacy",
    title: "Data Broker Re-listing",
    body: "Spokeo has re-listed your personal information. We recommend opting out again.",
    read: false,
    createdAt: new Date(Date.now() - 45 * 60_000).toISOString(),
    actionUrl: "/privacy",
  },
  {
    id: "n4",
    type: "price",
    title: "Price Discrimination Detected",
    body: "Sony WH-1000XM5 is showing $50 higher than the baseline price for your session.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
    actionUrl: "/price-watch",
  },
  {
    id: "n5",
    type: "scam",
    title: "Robocall Pattern Detected",
    body: "3 calls from suspected scam numbers in the last hour. Auto-block enabled.",
    read: true,
    createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(),
    actionUrl: "/scams",
  },
  {
    id: "n6",
    type: "system",
    title: "Welcome to Kohlcorp Shield!",
    body: "Your account is protected. Start by analyzing a suspicious message or tracking your subscriptions.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
    actionUrl: "/dashboard",
  },
];

interface AppState {
  sidebarOpen: boolean;
  notifications: Notification[];

  toggleSidebar: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  sidebarOpen: true,
  notifications: SAMPLE_NOTIFICATIONS,

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
