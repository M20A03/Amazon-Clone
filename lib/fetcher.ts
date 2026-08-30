import { IdempotencyManager } from "./idempotency";
import { mapDatabaseOrApiError, type AppError } from "./error-mapper";

export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  idempotent?: boolean;
  idempotencyKey?: string;
  cacheKey?: string;
  useOfflineCache?: boolean;
  suppressToast?: boolean;
}

export type ToastCallback = (message: string, type?: "success" | "error" | "info" | "warning") => void;

let globalToastHandler: ToastCallback | null = null;
let globalAuthErrorHandler: (() => void) | null = null;

export function registerToastHandler(handler: ToastCallback) {
  globalToastHandler = handler;
}

export function registerAuthErrorHandler(handler: () => void) {
  globalAuthErrorHandler = handler;
}

/**
 * Enterprise Resilient Fetch Client
 * Features:
 * - Exponential backoff with random jitter
 * - Configurable timeout with AbortController
 * - Automatic Idempotency Key injection
 * - Offline localStorage fallback caching
 * - Global 401/403/500 interceptors
 */
export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const {
    timeoutMs = 8000,
    retries = 2,
    retryDelayMs = 1000,
    idempotent = false,
    idempotencyKey,
    cacheKey,
    useOfflineCache = false,
    suppressToast = false,
    headers = {},
    ...customConfig
  } = options;

  const method = (customConfig.method || "GET").toUpperCase();
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  // Generate or attach idempotency key for mutating requests
  const requestHeaders = new Headers(headers);
  if (isMutating && (idempotent || idempotencyKey)) {
    const key = idempotencyKey || IdempotencyManager.generateKey(`idem_${method.toLowerCase()}`);
    requestHeaders.set("X-Idempotency-Key", key);
  }
  if (!requestHeaders.has("Content-Type") && isMutating) {
    requestHeaders.set("Content-Type", "application/json");
  }

  // Attempt offline cache retrieval if offline
  if (typeof window !== "undefined" && !navigator.onLine && useOfflineCache && cacheKey) {
    const cached = localStorage.getItem(`cache_${cacheKey}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (!suppressToast && globalToastHandler) {
          globalToastHandler("Loaded cached offline data.", "info");
        }
        return parsed as T;
      } catch {
        // Corrupted cache, continue
      }
    }
  }

  let attempt = 0;
  let lastError: AppError | null = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...customConfig,
        method,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        if (globalAuthErrorHandler) {
          globalAuthErrorHandler();
        }
        if (!suppressToast && globalToastHandler) {
          globalToastHandler("Your session has expired. Please log in again.", "warning");
        }
        throw mapDatabaseOrApiError({ status: 401, message: "Unauthorized" });
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        if (!suppressToast && globalToastHandler) {
          globalToastHandler("You do not have permission to perform this action.", "error");
        }
        throw mapDatabaseOrApiError({ status: 403, message: "Forbidden" });
      }

      // Handle 5xx Server Errors (Retryable)
      if (response.status >= 500) {
        const errPayload = await response.json().catch(() => ({}));
        const mapped = mapDatabaseOrApiError({ status: response.status, ...errPayload });
        
        if (attempt < retries) {
          attempt++;
          // Exponential backoff with jitter
          const jitter = Math.random() * 200;
          const delay = Math.min(retryDelayMs * 2 ** (attempt - 1) + jitter, 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        if (!suppressToast && globalToastHandler) {
          globalToastHandler(mapped.userMessage, "error");
        }
        throw mapped;
      }

      // Handle 4xx Client Errors (Non-retryable)
      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        const mapped = mapDatabaseOrApiError({ status: response.status, ...errPayload });
        if (!suppressToast && globalToastHandler) {
          globalToastHandler(mapped.userMessage, "error");
        }
        throw mapped;
      }

      const data = (await response.json()) as T;

      // Update offline cache for successful GET requests
      if (typeof window !== "undefined" && method === "GET" && cacheKey) {
        try {
          localStorage.setItem(`cache_${cacheKey}`, JSON.stringify(data));
        } catch {
          // Storage quota exceeded or disabled
        }
      }

      return data;
    } catch (err: unknown) {
      clearTimeout(timer);
      const mapped = mapDatabaseOrApiError(err);
      lastError = mapped;

      // If retryable and attempts remain, backoff and retry
      if (mapped.retryable && attempt < retries) {
        attempt++;
        const jitter = Math.random() * 200;
        const delay = Math.min(retryDelayMs * 2 ** (attempt - 1) + jitter, 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Check for offline cache fallback on network failure
      if (typeof window !== "undefined" && useOfflineCache && cacheKey) {
        const cached = localStorage.getItem(`cache_${cacheKey}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (!suppressToast && globalToastHandler) {
              globalToastHandler("Network unavailable. Showing offline data.", "warning");
            }
            return parsed as T;
          } catch {
            // parse error
          }
        }
      }

      if (!suppressToast && globalToastHandler) {
        globalToastHandler(mapped.userMessage, "error");
      }
      throw mapped;
    }
  }

  throw lastError || mapDatabaseOrApiError("Request failed after retries.");
}
