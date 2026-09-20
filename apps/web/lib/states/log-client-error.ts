/** Safe client-side error logging — never surfaces details to users. */
export function logClientError(error: Error & { digest?: string }, context?: string): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const prefix = context ? `[GO WITH US · ${context}]` : "[GO WITH US]";
  console.error(prefix, error.message, error.digest ? `(digest: ${error.digest})` : "");
}
