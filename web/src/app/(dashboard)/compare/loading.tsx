import { Skeleton } from "@/components/ui/skeleton";

export default function CompareLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
}
