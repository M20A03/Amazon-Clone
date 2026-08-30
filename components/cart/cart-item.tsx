"use client";

import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { type CartItem as CartItemType, useAppState } from "@/lib/state-store";
import { formatCurrency } from "@/lib/utils";

export function CartItemRow({ item }: { item: CartItemType }) {
  const { updateQuantity, removeFromCart, currency } = useAppState();

  return (
    <div className="flex gap-3 py-4 border-b border-border text-sm">
      {/* Product Image */}
      <div className="relative w-20 h-20 shrink-0 bg-white rounded-md border border-border overflow-hidden">
        <Image
          src={item.product.image}
          alt={item.product.title}
          fill
          sizes="80px"
          className="object-contain p-1"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-medium text-text-primary line-clamp-2 text-xs leading-snug">
            {item.product.title}
          </h4>
          <div className="mt-1 font-bold text-amazon-price text-sm">
            {formatCurrency(item.product.price, currency)}
          </div>
          {item.product.inStock ? (
            <span className="text-[11px] text-status-success font-medium">In Stock</span>
          ) : (
            <span className="text-[11px] text-status-error font-medium">Out of Stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-2 pt-1">
          {/* Quantity Selector */}
          <div className="flex items-center border border-border rounded bg-surface-secondary">
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              className="px-2 py-0.5 text-xs text-text-secondary hover:bg-border/40 font-bold"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-2 text-xs font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              className="px-2 py-0.5 text-xs text-text-secondary hover:bg-border/40 font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeFromCart(item.product.id)}
            className="text-xs text-text-muted hover:text-status-error flex items-center gap-1 transition-colors"
            aria-label={`Remove ${item.product.title} from cart`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
