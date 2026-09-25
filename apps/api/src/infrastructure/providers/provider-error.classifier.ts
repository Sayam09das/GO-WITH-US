import type { ClassifiedProviderError, ProviderErrorCode } from "./provider-error.types.js";

function build(
  code: ProviderErrorCode,
  message: string,
  retryable: boolean,
  httpStatus?: number,
): ClassifiedProviderError {
  return { code, message, retryable, httpStatus };
}

export function classifyHttpStatus(status: number): ClassifiedProviderError {
  if (status === 429) {
    return build("RATE_LIMITED", "Provider rate limit reached.", true, status);
  }

  if (status === 401) {
    return build("UNAUTHORIZED", "Provider authentication failed.", false, status);
  }

  if (status === 403) {
    return build("FORBIDDEN", "Provider access forbidden.", false, status);
  }

  if (status >= 400 && status < 500) {
    return build("BAD_REQUEST", "Provider rejected the request.", false, status);
  }

  if (status >= 500) {
    return build("UNAVAILABLE", "Provider is temporarily unavailable.", true, status);
  }

  return build("UNAVAILABLE", "Provider request failed.", false, status);
}

export function classifyNetworkError(error: Error): ClassifiedProviderError {
  if (error.name === "TimeoutError" || error.name === "AbortError") {
    return build("TIMEOUT", "Provider request timed out.", true);
  }

  if (error.message.includes("fetch")) {
    return build("NETWORK_ERROR", "Provider network error.", true);
  }

  return build("UNAVAILABLE", error.message || "Provider request failed.", false);
}
