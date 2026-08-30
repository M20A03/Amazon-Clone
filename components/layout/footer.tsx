"use client";

import React from "react";
import Link from "next/link";
import { useAppState } from "@/lib/state-store";
import { Globe, ArrowUp } from "lucide-react";

export function Footer() {
  const { country, currency, setIsLocationModalOpen } = useAppState();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-amazon-dark text-white mt-auto pb-16 md:pb-0">
      {/* Back to top banner */}
      <button
        onClick={scrollToTop}
        className="w-full bg-amazon-lightNavy hover:bg-opacity-90 py-3 sm:py-4 text-xs font-semibold text-center text-gray-200 transition-colors flex items-center justify-center gap-2"
        aria-label="Scroll back to top of page"
      >
        <ArrowUp className="w-4 h-4" />
        Back to top
      </button>

      {/* Main Footer Links */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-sm">
        <div>
          <h3 className="font-bold text-xs sm:text-base mb-2 sm:mb-3 text-white">Get to Know Us</h3>
          <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-gray-300">
            <li><Link href="/" className="hover:underline">About Amazon</Link></li>
            <li><Link href="/" className="hover:underline">Careers</Link></li>
            <li><Link href="/" className="hover:underline">Press Releases</Link></li>
            <li><Link href="/" className="hover:underline">Amazon Science</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xs sm:text-base mb-2 sm:mb-3 text-white">Connect with Us</h3>
          <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-gray-300">
            <li><a href="https://ypr.christuniversity.in/" target="_blank" rel="noreferrer" className="hover:underline">Christ University YPR</a></li>
            <li><a href="https://www.instagram.com/_awaisthetics_" target="_blank" rel="noreferrer" className="hover:underline">_awaisthetics_</a></li>
            <li><a href="https://www.instagram.com/subh_notokay" target="_blank" rel="noreferrer" className="hover:underline">subh_notokay</a></li>
            <li><a href="https://www.instagram.com/nihittt10" target="_blank" rel="noreferrer" className="hover:underline">nihittt10</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xs sm:text-base mb-2 sm:mb-3 text-white">Make Money with Us</h3>
          <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-gray-300">
            <li><Link href="/" className="hover:underline">Sell on Amazon</Link></li>
            <li><Link href="/" className="hover:underline">Protect Brand</Link></li>
            <li><Link href="/" className="hover:underline">Amazon Global</Link></li>
            <li><Link href="/" className="hover:underline">Fulfillment</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-xs sm:text-base mb-2 sm:mb-3 text-white">Let Us Help You</h3>
          <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs text-gray-300">
            <li><Link href="/orders" className="hover:underline">Your Orders</Link></li>
            <li><Link href="/customer-service" className="hover:underline">Returns</Link></li>
            <li><Link href="/customer-service" className="hover:underline">Protection</Link></li>
            <li><Link href="/customer-service" className="hover:underline">Help Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Region & Language Selector Bar */}
      <div className="border-t border-amazon-lightNavy py-6 sm:py-8 text-center bg-amazon-navy px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
          <Link href="/" className="font-black text-lg sm:text-xl tracking-tighter">
            amazon<span className="text-amazon-amber text-xs">.in</span>
          </Link>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 border border-gray-600 rounded hover:border-gray-400 text-gray-300 text-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{country} ({currency})</span>
          </button>
        </div>

        <p className="text-[10px] sm:text-[11px] text-gray-400 mt-3 sm:mt-4">
          © 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates. Modern Enterprise Next.js 15 Edition.
        </p>
      </div>
    </footer>
  );
}
