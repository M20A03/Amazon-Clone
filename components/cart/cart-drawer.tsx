"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useAppState } from "@/lib/state-store";
import { CartItemRow } from "./cart-item";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartSubtotalINR,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    currency,
  } = useAppState();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        setIsCartDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    router.push("/checkout");
  };

  const freeDeliveryThresholdINR = 499;
  const isFreeDelivery = cartSubtotalINR >= freeDeliveryThresholdINR;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThresholdINR - cartSubtotalINR);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartDrawerOpen(false);
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="w-full sm:max-w-md bg-surface h-full shadow-amazon-drawer flex flex-col animate-slide-in-right border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-border bg-surface-secondary">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amazon-amber" />
            <h2 id="cart-drawer-title" className="text-sm sm:text-base font-bold text-text-primary">
              Shopping Cart ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close cart"
            className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-border/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery promo banner */}
        <div className="bg-surface-secondary px-4 py-2 sm:px-5 sm:py-2.5 border-b border-border text-xs">
          {isFreeDelivery ? (
            <p className="text-status-success font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Your order qualifies for <strong>FREE Delivery</strong></span>
            </p>
          ) : (
            <p className="text-text-secondary">
              Add{" "}
              <strong className="text-amazon-price">
                {formatCurrency(amountNeededForFreeDelivery, currency)}
              </strong>{" "}
              of eligible items to get <strong>FREE Delivery</strong>.
            </p>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 divide-y divide-border">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface-secondary flex items-center justify-center text-text-muted mb-3 sm:mb-4">
                <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1">
                Your Amazon Cart is empty
              </h3>
              <p className="text-xs text-text-secondary mb-4 sm:mb-6 max-w-xs">
                Explore today&apos;s deals and discover trending items.
              </p>
              <Button
                variant="amazon-yellow"
                size="sm"
                onClick={() => setIsCartDrawerOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cart.map((item) => <CartItemRow key={item.product.id} item={item} />)
          )}
        </div>

        {/* Footer & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-border bg-surface-secondary space-y-3 pb-safe">
            <div className="flex items-baseline justify-between text-sm sm:text-base">
              <span className="text-text-secondary text-xs sm:text-sm">
                Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"}):
              </span>
              <span className="font-extrabold text-amazon-price text-base sm:text-lg">
                {formatCurrency(cartSubtotalINR, currency)}
              </span>
            </div>

            <Button
              variant="amazon-yellow"
              size="lg"
              className="w-full font-bold shadow-md text-sm sm:text-base"
              onClick={handleProceedToCheckout}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Checkout
            </Button>

            <p className="text-[10px] sm:text-[11px] text-center text-text-muted">
              🔒 100% Verified Secure 256-Bit SSL Checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
