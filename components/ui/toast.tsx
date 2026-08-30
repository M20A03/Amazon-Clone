"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useAppState } from "@/lib/state-store";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useAppState();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg transition-all animate-slide-in-right bg-surface text-text-primary",
              isSuccess && "border-status-success/30 bg-status-success/5 text-text-primary",
              isError && "border-status-error/30 bg-status-error/5 text-text-primary",
              isWarning && "border-status-warning/30 bg-status-warning/5 text-text-primary",
              !isSuccess && !isError && !isWarning && "border-border bg-surface"
            )}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-status-success" />}
              {isError && <AlertCircle className="w-5 h-5 text-status-error" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-status-warning" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-status-info" />}
            </div>
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-text-muted hover:text-text-primary p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amazon-amber"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
