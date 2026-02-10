import { Skeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function EarningsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <Skeleton className="lg:col-span-3 h-96 rounded-xl" />
        <div className="lg:col-span-2 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
