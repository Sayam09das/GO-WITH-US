import { providersConfig } from "../../config/providers.js";
import { logger } from "../../infrastructure/logging/logger.js";
import { ProviderUnavailableError } from "../../lib/provider-errors.js";

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

        logger.warn("provider.http.failed", {
          provider: input.provider,
          operation: input.operation,
          status: response.status,
          attempt,
        });

        throw new ProviderUnavailableError();
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown provider request error.");

      if (error instanceof ProviderUnavailableError) {
        throw error;
      }

      const isTimeout = lastError.name === "TimeoutError" || lastError.name === "AbortError";
      const canRetry = attempt < maxAttempts && (isTimeout || lastError.message.includes("fetch"));

      logger.warn("provider.http.error", {
        provider: input.provider,
        operation: input.operation,
        attempt,
        message: lastError.message,
      });

      if (!canRetry) {
        break;
      }

      await delay(250 * attempt);
    }
  }

  throw lastError instanceof ProviderUnavailableError ? lastError : new ProviderUnavailableError();
}
