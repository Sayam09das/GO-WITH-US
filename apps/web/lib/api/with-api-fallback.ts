/** Returns fallback when the API is unreachable or returns an error (catalog SSR safety). */
export async function withApiFallback<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}
