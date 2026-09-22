/** List/card shape used on discovery grids and homepage destination blocks. */
export interface DestinationListItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  country: string;
  heroImage: string;
  imageAlt: string;
  rating: number;
  priceLabel: string;
  objectPosition?: string;
}
