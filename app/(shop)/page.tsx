import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, type Product } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { Sparkles, ShieldCheck, Zap, ArrowRight } from "lucide-react";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categoryFilter = params.category;
  const searchQuery = params.search?.toLowerCase().trim();
  const sortOption = params.sort || "featured";

  let filteredProducts = [...PRODUCTS];

  // 1. Filter by category
  if (categoryFilter && categoryFilter !== "All") {
    if (categoryFilter === "Deals") {
      filteredProducts = filteredProducts.filter((p) => p.category === "Deals" || p.originalPrice);
    } else {
      filteredProducts = filteredProducts.filter(
        (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
  }

  // 2. Filter by search query
  if (searchQuery) {
    filteredProducts = filteredProducts.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(searchQuery);
      const matchCategory = p.category.toLowerCase().includes(searchQuery);
      const matchDesc = p.description.toLowerCase().includes(searchQuery);
      const matchFeatures = p.features.some((f) => f.toLowerCase().includes(searchQuery));
      return matchTitle || matchCategory || matchDesc || matchFeatures;
    });
  }

  // 3. Sort products
  if (sortOption === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner Section (Only on default Home view) */}
      {!categoryFilter && !searchQuery && (
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-border bg-gradient-to-r from-[#131921] via-[#232f3e] to-[#0f1111] text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center p-6 md:p-12 gap-8 relative z-10">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amazon-orange/20 text-amazon-amber border border-amazon-orange/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Great Republic Day Sale Live Now
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Up to 60% off on <span className="text-amazon-amber">Premium Electronics</span> & Smart Home
              </h1>
              <p className="text-sm sm:text-base text-gray-300 max-w-xl">
                Experience next-generation noise canceling, M3 chips, smart appliances, and wedding registries with guaranteed same-day Prime delivery.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/?category=Deals"
                  className="bg-amazon-yellow text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-amazon-yellowHover transition-colors shadow-lg text-sm inline-flex items-center gap-2"
                >
                  <span>Shop Today&apos;s Deals</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/customer-service"
                  className="text-xs text-gray-300 hover:text-white underline font-medium"
                >
                  Learn about Prime
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 relative h-56 md:h-72 w-full flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                alt="Sony WH-1000XM5 Featured Deal"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Guarantee Badges Footer */}
          <div className="bg-black/40 border-t border-white/10 px-6 py-3 flex flex-wrap items-center justify-around gap-4 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amazon-amber" />
              <span>Fast, Free Prime Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-status-success" />
              <span>100% Idempotent Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amazon-amber" />
              <span>Zero FOUC Instant Load Experience</span>
            </div>
          </div>
        </div>
      )}

      {/* Featured Quick Category Cards */}
      {!categoryFilter && !searchQuery && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/?category=Electronics"
            className="bg-surface p-4 rounded-xl border border-border hover:shadow-md transition-all group"
          >
            <h3 className="font-bold text-base text-text-primary mb-2 group-hover:text-amazon-amber transition-colors">
              Flagship Electronics
            </h3>
            <div className="relative h-36 bg-surface-secondary rounded-lg overflow-hidden mb-2">
              <Image
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
                alt="MacBook Air"
                fill
                sizes="250px"
                className="object-contain p-2 group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs text-amazon-link font-medium group-hover:underline">
              Explore Top Brands →
            </span>
          </Link>

          <Link
            href="/?category=Home"
            className="bg-surface p-4 rounded-xl border border-border hover:shadow-md transition-all group"
          >
            <h3 className="font-bold text-base text-text-primary mb-2 group-hover:text-amazon-amber transition-colors">
              Smart Home & Cleaning
            </h3>
            <div className="relative h-36 bg-surface-secondary rounded-lg overflow-hidden mb-2">
              <Image
                src="https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80"
                alt="Dyson Vacuum"
                fill
                sizes="250px"
                className="object-contain p-2 group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs text-amazon-link font-medium group-hover:underline">
              Upgrade Your Home →
            </span>
          </Link>

          <Link
            href="/?category=Baby+Registry"
            className="bg-surface p-4 rounded-xl border border-border hover:shadow-md transition-all group"
          >
            <h3 className="font-bold text-base text-text-primary mb-2 group-hover:text-amazon-amber transition-colors">
              Baby & Nursery Care
            </h3>
            <div className="relative h-36 bg-surface-secondary rounded-lg overflow-hidden mb-2">
              <Image
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80"
                alt="Baby Monitor"
                fill
                sizes="250px"
                className="object-contain p-2 group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs text-amazon-link font-medium group-hover:underline">
              Create Registry →
            </span>
          </Link>

          <Link
            href="/?category=Deals"
            className="bg-surface p-4 rounded-xl border border-border hover:shadow-md transition-all group"
          >
            <h3 className="font-bold text-base text-text-primary mb-2 group-hover:text-amazon-amber transition-colors">
              Lightning Deals
            </h3>
            <div className="relative h-36 bg-surface-secondary rounded-lg overflow-hidden mb-2">
              <Image
                src="https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80"
                alt="Echo Dot Deal"
                fill
                sizes="250px"
                className="object-contain p-2 group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs text-amazon-link font-medium group-hover:underline">
              See All Deals (Up to 70% off) →
            </span>
          </Link>
        </div>
      )}

      {/* Main Dynamic Product Grid with Suspense */}
      <Suspense
        fallback={
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ProductGrid products={filteredProducts} />
      </Suspense>
    </div>
  );
}
