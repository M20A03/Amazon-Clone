"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Search,
  ShoppingCart,
  User,
  Moon,
  Sun,
  LogOut,
  Package,
} from "lucide-react";
import { useAppState } from "@/lib/state-store";
import { useTheme } from "@/components/theme-provider";
import { CATEGORIES } from "@/lib/data/products";

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    cartCount,
    setIsCartDrawerOpen,
    user,
    logout,
    country,
    currency,
    setIsLocationModalOpen,
  } = useAppState();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [searchCategory, setSearchCategory] = useState(searchParams.get("category") || "All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }

    if (searchCategory && searchCategory !== "All") {
      params.set("category", searchCategory);
    } else {
      params.delete("category");
    }

    params.delete("page"); // Reset pagination

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <header className="bg-amazon-navy text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-[1500px] mx-auto px-4 h-16 flex items-center gap-3 md:gap-4">
        {/* 1. Amazon Logo */}
        <Link
          href="/"
          className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded focus-visible:border-amazon-amber"
          aria-label="Amazon Home"
        >
          <div className="flex items-center gap-1 font-black text-2xl tracking-tighter">
            <span>amazon</span>
            <span className="text-amazon-amber text-xs font-bold pt-2">.in</span>
          </div>
        </Link>

        {/* 2. Deliver To Address / Country */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="hidden sm:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded text-left focus-visible:border-amazon-amber"
          aria-label={`Deliver to ${country}`}
        >
          <MapPin className="w-4 h-4 text-amazon-amber shrink-0 mt-2" />
          <div className="flex flex-col text-xs leading-tight">
            <span className="text-gray-400">Deliver to</span>
            <span className="font-bold text-white max-w-[100px] truncate">{country}</span>
          </div>
        </button>

        {/* 3. Search Bar with Category Select */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-amazon-amber bg-white text-gray-900"
        >
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="hidden md:block bg-gray-100 text-xs px-3 h-full border-r border-gray-300 text-gray-700 outline-none cursor-pointer hover:bg-gray-200"
            aria-label="Select search category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Amazon"
            className="flex-1 px-3 h-full text-sm outline-none bg-transparent placeholder:text-gray-500"
            aria-label="Search keywords"
          />

          <button
            type="submit"
            className="bg-amazon-amber hover:bg-amazon-amberHover px-4 h-full flex items-center justify-center text-gray-900 transition-colors"
            aria-label="Submit search"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* 4. Country & Currency Indicator */}
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="hidden lg:flex items-center gap-1 px-2 py-1.5 border border-transparent hover:border-white rounded text-xs font-bold focus-visible:border-amazon-amber"
        >
          <span>{currency}</span>
        </button>

        {/* 5. Accounts & Lists */}
        <div className="relative">
          {user ? (
            <div
              className="px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer text-left"
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            >
              <div className="text-xs text-gray-300">Hello, {user.name}</div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                Account & Lists
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex flex-col text-left px-2 py-1 border border-transparent hover:border-white rounded"
            >
              <span className="text-xs text-gray-300">Hello, sign in</span>
              <span className="text-xs font-bold text-white">Account & Lists</span>
            </Link>
          )}

          {/* Account Dropdown */}
          {user && isAccountMenuOpen && (
            <div
              className="absolute right-0 top-12 w-56 bg-surface text-text-primary rounded-lg shadow-xl border border-border py-2 z-50 animate-fade-in"
              onMouseLeave={() => setIsAccountMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-text-secondary">Signed in as</p>
                <p className="text-sm font-bold truncate">{user.email}</p>
              </div>
              <Link
                href="/orders"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-secondary"
                onClick={() => setIsAccountMenuOpen(false)}
              >
                <Package className="w-4 h-4 text-text-secondary" />
                Your Orders
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsAccountMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-status-error hover:bg-surface-secondary text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* 6. Returns & Orders */}
        <Link
          href="/orders"
          className="hidden md:flex flex-col text-left px-2 py-1 border border-transparent hover:border-white rounded"
        >
          <span className="text-xs text-gray-300">Returns</span>
          <span className="text-xs font-bold text-white">& Orders</span>
        </Link>

        {/* 7. Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 border border-transparent hover:border-white rounded text-gray-300 hover:text-white transition-colors"
          aria-label="Toggle theme mode"
          title="Toggle Dark/Light theme"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-5 h-5 text-amazon-amber" />
          ) : (
            <Moon className="w-5 h-5 text-gray-300" />
          )}
        </button>

        {/* 8. Cart Button */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded relative focus-visible:border-amazon-amber"
          aria-label={`View Cart with ${cartCount} items`}
        >
          <div className="relative">
            <ShoppingCart className="w-7 h-7" />
            <span className="absolute -top-1 left-3 bg-amazon-orange text-gray-900 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {cartCount}
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-sm pt-2">Cart</span>
        </button>
      </div>
    </header>
  );
}
