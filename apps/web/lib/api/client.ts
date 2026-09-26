const DEFAULT_SITE_ORIGIN = "http://127.0.0.1:3000";
const PROXY_API_BASE = "/api/v1";

function normalizeApiV1Base(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (trimmed.endsWith("/api/v1")) {
    return trimmed;
  }
  return `${trimmed}/api/v1`;
}

function resolveSiteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    process.env.APP_URL?.trim() ??
    DEFAULT_SITE_ORIGIN
  ).replace(/\/$/, "");
}

function resolveApiBaseUrl(): string {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  // Relative API base → same-origin proxy (required for HttpOnly session cookies in the browser).
  if (publicUrl?.startsWith("/")) {
    if (typeof window === "undefined") {
      return `${resolveSiteOrigin()}${normalizeApiV1Base(publicUrl)}`;
    }
    return normalizeApiV1Base(publicUrl);
  }

  if (typeof window !== "undefined") {
    return PROXY_API_BASE;
  }

  return `${resolveSiteOrigin()}${PROXY_API_BASE}`;
}

const API_BASE_URL = resolveApiBaseUrl();
const API_FETCH_TIMEOUT_MS = typeof window === "undefined" ? 20_000 : 15_000;

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      credentials: "include",
      signal: AbortSignal.timeout(API_FETCH_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new ApiRequestError(408, "REQUEST_TIMEOUT", "API request timed out.");
    }

    throw new ApiRequestError(0, "NETWORK_ERROR", "Unable to reach the API.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as {
    data?: T;
    error?: { code?: string; message?: string };
  } | null;

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      payload?.error?.code ?? "REQUEST_FAILED",
      payload?.error?.message ?? "Request failed.",
    );
  }

  return payload?.data as T;
}
