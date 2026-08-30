import { generateUUID } from "./utils";

interface CachedResponse {
  data: unknown;
  timestamp: number;
  status: number;
}

const IN_FLIGHT_KEYS = new Set<string>();
const IDEMPOTENCY_CACHE = new Map<string, CachedResponse>();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class IdempotencyManager {
  /**
   * Generates a unique idempotency key for an action
   */
  static generateKey(prefix = "req"): string {
    return `${prefix}_${Date.now()}_${generateUUID().slice(0, 8)}`;
  }

  /**
   * Checks if an operation with this key is already executing
   */
  static isLocked(key: string): boolean {
    return IN_FLIGHT_KEYS.has(key);
  }

  /**
   * Locks an operation key during execution
   */
  static lock(key: string): boolean {
    if (IN_FLIGHT_KEYS.has(key)) {
      return false; // Already locked
    }
    IN_FLIGHT_KEYS.add(key);
    return true;
  }

  /**
   * Releases an operation key
   */
  static unlock(key: string): void {
    IN_FLIGHT_KEYS.delete(key);
  }

  /**
   * Stores response for an idempotent key
   */
  static setCached(key: string, data: unknown, status = 200): void {
    IDEMPOTENCY_CACHE.set(key, {
      data,
      timestamp: Date.now(),
      status,
    });
  }

  /**
   * Retrieves cached response if within TTL
   */
  static getCached<T>(key: string, ttlMs = DEFAULT_TTL_MS): { data: T; status: number } | null {
    const cached = IDEMPOTENCY_CACHE.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > ttlMs) {
      IDEMPOTENCY_CACHE.delete(key);
      return null;
    }

    return { data: cached.data as T, status: cached.status };
  }

  /**
   * Wraps an asynchronous operation with idempotency protection
   */
  static async executeIdempotent<T>(
    key: string,
    operation: () => Promise<T>,
    ttlMs = DEFAULT_TTL_MS
  ): Promise<T> {
    const cached = this.getCached<T>(key, ttlMs);
    if (cached) {
      return cached.data;
    }

    if (!this.lock(key)) {
      throw new Error(`Duplicate request in progress for key: ${key}`);
    }

    try {
      const result = await operation();
      this.setCached(key, result);
      return result;
    } finally {
      this.unlock(key);
    }
  }
}
