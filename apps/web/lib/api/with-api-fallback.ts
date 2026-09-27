/** Returns fallback when the API is unreachable or returns an error (catalog SSR safety). */
export async function withApiFallback<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export type ApiLoadResult<T> = { ok: true; value: T } | { ok: false };

/** Prefer over silent empty fallbacks when the UI should show an error state. */
export async function tryApiLoad<T>(promise: Promise<T>): Promise<ApiLoadResult<T>> {
  try {
    return { ok: true, value: await promise };
  } catch {
    return { ok: false };
  }
}
