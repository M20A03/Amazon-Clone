export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  status: number;
  retryable: boolean;
  field?: string;
}

export function mapDatabaseOrApiError(error: unknown): AppError {
  if (typeof error === "string") {
    return {
      code: "GENERIC_ERROR",
      message: error,
      userMessage: error,
      status: 400,
      retryable: false,
    };
  }

  const err = error as Record<string, any>;

  // Prisma Database Errors
  if (err?.code === "P2002") {
    const target = Array.isArray(err?.meta?.target) ? err.meta.target.join(", ") : "field";
    return {
      code: "UNIQUE_CONSTRAINT_VIOLATION",
      message: `Unique constraint failed on: ${target}`,
      userMessage: `An account with this ${target} already exists. Please try logging in or use another ${target}.`,
      status: 409,
      retryable: false,
      field: target,
    };
  }

  if (err?.code === "P2025") {
    return {
      code: "RECORD_NOT_FOUND",
      message: "An operation failed because it depends on one or more records that were required but not found.",
      userMessage: "The requested product, order, or item was not found.",
      status: 404,
      retryable: false,
    };
  }

  if (err?.code === "P2003") {
    return {
      code: "FOREIGN_KEY_VIOLATION",
      message: "Foreign key constraint violation.",
      userMessage: "Referenced item or user profile is invalid.",
      status: 400,
      retryable: false,
    };
  }

  // Payment Gateway Errors
  if (err?.type === "card_error" || err?.code === "card_declined") {
    return {
      code: "PAYMENT_DECLINED",
      message: err.message || "Card was declined",
      userMessage: "Your card was declined by the issuer. Please check your card number, CVV, or try another payment method.",
      status: 402,
      retryable: true,
    };
  }

  if (err?.code === "insufficient_funds") {
    return {
      code: "INSUFFICIENT_FUNDS",
      message: "Card has insufficient funds",
      userMessage: "Insufficient funds available. Please select another card or payment method.",
      status: 402,
      retryable: true,
    };
  }

  if (err?.code === "expired_card") {
    return {
      code: "EXPIRED_CARD",
      message: "Card has expired",
      userMessage: "Your card has expired. Please enter an updated card.",
      status: 402,
      retryable: false,
    };
  }

  // Network & Timeout Errors
  if (err?.name === "AbortError" || err?.code === "TIMEOUT") {
    return {
      code: "REQUEST_TIMEOUT",
      message: "Request timed out after 8000ms",
      userMessage: "Network request timed out. Please check your connection and retry.",
      status: 408,
      retryable: true,
    };
  }

  if (!navigator.onLine) {
    return {
      code: "OFFLINE",
      message: "Device is offline",
      userMessage: "You are currently offline. Actions will be queued and synchronized once connection is restored.",
      status: 0,
      retryable: true,
    };
  }

  return {
    code: err?.code || "INTERNAL_ERROR",
    message: err?.message || "An unexpected error occurred",
    userMessage: err?.userMessage || "Something went wrong on our end. Please refresh or try again in a moment.",
    status: err?.status || 500,
    retryable: true,
  };
}
