"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import Link from "next/link";

const SUBNAV_ITEMS = [
  { label: "All", category: "All" },
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
  const [, startTransition] = useTransition();

  const handleCategorySelect = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.delete("page");

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <nav
      className="bg-amazon-dark text-white px-4 text-xs font-medium overflow-x-auto whitespace-nowrap shadow-inner border-t border-amazon-lightNavy"
      aria-label="Secondary navigation"
    >
      <div className="max-w-[1500px] mx-auto flex items-center h-10 gap-1">
        {SUBNAV_ITEMS.map((item) => {
          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-transparent hover:border-white rounded transition-colors text-gray-200 hover:text-white"
              >
                {item.label}
              </Link>
            );
          }

          const isSelected = activeCategory === item.category;

          return (
            <button
              key={item.label}
              onClick={() => handleCategorySelect(item.category!)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded transition-colors ${
                isSelected
                  ? "border-white bg-amazon-lightNavy text-amazon-amber font-bold"
                  : "border-transparent text-gray-200 hover:border-white hover:text-white"
              }`}
            >
              {item.category === "All" && <Menu className="w-4 h-4" />}
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
