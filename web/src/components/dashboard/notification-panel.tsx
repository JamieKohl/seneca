"use client";

import {
  Bell,
  BellOff,
  CheckCheck,
  ShieldAlert,
  CreditCard,
  UserX,
  DollarSign,
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
  { icon: typeof ShieldAlert; color: string; bg: string }
> = {
  scam: {
    icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  subscription: {
    icon: CreditCard,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  privacy: {
    icon: UserX,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  price: {
    icon: DollarSign,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  system: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-600/10",
  },
};

const severityLabels = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];

function getIncidentId(index: number): string {
  return `INC-${new Date().getFullYear()}-${String(1000 + index).padStart(4, "0")}`;
}

function getSeverityBadge(type: string): { label: string; color: string } {
  switch (type) {
    case "scam":
      return { label: "CRITICAL", color: "bg-red-500/10 text-red-400 border-red-500/20" };
    case "subscription":
      return { label: "HIGH", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    case "privacy":
      return { label: "HIGH", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
    case "price":
      return { label: "MEDIUM", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    default:
      return { label: "INFO", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
  }
}

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
          <Bell className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Incident Alerts</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              title="Acknowledge all"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Acknowledge All
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
            <p className="text-sm font-medium">No incidents</p>
            <p className="text-xs mt-1">
              Incident alerts will appear here when detected
            </p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            const severity = getSeverityBadge(notification.type);
            const incidentId = getIncidentId(index);

            const content = (
              <div
                className={cn(
                  "group relative flex gap-3 px-4 py-3 transition-colors",
                  !notification.read
                    ? "bg-red-600/[0.03] hover:bg-zinc-900/80"
                    : "hover:bg-zinc-900/50"
                )}
              >
                {/* Unread dot */}
                {!notification.read && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-red-500" />
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold text-zinc-600 font-data">
                        {incidentId}
                      </span>
                      <span
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase",
                          severity.color
                        )}
                      >
                        {severity.label}
                      </span>
                    </div>
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
                  <p
                    className={cn(
                      "text-sm font-medium leading-snug mt-1",
                      !notification.read ? "text-white" : "text-zinc-300"
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 leading-relaxed line-clamp-2">
                    {notification.body}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-[10px] text-zinc-600 font-data">
                      {timeAgo(notification.createdAt)}
                    </span>
                    {notification.actionUrl && (
                      <span className="flex items-center gap-0.5 text-[10px] text-blue-600">
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
            className="flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            View Full Incident Log
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
