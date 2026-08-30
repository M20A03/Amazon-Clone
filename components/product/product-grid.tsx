"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type Product } from "@/lib/data/products";
import { ProductCard } from "./product-card";
import { ArrowUpDown, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "featured";
  const currentCategory = searchParams.get("category") || "All";
  const currentSearch = searchParams.get("search") || "";
  const [, startTransition] = useTransition();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push("/");
    });
  };

  return (
    <section className="space-y-4">
      {/* Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 rounded-lg border border-border">
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            {currentSearch ? `Results for "${currentSearch}"` : currentCategory === "All" ? "Featured Products" : currentCategory}
          </h2>
          <p className="text-xs text-text-secondary">
            Showing 1-{products.length} of {products.length} results
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-text-secondary font-medium whitespace-nowrap flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by:
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-surface-secondary text-text-primary text-xs font-semibold px-3 py-1.5 rounded border border-border outline-none cursor-pointer hover:border-amazon-amber transition-colors"
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {products.length === 0 ? (
        <div className="bg-surface p-12 rounded-lg border border-border text-center flex flex-col items-center justify-center my-6">
          <SearchX className="w-12 h-12 text-text-muted mb-3" />
          <h3 className="text-base font-bold text-text-primary mb-1">
            No products match your search criteria
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mb-6">
            Try checking your spelling, using more general terms, or clear active filters.
          </p>
          <Button variant="amazon-yellow" size="sm" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
