"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, User, ShoppingCart, Package } from "lucide-react";
import { useAppState } from "@/lib/state-store";
import { MobileDrawer } from "./mobile-drawer";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartDrawerOpen, user } = useAppState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hide on checkout page for distraction-free checkout
  if (pathname === "/checkout") return null;

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border shadow-lg pb-safe"
        aria-label="Mobile bottom navigation"
      >
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              pathname === "/" ? "text-amazon-orange font-bold" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          {/* 2. Menu / Categories Drawer */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Menu</span>
          </button>

          {/* 3. You / Profile / Orders */}
          <Link
            href={user ? "/orders" : "/login"}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              pathname === "/orders" || pathname === "/login"
                ? "text-amazon-orange font-bold"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {user ? <Package className="w-5 h-5" /> : <User className="w-5 h-5" />}
            <span className="text-[10px] mt-0.5">{user ? "Orders" : "Sign In"}</span>
          </Link>

          {/* 4. Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-text-secondary hover:text-text-primary transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amazon-orange text-gray-900 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">Cart</span>
          </button>
        </div>
      </nav>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
