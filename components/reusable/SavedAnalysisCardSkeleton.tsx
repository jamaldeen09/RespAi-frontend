import { Skeleton } from "@/components/ui/skeleton";

export const SavedAnalysisCardSkeleton = (): React.ReactElement => {
  return (
    <div className="rounded-2xl border border-border bg-card backdrop-blur-sm p-5 animate-pulse">
      {/* Header with endpoint and method skeleton */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 mr-2">
          <Skeleton className="h-5 bg-muted rounded-lg" />
          <Skeleton className="h-4 bg-muted rounded-lg mt-2 w-3/4" />
        </div>
        <Skeleton className="w-12 h-6 bg-muted rounded-full" />
      </div>

      {/* Status and date skeleton */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="w-20 h-6 bg-muted rounded-full" />
        <Skeleton className="w-16 h-4 bg-muted rounded-lg" />
      </div>

      {/* AI Explanation skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 bg-muted rounded-lg w-full" />
        <Skeleton className="h-4 bg-muted rounded-lg w-5/6" />
        {/* <Skeleton className="h-4 bg-muted rounded-lg w-4/6" /> */}
      </div>

      {/* Footer with cost and button skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="w-16 h-5 bg-muted rounded-lg" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-20 h-9 bg-muted rounded-lg" />
          <Skeleton className="w-10 h-9 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
};