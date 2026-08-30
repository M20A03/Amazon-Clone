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
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAppState } from "@/lib/state-store";
import { useTheme } from "@/components/theme-provider";
import { CATEGORIES } from "@/lib/data/products";
import { MobileDrawer } from "./mobile-drawer";

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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
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

  const handleClearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <>
      <header className="bg-amazon-navy text-white sticky top-0 z-40 shadow-md">
        {/* =========================================================================
            1. Desktop & Tablet Top Bar (md:flex) / Mobile Row 1 (flex md:hidden)
           ========================================================================= */}
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 h-14 md:h-16 flex items-center justify-between gap-2 md:gap-4">
          
          {/* Left section: Hamburger (Mobile) + Amazon Logo */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-1.5 rounded hover:bg-amazon-lightNavy md:hidden text-white"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link
              href="/"
              className="flex items-center px-1 sm:px-2 py-1 border border-transparent hover:border-white rounded focus-visible:border-amazon-amber"
              aria-label="Amazon Home"
            >
              <div className="flex items-center gap-0.5 font-black text-xl sm:text-2xl tracking-tighter">
                <span>amazon</span>
                <span className="text-amazon-amber text-xs font-bold pt-1 sm:pt-2">.in</span>
              </div>
            </Link>
          </div>

          {/* Desktop Deliver To Address / Country */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden lg:flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded text-left focus-visible:border-amazon-amber"
            aria-label={`Deliver to ${country}`}
          >
            <MapPin className="w-4 h-4 text-amazon-amber shrink-0 mt-2" />
            <div className="flex flex-col text-xs leading-tight">
              <span className="text-gray-400">Deliver to</span>
              <span className="font-bold text-white max-w-[100px] truncate">{country}</span>
            </div>
          </button>

          {/* Desktop Search Bar (hidden on mobile, rendered below on row 2) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 items-center h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-amazon-amber bg-white text-gray-900 mx-2"
          >
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-gray-100 text-xs px-3 h-full border-r border-gray-300 text-gray-700 outline-none cursor-pointer hover:bg-gray-200"
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

            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-gray-400 hover:text-gray-700"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="bg-amazon-amber hover:bg-amazon-amberHover px-4 h-full flex items-center justify-center text-gray-900 transition-colors"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Right section: Country Indicator, Account, Orders, Theme, Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop Country & Currency Indicator */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-1 px-2 py-1.5 border border-transparent hover:border-white rounded text-xs font-bold focus-visible:border-amazon-amber"
            >
              <span>{currency}</span>
            </button>

            {/* Accounts & Lists */}
            <div className="relative">
              {user ? (
                <div
                  className="px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer text-left flex items-center gap-1"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                >
                  <div className="hidden sm:block">
                    <div className="text-[11px] text-gray-300 leading-tight">Hello, {user.name}</div>
                    <div className="text-xs font-bold text-white flex items-center gap-0.5">
                      Account & Lists <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                  <User className="w-5 h-5 sm:hidden text-gray-200" />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center sm:flex-col text-left px-2 py-1 border border-transparent hover:border-white rounded"
                  aria-label="Sign in"
                >
                  <span className="hidden sm:inline text-[11px] text-gray-300 leading-tight">Hello, sign in</span>
                  <span className="hidden sm:inline text-xs font-bold text-white">Account & Lists</span>
                  <User className="w-5 h-5 sm:hidden text-gray-200" />
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

            {/* Desktop Returns & Orders */}
            <Link
              href="/orders"
              className="hidden md:flex flex-col text-left px-2 py-1 border border-transparent hover:border-white rounded"
            >
              <span className="text-[11px] text-gray-300 leading-tight">Returns</span>
              <span className="text-xs font-bold text-white">& Orders</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 border border-transparent hover:border-white rounded text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle theme mode"
              title="Toggle Dark/Light theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amazon-amber" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1 border border-transparent hover:border-white rounded relative focus-visible:border-amazon-amber"
              aria-label={`View Cart with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="absolute -top-1 left-2 sm:left-3 bg-amazon-orange text-gray-900 text-[10px] sm:text-xs font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              </div>
              <span className="hidden sm:inline font-bold text-sm pt-2">Cart</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. Mobile Row 2: Full-Width Mobile Search Bar (md:hidden)
           ========================================================================= */}
        <div className="md:hidden px-3 pb-2.5">
          <form
            onSubmit={handleSearch}
            className="flex items-center h-10 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-amazon-amber bg-white text-gray-900 shadow-sm"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Amazon.in"
              className="flex-1 px-3 h-full text-sm outline-none bg-transparent placeholder:text-gray-500"
              aria-label="Search keywords"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-2 text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="bg-amazon-amber hover:bg-amazon-amberHover px-4 h-full flex items-center justify-center text-gray-900 transition-colors shrink-0"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* =========================================================================
            3. Mobile Row 3: Deliver to banner (md:hidden)
           ========================================================================= */}
        <div
          onClick={() => setIsLocationModalOpen(true)}
          className="md:hidden bg-amazon-lightNavy px-3 py-1.5 flex items-center justify-between text-xs text-gray-200 border-t border-amazon-navy/40 cursor-pointer hover:bg-opacity-90"
        >
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-amazon-amber shrink-0" />
            <span className="truncate">
              Deliver to <strong>{country}</strong>
            </span>
          </div>
          <span className="text-[11px] text-amazon-amber font-semibold shrink-0">
            Change
          </span>
        </div>
      </header>

      {/* Slide-in Mobile Drawer */}
      <MobileDrawer isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />
    </>
  );
}
