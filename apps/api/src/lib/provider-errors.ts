import type { ClassifiedProviderError } from "../infrastructure/providers/provider-error.types.js";
import { AppError } from "./errors.js";

export class ProviderUnavailableError extends AppError {
  constructor(
    message = "Live travel data is temporarily unavailable.",
    details?: Record<string, unknown>,
  ) {
    super(503, "PROVIDER_UNAVAILABLE", message, details);
    this.name = "ProviderUnavailableError";
  }
}

export class ProviderRateLimitedError extends AppError {
  constructor(message = "Live search is temporarily unavailable. Please try again shortly.") {
    super(429, "PROVIDER_RATE_LIMITED", message);
    this.name = "ProviderRateLimitedError";
  }
}

export function throwClassifiedProviderError(error: ClassifiedProviderError): never {
  if (error.code === "RATE_LIMITED") {
    throw new ProviderRateLimitedError(error.message);
  }

  throw new ProviderUnavailableError(error.message, {
    providerError: error.code,
    httpStatus: error.httpStatus,
  });
}
