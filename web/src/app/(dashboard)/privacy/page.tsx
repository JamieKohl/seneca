"use client";

import { useState, useEffect } from "react";
import {
  UserX,
  Shield,
  ExternalLink,
  Check,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  Loader2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BrokerStatus = "pending" | "submitted" | "confirmed" | "re-listed";

interface DataBroker {
  id: string;
  brokerName: string;
  optOutUrl: string;
  status: BrokerStatus;
  submittedDate: string | null;
  confirmedDate: string | null;
  lastChecked: string | null;
}

const DEFAULT_BROKERS: Omit<DataBroker, "id">[] = [
  { brokerName: "Spokeo", optOutUrl: "https://www.spokeo.com/optout", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "WhitePages", optOutUrl: "https://www.whitepages.com/suppression-requests", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "BeenVerified", optOutUrl: "https://www.beenverified.com/app/optout/search", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "Intelius", optOutUrl: "https://www.intelius.com/opt-out", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "PeopleFinder", optOutUrl: "https://www.peoplefinder.com/optout", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "Radaris", optOutUrl: "https://radaris.com/control/privacy", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "TruePeopleSearch", optOutUrl: "https://www.truepeoplesearch.com/removal", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "FastPeopleSearch", optOutUrl: "https://www.fastpeoplesearch.com/removal", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "USSearch", optOutUrl: "https://www.ussearch.com/opt-out", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
  { brokerName: "Pipl", optOutUrl: "https://pipl.com/personal-information-removal-request", status: "pending", submittedDate: null, confirmedDate: null, lastChecked: null },
];

const statusConfig: Record<BrokerStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: Clock },
  submitted: { label: "Submitted", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Loader2 },
  confirmed: { label: "Confirmed", color: "text-green-400 bg-green-500/10 border-green-500/20", icon: Check },
  "re-listed": { label: "Re-listed", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: AlertTriangle },
};

function formatDate(date: string | null): string {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PrivacyAutopilotPage() {
  const [brokers, setBrokers] = useState<DataBroker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newBrokerName, setNewBrokerName] = useState("");
  const [newBrokerUrl, setNewBrokerUrl] = useState("");
  const [addingBroker, setAddingBroker] = useState(false);

  const fetchBrokers = async () => {
    try {
      const res = await fetch("/api/privacy/brokers");
      if (res.ok) {
        const data: DataBroker[] = await res.json();
        if (data.length > 0) {
          setBrokers(data);
        } else {
          // Pre-populate with default brokers when empty
          const seeded: DataBroker[] = DEFAULT_BROKERS.map((b, i) => ({
            ...b,
            id: `default-${i}`,
          }));
          setBrokers(seeded);
        }
      } else {
        // API not available yet — use defaults
        const seeded: DataBroker[] = DEFAULT_BROKERS.map((b, i) => ({
          ...b,
          id: `default-${i}`,
        }));
        setBrokers(seeded);
      }
    } catch {
      // API not available yet — use defaults
      const seeded: DataBroker[] = DEFAULT_BROKERS.map((b, i) => ({
        ...b,
        id: `default-${i}`,
      }));
      setBrokers(seeded);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const updateBrokerStatus = async (
    id: string,
    status: BrokerStatus,
    extra?: { submittedDate?: string; confirmedDate?: string; lastChecked?: string }
  ) => {
    setUpdatingId(id);
    const now = new Date().toISOString();
    const payload: Record<string, unknown> = { id, status, ...extra };

    if (status === "submitted" && !extra?.submittedDate) {
      payload.submittedDate = now;
    }
    if (status === "confirmed" && !extra?.confirmedDate) {
      payload.confirmedDate = now;
    }
    payload.lastChecked = now;

    try {
      const res = await fetch("/api/privacy/brokers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json();
        setBrokers((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      } else {
        // Fallback: update locally
        setBrokers((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status,
                  submittedDate: status === "submitted" ? (payload.submittedDate as string) : b.submittedDate,
                  confirmedDate: status === "confirmed" ? (payload.confirmedDate as string) : b.confirmedDate,
                  lastChecked: payload.lastChecked as string,
                }
              : b
          )
        );
      }
    } catch {
      // Fallback: update locally
      setBrokers((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                status,
                submittedDate: status === "submitted" ? now : b.submittedDate,
                confirmedDate: status === "confirmed" ? now : b.confirmedDate,
                lastChecked: now,
              }
            : b
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddBroker = async () => {
    if (!newBrokerName.trim()) return;
    setAddingBroker(true);

    const payload = {
      brokerName: newBrokerName.trim(),
      optOutUrl: newBrokerUrl.trim() || "",
    };

    try {
      const res = await fetch("/api/privacy/brokers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created: DataBroker = await res.json();
        setBrokers((prev) => [...prev, created]);
      } else {
        // Fallback: add locally
        const localBroker: DataBroker = {
          id: `custom-${Date.now()}`,
          brokerName: payload.brokerName,
          optOutUrl: payload.optOutUrl,
          status: "pending",
          submittedDate: null,
          confirmedDate: null,
          lastChecked: null,
        };
        setBrokers((prev) => [...prev, localBroker]);
      }
    } catch {
      // Fallback: add locally
      const localBroker: DataBroker = {
        id: `custom-${Date.now()}`,
        brokerName: payload.brokerName,
        optOutUrl: payload.optOutUrl,
        status: "pending",
        submittedDate: null,
        confirmedDate: null,
        lastChecked: null,
      };
      setBrokers((prev) => [...prev, localBroker]);
    } finally {
      setNewBrokerName("");
      setNewBrokerUrl("");
      setAddingBroker(false);
    }
  };

  const handleRecheck = (broker: DataBroker) => {
    updateBrokerStatus(broker.id, broker.status, {
      lastChecked: new Date().toISOString(),
    });
  };

  const handleStartOptOut = (broker: DataBroker) => {
    if (broker.optOutUrl) {
      window.open(broker.optOutUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Summary stats
  const totalBrokers = brokers.length;
  const optedOut = brokers.filter((b) => b.status === "confirmed").length;
  const pending = brokers.filter((b) => b.status === "pending" || b.status === "submitted").length;
  const reListed = brokers.filter((b) => b.status === "re-listed").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Re-listed Alert Banner */}
      {reListed > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-400">
              {reListed} broker{reListed > 1 ? "s" : ""} re-listed your data
            </p>
            <p className="text-xs text-red-400/70">
              Your information has reappeared on {reListed} data broker
              {reListed > 1 ? " sites" : " site"}. Re-submit opt-out requests to have it removed again.
            </p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-blue-600/10 via-zinc-900/50 to-zinc-900/50 p-6">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/5 to-transparent" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">Privacy Autopilot</h1>
            </div>
            <p className="mt-1 text-sm text-zinc-400">
              Track and manage opt-out requests across data brokers to keep your personal information private.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <Eye className="h-3.5 w-3.5" />
            Tracked
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{totalBrokers}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-green-500/70">
            <Check className="h-3.5 w-3.5" />
            Opted Out
          </div>
          <p className="mt-2 text-3xl font-bold text-green-400">{optedOut}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-yellow-500/70">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </div>
          <p className="mt-2 text-3xl font-bold text-yellow-400">{pending}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-red-500/70">
            <AlertTriangle className="h-3.5 w-3.5" />
            Re-listed
          </div>
          <p className="mt-2 text-3xl font-bold text-red-400">{reListed}</p>
        </div>
      </div>

      {/* Broker Cards */}
      <div className="space-y-3">
        {brokers.map((broker) => {
          const config = statusConfig[broker.status];
          const StatusIcon = config.icon;
          const isUpdating = updatingId === broker.id;

          return (
            <div
              key={broker.id}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Broker Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="rounded-xl bg-zinc-800 p-2.5 shrink-0">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-white">{broker.brokerName}</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          config.color
                        )}
                      >
                        <StatusIcon className={cn("h-3 w-3", broker.status === "submitted" && "animate-spin")} />
                        {config.label}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <span>
                        Submitted: {formatDate(broker.submittedDate)}
                      </span>
                      <span>
                        Last checked: {formatDate(broker.lastChecked)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {broker.status === "pending" && (
                        <button
                          onClick={() => handleStartOptOut(broker)}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Start Opt-Out
                        </button>
                      )}

                      {(broker.status === "pending" || broker.status === "re-listed") && (
                        <button
                          onClick={() => updateBrokerStatus(broker.id, "submitted")}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/5 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/10 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          Mark Submitted
                        </button>
                      )}

                      {broker.status === "submitted" && (
                        <button
                          onClick={() => updateBrokerStatus(broker.id, "confirmed")}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/5 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Mark Confirmed
                        </button>
                      )}

                      {broker.status === "re-listed" && (
                        <button
                          onClick={() => handleStartOptOut(broker)}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Re-submit Opt-Out
                        </button>
                      )}

                      <button
                        onClick={() => handleRecheck(broker)}
                        disabled={isUpdating}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3 w-3" />
                        )}
                        Re-check
                      </button>
                    </div>
                  </div>
                </div>

                {/* Opt-out link */}
                {broker.optOutUrl && (
                  <a
                    href={broker.optOutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 shrink-0 text-xs text-zinc-500 hover:text-blue-500 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Opt-out page
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Broker Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-white">Add Broker</h3>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Know of a data broker not listed above? Add it here to track your opt-out request.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={newBrokerName}
            onChange={(e) => setNewBrokerName(e.target.value)}
            placeholder="Broker name"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          <input
            type="url"
            value={newBrokerUrl}
            onChange={(e) => setNewBrokerUrl(e.target.value)}
            placeholder="Opt-out URL (optional)"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          <button
            onClick={handleAddBroker}
            disabled={!newBrokerName.trim() || addingBroker}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingBroker ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add Broker
          </button>
        </div>
      </div>
    </div>
  );
}
