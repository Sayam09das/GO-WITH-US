export type StayPropertyType = "boutique-hotel" | "villa" | "eco-lodge" | "apartment" | "resort";

export type StayLayoutVariant = "tall" | "wide" | "portrait";

/** List/card shape used on discovery surfaces and homepage editorial blocks. */
export interface StayListItem {
  id: string;
  slug: string;
  name: string;
  destination: string;
  propertyType: StayPropertyType;
  propertyTypeLabel: string;
  description: string;
  heroImage: string;
  imageAlt: string;
  objectPosition?: string;
  isFeatured?: boolean;
  layoutVariant?: StayLayoutVariant;
}
