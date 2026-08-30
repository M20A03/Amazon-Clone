import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COUNTRIES } from "./data/products";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "JPY";

export function formatCurrency(
  amountInINR: number,
  currency: CurrencyCode = "INR"
): string {
  const country = COUNTRIES.find((c) => c.currency === currency) || COUNTRIES[0];
  const converted = amountInINR * country.rate;

  const localeMap: Record<CurrencyCode, string> = {
    INR: "en-IN",
    USD: "en-US",
    EUR: "de-DE",
    GBP: "en-GB",
    JPY: "ja-JP",
  };

  try {
    return new Intl.NumberFormat(localeMap[currency] || "en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: currency === "JPY" ? 0 : 2,
      minimumFractionDigits: currency === "JPY" ? 0 : 2,
    }).format(converted);
  } catch {
    return `${country.symbol}${converted.toFixed(2)}`;
  }
}

export function getEstimatedDeliveryDate(daysFromNow = 2): {
  dateString: string;
  timeString: string;
  isToday: boolean;
} {
  const target = new Date();
  target.setDate(target.getDate() + daysFromNow);
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
  };

  return {
    dateString: target.toLocaleDateString("en-US", options),
    timeString: "10:00 PM",
    isToday: daysFromNow === 0,
  };
}

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function truncateText(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}
