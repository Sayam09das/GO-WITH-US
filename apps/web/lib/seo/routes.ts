/** Static public routes included in the sitemap. */
export const STATIC_INDEXABLE_PATHS = ["/", "/destinations", "/stays", "/experiences"] as const;

/** Route prefixes that must never be indexed. */
export const NOINDEX_PREFIXES = ["/saved", "/trips", "/account"] as const;

/** Individual routes that must never be indexed. */
export const NOINDEX_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/search",
] as const;

export function isNoIndexPath(pathname: string): boolean {
  if (NOINDEX_PATHS.includes(pathname as (typeof NOINDEX_PATHS)[number])) {
    return true;
  }

  return NOINDEX_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
