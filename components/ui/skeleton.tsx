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
    <div className="bg-surface rounded-lg p-4 border border-border flex flex-col justify-between h-[420px] shadow-sm">
      <div>
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-48 w-full rounded-md mb-4" />
      </div>
      <div>
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}
