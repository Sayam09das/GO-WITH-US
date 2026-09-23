export type DestinationBudgetTier = "budget" | "moderate" | "luxury";

/** List/card shape used on discovery grids and homepage destination blocks. */
export interface DestinationListItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  region: string;
  style: string;
  category: string;
  budgetTier: DestinationBudgetTier;
  popularity: number;
  heroImage: string;
  imageAlt: string;
  rating: number;
  priceLabel: string;
  objectPosition?: string;
}

export type DestinationSort = "popularity" | "name" | "rating";

export interface DestinationCatalogFilters {
  q: string;
  region: string;
  style: string;
  budgetTier: string;
  rating: string;
  sort: DestinationSort;
}
