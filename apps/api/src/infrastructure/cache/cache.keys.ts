export const CACHE_KEYS = {
  destination: (slug: string) => `destination:${slug}`,
  destinationsFeatured: "destinations:featured",
  experiencesFeatured: "experiences:featured",
  storiesFeatured: "stories:featured",
  discoveryHomepage: "discovery:homepage",
  searchSuggestions: (query: string) => `search:suggestions:${query}`,
  destinationSearch: (hash: string) => `search:destinations:${hash}`,
} as const;

export const CACHE_TTL = {
  featured: 300,
  destinationDetail: 600,
  discoveryHomepage: 300,
  searchSuggestions: 120,
  searchResults: 60,
} as const;

export const CACHE_INVALIDATION_GROUPS = {
  destination: (slug: string) => [
    CACHE_KEYS.destination(slug),
    CACHE_KEYS.destinationsFeatured,
    CACHE_KEYS.discoveryHomepage,
  ],
} as const;
