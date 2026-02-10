import { Skeleton, StatCardSkeleton } from "@/components/ui/skeleton";

export default function PriceAlertsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}
