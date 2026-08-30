"use client";

import React, { useEffect } from "react";
import { ErrorFallback } from "@/components/ui/error-fallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // SRE Telemetry Logging
    console.error("Global Error Boundary caught exception:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-background">
      <ErrorFallback
        error={error}
        reset={reset}
        title="We encountered an error loading this page"
        message="An unexpected system error occurred. Our engineering team has been automatically alerted."
      />
    </div>
  );
}
