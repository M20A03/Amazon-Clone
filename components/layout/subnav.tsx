"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import Link from "next/link";
import { MobileDrawer } from "./mobile-drawer";

const SUBNAV_ITEMS = [
  { label: "All", category: "All", isDrawerTrigger: true },
  { label: "Today's Deals", category: "Deals" },
  { label: "Electronics", category: "Electronics" },
  { label: "Home", category: "Home" },
  { label: "Fashion", category: "Fashion" },
  { label: "Baby Registry", category: "Baby Registry" },
  { label: "Wedding Registry", category: "Wedding Registry" },
  { label: "Customer Service", href: "/customer-service" },
];

export function Subnav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleCategorySelect = (item: (typeof SUBNAV_ITEMS)[number]) => {
    if (item.category === "All") {
      setIsDrawerOpen(true);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (item.category) {
      params.set("category", item.category);
    } else {
      params.delete("category");
    }
    params.delete("page");

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <>
      <nav
        className="bg-amazon-dark text-white px-3 sm:px-4 text-xs font-medium overflow-x-auto whitespace-nowrap shadow-inner border-t border-amazon-lightNavy no-scrollbar"
        aria-label="Secondary navigation"
      >
        <div className="max-w-[1500px] mx-auto flex items-center h-10 gap-1 sm:gap-1.5 py-1">
          {SUBNAV_ITEMS.map((item) => {
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border border-transparent hover:border-white rounded transition-colors text-gray-200 hover:text-white shrink-0"
                >
                  {item.label}
                </Link>
              );
            }

            const isSelected = activeCategory === item.category && item.category !== "All";

            return (
              <button
                key={item.label}
                onClick={() => handleCategorySelect(item)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border rounded transition-colors shrink-0 ${
                  isSelected
                    ? "border-white bg-amazon-lightNavy text-amazon-amber font-bold"
                    : "border-transparent text-gray-200 hover:border-white hover:text-white"
                }`}
              >
                {item.category === "All" && <Menu className="w-4 h-4" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
