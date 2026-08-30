import React from "react";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1500px] mx-auto p-6 space-y-6">
      {/* Banner Skeleton */}
      <div className="h-64 rounded-2xl bg-surface-secondary border border-border animate-pulse flex items-center justify-center">
        <div className="text-sm font-semibold text-text-muted">Loading Amazon Catalog...</div>
      </div>

      {/* Grid Skeleton */}
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
