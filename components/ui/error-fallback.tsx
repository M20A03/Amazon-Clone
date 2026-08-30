"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this section.",
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-surface rounded-xl border border-border max-w-lg mx-auto my-12 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-status-error/10 text-status-error flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">{title}</h2>
      <p className="text-sm text-text-secondary mb-6 max-w-md">
        {error.message || message}
      </p>

      {error.digest && (
        <p className="text-xs text-text-muted font-mono bg-surface-secondary px-3 py-1.5 rounded mb-6 border border-border">
          Error Digest: {error.digest}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="amazon-yellow"
          onClick={reset}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
        <Link href="/">
          <Button variant="secondary" leftIcon={<Home className="w-4 h-4" />}>
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
