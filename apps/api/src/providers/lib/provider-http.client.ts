import { providersConfig } from "../../config/providers.js";
import { logger } from "../../infrastructure/logging/logger.js";
import { providerCircuitBreaker } from "../../infrastructure/providers/circuit-breaker.js";
import {
  classifyHttpStatus,
  classifyNetworkError,
} from "../../infrastructure/providers/provider-error.classifier.js";
import { AppError } from "../../lib/errors.js";
import { throwClassifiedProviderError } from "../../lib/provider-errors.js";

type ProviderHttpRequest = {
  url: URL;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
  provider: string;
  operation: string;
  retryable?: boolean;
};

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function providerHttpRequest<T>(input: ProviderHttpRequest): Promise<T> {
  if (!providerCircuitBreaker.canRequest(input.provider, input.operation)) {
    logger.warn("provider.circuit.open", {
      provider: input.provider,
      operation: input.operation,
    });
    throwClassifiedProviderError({
      code: "UNAVAILABLE",
      message: "Live travel data is temporarily unavailable.",
      retryable: false,
    });
  }

  const timeoutMs = input.timeoutMs ?? providersConfig.http.defaultTimeoutMs;
  const maxAttempts = input.retryable === false ? 1 : providersConfig.http.maxRetries + 1;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(input.url, {
        method: input.method ?? "GET",
        headers: input.headers,
        body: input.body,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        if (attempt < maxAttempts && isRetryableStatus(response.status)) {
          await delay(250 * attempt);
          continue;
        }

        const classified = classifyHttpStatus(response.status);
        logger.warn("provider.http.failed", {
          provider: input.provider,
          operation: input.operation,
          status: response.status,
          errorType: classified.code,
          attempt,
        });
        providerCircuitBreaker.recordFailure(input.provider, input.operation);
        throwClassifiedProviderError(classified);
      }

      providerCircuitBreaker.recordSuccess(input.provider, input.operation);
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      lastError = error instanceof Error ? error : new Error("Unknown provider request error.");
      const classified = classifyNetworkError(lastError);
      const canRetry = attempt < maxAttempts && classified.retryable;

      logger.warn("provider.http.error", {
        provider: input.provider,
        operation: input.operation,
        attempt,
        errorType: classified.code,
        message: lastError.message,
      });

      if (!canRetry) {
        providerCircuitBreaker.recordFailure(input.provider, input.operation);
        throwClassifiedProviderError(classified);
      }

      await delay(250 * attempt);
    }
  }

  providerCircuitBreaker.recordFailure(input.provider, input.operation);
  throwClassifiedProviderError(
    classifyNetworkError(lastError ?? new Error("Provider request failed.")),
  );
}
