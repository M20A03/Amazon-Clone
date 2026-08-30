import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-border/40 dark:bg-surface-tertiary",
        className
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-lg p-2.5 sm:p-4 border border-border flex flex-col justify-between min-h-[300px] sm:min-h-[400px] shadow-sm">
      <div>
        <Skeleton className="h-4 sm:h-5 w-3/4 mb-2 sm:mb-3" />
        <Skeleton className="h-36 sm:h-48 md:h-52 w-full rounded-md mb-3 sm:mb-4" />
      </div>
      <div>
        <Skeleton className="h-3 sm:h-4 w-1/3 mb-2" />
        <Skeleton className="h-4 sm:h-5 w-1/2 mb-3" />
        <Skeleton className="h-8 sm:h-9 w-full rounded-md" />
      </div>
    </div>
  );
}
