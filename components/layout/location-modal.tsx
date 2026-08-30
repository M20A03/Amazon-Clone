"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { COUNTRIES } from "@/lib/data/products";
import { useAppState } from "@/lib/state-store";
import { Check, Globe } from "lucide-react";
import { type CurrencyCode } from "@/lib/utils";

export function LocationModal() {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    country: currentCountry,
    currency: currentCurrency,
    setCountryAndCurrency,
  } = useAppState();

  return (
    <Modal
      isOpen={isLocationModalOpen}
      onClose={() => setIsLocationModalOpen(false)}
      title="Choose your delivery destination & currency"
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Delivery options, pricing, and currency will automatically update based on your selected region.
        </p>

        <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-surface">
          {COUNTRIES.map((c) => {
            const isSelected = c.name === currentCountry;

            return (
              <button
                key={c.code}
                onClick={() => setCountryAndCurrency(c.name, c.currency as CurrencyCode)}
                className={`w-full flex items-center justify-between p-3.5 text-left transition-colors hover:bg-surface-secondary ${
                  isSelected ? "bg-amazon-amber/10 font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-xs font-bold border border-border">
                    {c.code}
                  </div>
                  <div>
                    <div className="text-sm text-text-primary flex items-center gap-2">
                      {c.name}
                      <span className="text-xs font-normal text-text-muted">
                        ({c.currency} - {c.symbol})
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary">
                      Standard Express Delivery Available
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-amazon-amber flex items-center justify-center text-gray-900">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-xs text-text-muted flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" />
          <span>Cross-border shipping duties and customs calculated dynamically at checkout.</span>
        </div>
      </div>
    </Modal>
  );
}
