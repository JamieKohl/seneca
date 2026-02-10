"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  Crown,
  LogOut,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account & broker preferences",
  },
  {
    label: "Upgrade to Pro",
    href: "/checkout",
    icon: Crown,
    description: "Unlimited alerts & positions",
    highlight: true,
  },
  {
    label: "Help Center",
    href: "/settings",
    icon: HelpCircle,
    description: "FAQ & support",
  },
];

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors",
          open && "ring-2 ring-emerald-500/30"
        )}
      >
        <User className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50 animate-in slide-in-from-top-2 fade-in duration-200">
          {/* User info */}
          <div className="border-b border-zinc-800 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                <User className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Trader</p>
                <p className="text-xs text-zinc-500">Free Plan</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-900",
                  item.highlight && "bg-emerald-500/[0.03]"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    item.highlight
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-zinc-800 text-zinc-400"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      item.highlight ? "text-emerald-400" : "text-white"
                    )}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-zinc-600 truncate">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-zinc-800 py-1">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-colors"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Sign Out</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
