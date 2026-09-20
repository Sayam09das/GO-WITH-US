/** Route-level loading variants for future App Router segments. */
export type RouteLoadingVariant = "default" | "catalog";

/**
 * Add `loading.tsx` in a route folder and re-export the matching skeleton:
 *
 * ```tsx
 * // app/destinations/loading.tsx
 * export { CatalogPageSkeleton as default } from "@/components/states";
 * ```
 */
export const ROUTE_LOADING_VARIANTS = {
  "/destinations": "catalog",
  "/stays": "catalog",
  "/experiences": "catalog",
  "/search": "catalog",
  "/trips": "default",
} as const satisfies Record<string, RouteLoadingVariant>;
