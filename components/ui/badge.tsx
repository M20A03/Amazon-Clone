import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "prime" | "bestseller" | "deal" | "stock" | "neutral";
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  const variantStyles = {
    prime: "bg-[#00a8e1] text-white font-bold tracking-wider text-[11px] px-2 py-0.5 rounded italic",
    bestseller: "bg-[#e67a00] text-white font-semibold text-xs px-2.5 py-0.5 rounded-sm shadow-sm",
    deal: "bg-amazon-dealRed text-white font-bold text-xs px-2 py-0.5 rounded-sm",
    stock: "bg-status-success/15 text-status-success font-medium text-xs px-2 py-0.5 rounded",
    neutral: "bg-surface-secondary text-text-secondary border border-border text-xs px-2 py-0.5 rounded",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center leading-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
