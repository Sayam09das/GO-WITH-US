import {
  priceLevelLabel,
  type RestaurantListItem,
} from "../../modules/restaurants/restaurants.types.js";
import { buildNormalizedPlaceId, isRestaurantPlace } from "../places/places.mapper.js";
import type { NormalizedPlace } from "../places/places.types.js";

function inferPriceLevel(_place: NormalizedPlace): number {
  return 2;
}

export function mapNormalizedPlaceToRestaurantListItem(place: NormalizedPlace): RestaurantListItem {
  const priceLevel = inferPriceLevel(place);

  return {
    id: buildNormalizedPlaceId(place.provider, place.providerPlaceId),
    name: place.name,
    slug: `provider-${place.providerPlaceId}`,
    destination: place.city ?? place.country ?? "Nearby",
    destinationSlug: "",
    cuisine: place.category ?? "Restaurant",
    coverImage: place.image ?? "",
    priceLevel,
    priceLabel: priceLevelLabel(priceLevel),
    rating: place.rating ?? 0,
    reviewCount: 0,
    isSaved: false,
    source: "provider",
    provider: place.provider,
    providerPlaceId: place.providerPlaceId,
    address: place.address,
    location: {
      city: place.city,
      country: place.country,
      latitude: place.latitude,
      longitude: place.longitude,
    },
  };
}

export function filterRestaurantPlaces(places: NormalizedPlace[]): NormalizedPlace[] {
  return places.filter(isRestaurantPlace);
}

export function mergeRestaurantSearchResults(
  catalog: RestaurantListItem[],
  provider: RestaurantListItem[],
): RestaurantListItem[] {
  const catalogProviderIds = new Set(
    catalog.map((item) => item.providerPlaceId).filter((value): value is string => Boolean(value)),
  );

  const uniqueProvider = provider.filter(
    (item) => !catalogProviderIds.has(item.providerPlaceId ?? ""),
  );

  return [...uniqueProvider, ...catalog];
}
