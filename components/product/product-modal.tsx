"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShieldCheck, Truck, ShoppingCart, ArrowRight, X, ExternalLink } from "lucide-react";
import { type Product } from "@/lib/data/products";
import { useAppState } from "@/lib/state-store";
import { formatCurrency, getEstimatedDeliveryDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductModalContent({ product, isModal = true }: { product: Product; isModal?: boolean }) {
  const router = useRouter();
  const { addToCart, currency } = useAppState();
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleClose = () => {
    if (isModal) {
      router.back();
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity);
      setIsAdding(false);
      if (isModal) router.back();
    }, 250);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    if (isModal) router.back();
    router.push("/checkout");
  };

  const delivery = getEstimatedDeliveryDate(2);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="relative bg-surface text-text-primary rounded-xl overflow-hidden">
      {isModal && (
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-border transition-colors border border-border shadow"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full h-80 bg-white rounded-lg border border-border p-4 flex items-center justify-center overflow-hidden mb-4">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
              className="object-contain p-2"
            />
          </div>

          {/* Thumbnail Strip */}
          {product.galleryImages && product.galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto w-full py-1">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-16 h-16 bg-white rounded border-2 overflow-hidden shrink-0 transition-colors ${
                    selectedImage === img ? "border-amazon-amber" : "border-border hover:border-gray-400"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill sizes="64px" className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Details */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-semibold text-amazon-link uppercase tracking-wider">
                Visit the {product.specifications?.Brand || "Amazon"} Store
              </span>
              {product.isBestSeller && <Badge variant="bestseller">#1 Best Seller</Badge>}
            </div>

            <h1 className="text-lg lg:text-xl font-bold text-text-primary leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-amber-500 text-amber-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-text-primary">{product.rating}</span>
            <span className="text-xs text-amazon-link hover:underline">
              {product.reviewCount.toLocaleString()} ratings
            </span>
          </div>

          <hr className="border-border" />

          {/* Pricing */}
          <div>
            <div className="flex items-baseline gap-3">
              {discountPercent > 0 && (
                <span className="text-2xl font-light text-status-error">
                  -{discountPercent}%
                </span>
              )}
              <span className="text-2xl lg:text-3xl font-extrabold text-amazon-price">
                {formatCurrency(product.price, currency)}
              </span>
            </div>
            {product.originalPrice && (
              <p className="text-xs text-text-muted mt-1">
                Typical price:{" "}
                <span className="line-through">{formatCurrency(product.originalPrice, currency)}</span>
              </p>
            )}
            <p className="text-xs text-text-secondary mt-1">Inclusive of all taxes</p>
          </div>

          <hr className="border-border" />

          {/* Description & Features */}
          <div>
            <h3 className="font-bold text-sm text-text-primary mb-2">About this item</h3>
            <ul className="space-y-1.5 text-xs text-text-secondary list-disc pl-4">
              {product.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Specifications Table */}
          {product.specifications && (
            <div className="pt-2">
              <h3 className="font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs border border-border rounded-lg p-3 bg-surface-secondary">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-text-muted">{key}: </span>
                    <span className="font-medium text-text-primary">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isModal && (
            <div className="pt-2">
              <Link
                href={`/product/${product.id}`}
                className="text-xs text-amazon-link hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Open full product page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right: Buy Box / Checkout Action */}
        <div className="lg:col-span-3">
          <div className="border border-border rounded-xl p-5 bg-surface-secondary space-y-4 shadow-sm">
            <div className="text-xl font-bold text-amazon-price">
              {formatCurrency(product.price * quantity, currency)}
            </div>

            <div className="text-xs text-text-secondary space-y-1">
              <p>
                FREE delivery <strong>{delivery.dateString}</strong>. Order within 12 hrs.
              </p>
              <p className="text-status-success font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Fastest delivery Tomorrow</span>
              </p>
            </div>

            <div>
              {product.inStock ? (
                <span className="text-sm font-bold text-status-success">In Stock</span>
              ) : (
                <span className="text-sm font-bold text-status-error">Currently Unavailable</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && !product.isService && (
              <div>
                <label htmlFor="modal-qty" className="text-xs text-text-secondary font-medium block mb-1">
                  Quantity:
                </label>
                <select
                  id="modal-qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-surface text-text-primary text-xs font-semibold p-2 rounded border border-border outline-none focus:border-amazon-amber"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                variant="amazon-yellow"
                size="md"
                className="w-full font-bold shadow-sm"
                isLoading={isAdding}
                onClick={handleAddToCart}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
              >
                Add to Cart
              </Button>

              {!product.isService && (
                <Button
                  variant="amazon-orange"
                  size="md"
                  className="w-full font-bold shadow-sm"
                  onClick={handleBuyNow}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Buy Now
                </Button>
              )}
            </div>

            <div className="pt-2 text-[11px] text-text-muted space-y-1 border-t border-border">
              <div className="flex justify-between">
                <span>Ships from</span>
                <span className="text-text-primary font-medium">Amazon</span>
              </div>
              <div className="flex justify-between">
                <span>Sold by</span>
                <span className="text-text-primary font-medium">Amazon Retail Services</span>
              </div>
              <div className="flex items-center gap-1 text-status-success pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Purchase Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
