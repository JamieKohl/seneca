import useSWR from "swr";
import type { UserSubscriptionData } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSubscription() {
  const { data, error, isLoading, mutate } = useSWR<UserSubscriptionData>(
    "/api/subscription",
    fetcher,
    { dedupingInterval: 10000 }
  );

  const isPaid = (data?.plan === "solo" || data?.plan === "family") && (data?.status === "active" || data?.status === "trialing");

  const upgrade = async (plan: "solo" | "family" = "solo") => {
    const res = await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const result = await res.json();
    mutate();
    return result;
  };

  const cancel = async () => {
    await fetch("/api/subscription", { method: "DELETE" });
    mutate();
  };

  return {
    subscription: data,
    isPaid,
    isLoading,
    error,
    upgrade,
    cancel,
    mutate,
  };
}
