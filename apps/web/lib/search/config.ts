export const SEARCH_PAGE_COPY = {
  eyebrow: "Search",
  title: "Search GO WITH US",
  titleWithQuery: (query: string) => `Results for “${query}”`,
  subtitle:
    "Find destinations, stays, experiences, and editorial stories in one place — then save what inspires you.",
  searchLabel: "Search the catalog",
  searchPlaceholder: "Search destinations, stays, experiences, or stories",
  statusWithQuery: (query: string) => `Showing results for “${query}”`,
  clearSearch: "Clear search",
  updating: "Searching…",
  emptyQueryTitle: "Start with a destination, stay, or experience",
  emptyQueryDescription:
    "Enter a place name, region, or activity above to search the GO WITH US catalog.",
  emptyResultsTitle: (query: string) => `No results for “${query}”`,
  emptyResultsDescription:
    "Try a shorter keyword, check spelling, or browse destinations to get inspired.",
  sections: {
    destinations: "Destinations",
    stays: "Stays",
    experiences: "Experiences",
    stories: "Stories",
  },
  tabs: {
    all: "All results",
    destinations: "Destinations",
    stays: "Stays",
    experiences: "Experiences",
  },
  resultsCount: (count: number) => (count === 1 ? "1 result" : `${count} results`),
} as const;
