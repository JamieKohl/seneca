"use client";

import {
  Bell,
  BellOff,
  CheckCheck,
  Zap,
  DollarSign,
  Newspaper,
  Info,
  X,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";
import type { Notification } from "@/types";

const typeConfig: Record<
  Notification["type"],
  { icon: typeof Zap; color: string; bg: string }
> = {
  signal: {
    icon: Zap,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  price: {
    icon: DollarSign,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  news: {
    icon: Newspaper,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  system: {
    icon: Info,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
};

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
  } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 animate-in slide-in-from-top-2 fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Read all
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <BellOff className="h-10 w-10 mb-3 text-zinc-700" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs mt-1">
              Alerts will appear here when triggered
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;

            const content = (
              <div
                className={cn(
                  "group relative flex gap-3 px-4 py-3 transition-colors",
                  !notification.read
                    ? "bg-emerald-500/[0.03] hover:bg-zinc-900/80"
                    : "hover:bg-zinc-900/50"
                )}
              >
                {/* Unread dot */}
                {!notification.read && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    config.bg
                  )}
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug",
                        !notification.read ? "text-white" : "text-zinc-300"
                      )}
                    >
                      {notification.title}
                    </p>
                    {/* Dismiss button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                      className="shrink-0 rounded p-0.5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-zinc-300 transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed line-clamp-2">
                    {notification.body}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600">
                      {timeAgo(notification.createdAt)}
                    </span>
                    {notification.symbol && (
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
                        {notification.symbol}
                      </span>
                    )}
                    {notification.actionUrl && (
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-500">
                        <ExternalLink className="h-2.5 w-2.5" />
                        View
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );

            if (notification.actionUrl) {
              return (
                <Link
                  key={notification.id}
                  href={notification.actionUrl}
                  onClick={() => {
                    markNotificationRead(notification.id);
                    onClose();
                  }}
                  className="block border-b border-zinc-800/50 last:border-b-0"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={notification.id}
                className="border-b border-zinc-800/50 last:border-b-0 cursor-pointer"
                onClick={() => markNotificationRead(notification.id)}
              >
                {content}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-zinc-800 px-4 py-2.5">
          <Link
            href="/alerts"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            View All Alert History
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
