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
    <div className="group bg-surface rounded-lg border border-border hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden p-4 relative">
      <div>
        {/* Badges Bar */}
        <div className="flex items-center gap-1.5 mb-2 h-6 flex-wrap">
          {product.isBestSeller && <Badge variant="bestseller">#1 Best Seller</Badge>}
          {discountPercent > 0 && <Badge variant="deal">Limited time deal</Badge>}
        </div>

        {/* Product Image Link (Parallel route / Intercepting modal trigger) */}
        <Link
          href={`/product/${product.id}`}
          className="relative w-full h-52 bg-white rounded-md flex items-center justify-center p-2 block overflow-hidden border border-border/50 group-hover:border-amazon-amber/50 transition-colors"
          aria-label={`View details for ${product.title}`}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            priority={priority}
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Category & Title */}
        <div className="mt-3">
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            {product.category}
          </span>
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="text-sm font-medium text-text-primary line-clamp-2 hover:text-amazon-amber transition-colors mt-0.5 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-500 text-amber-500"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-text-secondary font-medium">{product.rating}</span>
          <span className="text-xs text-amazon-link hover:underline">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price Tag */}
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-lg font-bold text-amazon-price">
            {formatCurrency(product.price, currency)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-text-muted line-through">
              {formatCurrency(product.originalPrice, currency)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-xs font-bold text-status-error">
              ({discountPercent}% off)
            </span>
          )}
        </div>

        {/* Prime & Stock */}
        <div className="flex items-center gap-2 mt-1.5">
          {product.isPrime && <Badge variant="prime">prime</Badge>}
          <span className="text-xs text-text-secondary">FREE One-Day Delivery</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-2 border-t border-border/50">
        {product.isService ? (
          <Link href={`/product/${product.id}`} className="w-full block">
            <Button variant="secondary" size="sm" className="w-full">
              View Service Details
            </Button>
          </Link>
        ) : (
          <Button
            variant="amazon-yellow"
            size="sm"
            className="w-full font-semibold shadow-xs"
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
