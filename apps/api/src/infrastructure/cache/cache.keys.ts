export const CACHE_KEYS = {
  destination: (slug: string) => `destination:${slug}`,
  destinationsFeatured: "destinations:featured",
  experiencesFeatured: "experiences:featured",
  storiesFeatured: "stories:featured",
  discoveryHomepage: "discovery:homepage",
  searchSuggestions: (query: string) => `search:suggestions:${query}`,
  destinationSearch: (hash: string) => `search:destinations:${hash}`,
  providerPlacesSearch: (hash: string) => `provider:places:search:${hash}`,
  providerStayAvailability: (stayId: string, hash: string) =>
    `provider:stays:availability:${stayId}:${hash}`,
  providerStaySearch: (hash: string) => `provider:stays:search:${hash}`,
  providerExperienceAvailability: (experienceId: string, hash: string) =>
    `provider:experiences:availability:${experienceId}:${hash}`,
} as const;

export const CACHE_TTL = {
  featured: 300,
  destinationDetail: 600,
  discoveryHomepage: 300,
  searchSuggestions: 120,
  searchResults: 60,
  providerResults: 120,
  providerAvailability: 60,
  providerStaySearch: 120,
} as const;

export const CACHE_INVALIDATION_GROUPS = {
  destination: (slug: string) => [
    CACHE_KEYS.destination(slug),
    CACHE_KEYS.destinationsFeatured,
    CACHE_KEYS.discoveryHomepage,
  ],
} as const;
