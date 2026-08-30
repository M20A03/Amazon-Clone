"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  Package,
  Headphones,
  Globe,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
  Flame,
  Tag,
  Laptop,
  Home as HomeIcon,
  Shirt,
  Baby,
  Gift,
} from "lucide-react";
import { useAppState } from "@/lib/state-store";
import { useTheme } from "@/components/theme-provider";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const router = useRouter();
  const { user, logout, country, currency, setIsLocationModalOpen } = useAppState();
  const { resolvedTheme, toggleTheme } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCategoryClick = (category: string) => {
    onClose();
    if (category === "All") {
      router.push("/");
    } else {
      router.push(`/?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-nav-title"
    >
      <div className="w-[85%] max-w-[340px] bg-surface h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden border-r border-border">
        {/* Header with User Profile Greeting */}
        <div className="bg-amazon-navy text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amazon-lightNavy flex items-center justify-center text-amazon-amber border border-white/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-300">
                {user ? "Welcome back," : "Hello, Sign In"}
              </p>
              <h2 id="mobile-nav-title" className="text-base font-bold text-white truncate max-w-[170px]">
                {user ? user.name : "Browse Amazon"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border text-sm">
          {/* Auth Bar if not logged in */}
          {!user && (
            <div className="p-4 bg-surface-secondary flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-text-primary">Your Account</p>
                <p className="text-[11px] text-text-secondary">Sign in for personalized deals</p>
              </div>
              <Link
                href="/login"
                onClick={onClose}
                className="bg-amazon-yellow text-gray-900 font-bold px-3 py-1.5 rounded-md text-xs hover:bg-amazon-yellowHover shadow-xs"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Trending & Featured */}
          <div className="py-3">
            <h3 className="px-5 py-1 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Trending
            </h3>
            <button
              onClick={() => handleCategoryClick("Deals")}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-amazon-dealRed" />
                <span>Today&apos;s Lightning Deals</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
            <button
              onClick={() => handleCategoryClick("All")}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-amazon-amber" />
                <span>Best Sellers & Top Picks</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          {/* Shop By Category */}
          <div className="py-3">
            <h3 className="px-5 py-1 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Shop by Category
            </h3>
            <button
              onClick={() => handleCategoryClick("Electronics")}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Laptop className="w-4 h-4 text-amazon-link" />
                <span>Electronics & Computers</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
            <button
              onClick={() => handleCategoryClick("Home")}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <HomeIcon className="w-4 h-4 text-status-success" />
                <span>Home & Smart Appliances</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
            <button
              onClick={() => handleCategoryClick("Fashion")}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Shirt className="w-4 h-4 text-purple-500" />
                <span>Fashion & Apparel</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
            <button
              onClick={() => handleCategoryClick("Baby Registry")}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Baby className="w-4 h-4 text-pink-500" />
                <span>Baby Registry</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
            <button
              onClick={() => handleCategoryClick("Wedding Registry")}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-amazon-orange" />
                <span>Wedding Registry</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="py-3">
            <h3 className="px-5 py-1 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Programs & Features
            </h3>
            <Link
              href="/orders"
              onClick={onClose}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-text-secondary" />
                <span>Your Orders & Tracking</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </Link>
            <Link
              href="/customer-service"
              onClick={onClose}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Headphones className="w-4 h-4 text-text-secondary" />
                <span>Customer Service & Returns</span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </Link>
          </div>

          {/* Settings & Preferences */}
          <div className="py-3">
            <h3 className="px-5 py-1 text-xs font-bold text-text-secondary uppercase tracking-wider">
              Settings & Preferences
            </h3>

            {/* Region / Currency selector */}
            <button
              onClick={() => {
                onClose();
                setIsLocationModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-text-secondary" />
                <span>Country & Currency</span>
              </div>
              <span className="text-[11px] font-bold text-amazon-link">
                {country} ({currency})
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-surface-secondary text-left text-text-primary text-xs font-medium"
            >
              <div className="flex items-center gap-2.5">
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4 text-amazon-amber" />
                ) : (
                  <Moon className="w-4 h-4 text-text-secondary" />
                )}
                <span>Appearance Theme</span>
              </div>
              <span className="text-[11px] font-bold capitalize text-text-secondary">
                {resolvedTheme} Mode
              </span>
            </button>

            {/* Sign Out if logged in */}
            {user && (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-5 py-2.5 hover:bg-surface-secondary text-left text-status-error text-xs font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
