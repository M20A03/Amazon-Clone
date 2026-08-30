import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "amazon-yellow" | "amazon-orange";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "amazon-yellow",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-amber focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2 gap-2 h-10",
      lg: "text-base px-6 py-3 gap-2.5 h-12 font-semibold",
    };

    const variantStyles = {
      "amazon-yellow":
        "bg-amazon-yellow text-gray-900 hover:bg-amazon-yellowHover border border-[#d5a10e] shadow-sm",
      "amazon-orange":
        "bg-amazon-orange text-gray-900 hover:bg-amazon-orangeHover border border-[#d48200] shadow-sm",
      primary: "bg-amazon-navy text-white hover:bg-amazon-dark",
      secondary: "bg-surface text-text-primary hover:bg-surface-secondary border border-border shadow-sm",
      outline: "border border-border text-text-primary hover:bg-surface-secondary",
      ghost: "text-text-primary hover:bg-surface-secondary",
      danger: "bg-amazon-dealRed text-white hover:opacity-90",
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
