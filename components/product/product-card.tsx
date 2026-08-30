"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Check, Shield } from "lucide-react";
import { type Product } from "@/lib/data/products";
import { useAppState } from "@/lib/state-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, currency } = useAppState();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, 1);
      setIsAdding(false);
    }, 250);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-surface rounded-lg border border-border hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden p-2.5 sm:p-4 relative">
      <div>
        {/* Badges Bar */}
        <div className="flex items-center gap-1 mb-1.5 sm:mb-2 min-h-[20px] sm:min-h-[24px] flex-wrap">
          {product.isBestSeller && <Badge variant="bestseller" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">#1 Best Seller</Badge>}
          {discountPercent > 0 && <Badge variant="deal" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">Limited deal</Badge>}
        </div>

        {/* Product Image Link (Parallel route / Intercepting modal trigger) */}
        <Link
          href={`/product/${product.id}`}
          className="relative w-full h-36 sm:h-48 md:h-52 bg-white rounded-md flex items-center justify-center p-2 block overflow-hidden border border-border/50 group-hover:border-amazon-amber/50 transition-colors"
          aria-label={`View details for ${product.title}`}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Category & Title */}
        <div className="mt-2 sm:mt-3">
          <span className="text-[10px] sm:text-[11px] font-semibold text-text-secondary uppercase tracking-wider block truncate">
            {product.category}
          </span>
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-xs sm:text-sm font-medium text-text-primary line-clamp-2 hover:text-amazon-amber transition-colors mt-0.5 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-500 text-amber-500"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs text-text-secondary font-medium">{product.rating}</span>
          <span className="text-[10px] sm:text-xs text-amazon-link hover:underline hidden sm:inline">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price Tag */}
        <div className="mt-1.5 sm:mt-2.5 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-sm sm:text-lg font-bold text-amazon-price">
            {formatCurrency(product.price, currency)}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-text-muted line-through">
              {formatCurrency(product.originalPrice, currency)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] sm:text-xs font-bold text-status-error">
              ({discountPercent}% off)
            </span>
          )}
        </div>

        {/* Prime & Stock */}
        <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 flex-wrap">
          {product.isPrime && <Badge variant="prime" className="text-[9px] sm:text-[10px] px-1 py-0">prime</Badge>}
          <span className="text-[10px] sm:text-xs text-text-secondary truncate">FREE One-Day</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-3 sm:mt-4 pt-2 border-t border-border/50">
        {product.isService ? (
          <Link href={`/product/${product.id}`} className="w-full block">
            <Button variant="secondary" size="sm" className="w-full text-xs py-1.5">
              Service Info
            </Button>
          </Link>
        ) : (
          <Button
            variant="amazon-yellow"
            size="sm"
            className="w-full font-semibold shadow-xs text-xs py-1.5"
            isLoading={isAdding}
            onClick={handleAddToCart}
            leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
