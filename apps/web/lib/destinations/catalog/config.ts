import type { DestinationSort } from "@/types/destination";

export const DESTINATIONS_CATALOG_COPY = {
  eyebrow: "Explore",
  title: "Places worth planning around",
  subtitle: "Browse regions, styles, and landscapes — then save what catches your eye.",
  searchLabel: "Search destinations",
  searchPlaceholder: "Search by name, region, or country",
  regionLabel: "Region",
  styleLabel: "Style",
  budgetLabel: "Budget",
  ratingLabel: "Rating",
  sortLabel: "Sort by",
  allOption: "All",
  resultsSingular: "destination",
  resultsPlural: "destinations",
  clearFilters: "Clear filters",
  emptyTitle: "No destinations match",
  emptyDescription: "Try adjusting your search or filters to discover more places.",
} as const;

export const DESTINATION_SORT_OPTIONS: { value: DestinationSort; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "name", label: "Name (A–Z)" },
  { value: "rating", label: "Rating" },
];

export const DESTINATION_RATING_FILTER_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "4", label: "4+ stars" },
  { value: "3", label: "3+ stars" },
] as const;

export const DESTINATION_BUDGET_FILTER_OPTIONS = [
  { value: "", label: "Any budget" },
  { value: "budget", label: "Budget" },
  { value: "moderate", label: "Moderate" },
  { value: "luxury", label: "Luxury" },
] as const;
