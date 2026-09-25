import type { z } from "zod";
import { CACHE_KEYS, CACHE_TTL } from "../../infrastructure/cache/cache.keys.js";
import { cacheService } from "../../infrastructure/cache/cache.service.js";
import { AppError } from "../../lib/errors.js";
import { ProviderUnavailableError } from "../../lib/provider-errors.js";
import {
  mapAccommodationAvailabilityToStayResult,
  mapProviderListingToStayListItem,
  mergeStaySearchResults,
} from "../../providers/accommodation/accommodation.mapper.js";
import { providerFactory } from "../../providers/index.js";
import { resolveAccommodationDestinationId } from "../../services/accommodation/resolve-destination.js";
import { staysRepository } from "./stays.repository.js";
import type { ListStaysQuery, StaySearchInput, stayAvailabilitySchema } from "./stays.schemas.js";
import {
  buildPaginationMeta,
  buildStayAvailability,
  type StayAvailabilityResult,
  type StayListItem,
  type StayReviewSummary,
  toStayDetail,
  toStayListItem,
} from "./stays.types.js";

type StayAvailabilityInput = z.infer<typeof stayAvailabilitySchema>;

function paginateItems<T>(items: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

function toReviewSummary(review: {
  id: string;
  rating: number;
  body: string | null;
  createdAt: Date;
  user: { id: string; fullName: string; avatarUrl: string | null };
}): StayReviewSummary {
  return {
    id: review.id,
    rating: review.rating,
    body: review.body,
    createdAt: review.createdAt.toISOString(),
    user: {
      id: review.user.id,
      name: review.user.fullName,
      avatar: review.user.avatarUrl,
    },
  };
}

async function searchProviderStays(input: StaySearchInput): Promise<StayListItem[]> {
  const accommodationProvider = providerFactory.getAccommodationProvider();
  if (
    !accommodationProvider.isConfigured() ||
    !input.destination ||
    !input.checkIn ||
    !input.checkOut ||
    !input.guests
  ) {
    return [];
  }

  const destinationId = await resolveAccommodationDestinationId(input.destination);
  if (!destinationId) {
    return [];
  }

  const checkIn = input.checkIn;
  const checkOut = input.checkOut;
  const guests = input.guests;

  const cacheKey = CACHE_KEYS.providerStaySearch(
    cacheService.hashQuery({
      destination: destinationId,
      checkIn,
      checkOut,
      guests,
      rooms: input.rooms,
      query: input.query,
    }),
  );

  const cached = await cacheService.getOrSetWithLock(cacheKey, CACHE_TTL.providerStaySearch, () =>
    accommodationProvider.search({
      destination: destinationId,
      checkIn,
      checkOut,
      guests,
      rooms: input.rooms,
      limit: input.limit,
    }),
  );

  return cached.value
    .filter((listing) => {
      if (!input.query?.trim()) {
        return true;
      }

      const needle = input.query.trim().toLowerCase();
      return listing.name.toLowerCase().includes(needle);
    })
    .map(mapProviderListingToStayListItem);
}

async function fetchProviderAvailability(input: {
  stayId: string;
  providerPropertyId: string;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number };
  rooms: number;
}): Promise<StayAvailabilityResult> {
  const accommodationProvider = providerFactory.getAccommodationProvider();
  const cacheKey = CACHE_KEYS.providerStayAvailability(
    input.stayId,
    cacheService.hashQuery({
      providerPropertyId: input.providerPropertyId,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      rooms: input.rooms,
    }),
  );

  const cached = await cacheService.getOrSetWithLock(
    cacheKey,
    CACHE_TTL.providerAvailability,
    async () => {
      const availability = await accommodationProvider.checkAvailability({
        stayId: input.stayId,
        providerPropertyId: input.providerPropertyId,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guests: input.guests,
        rooms: input.rooms,
      });

      if (!availability) {
        throw new ProviderUnavailableError("Live availability is temporarily unavailable.");
      }

      return mapAccommodationAvailabilityToStayResult(availability);
    },
  );

  return {
    ...cached.value,
    meta: {
      ...cached.value.meta,
      stale: cached.stale,
    },
  };
}

export const staysService = {
  async list(input: ListStaysQuery, userId?: string) {
    const result = await staysRepository.list(input);
    const savedIds = userId
      ? await staysRepository.findSavedStayIds(
          userId,
          result.stays.map((stay) => stay.id),
        )
      : new Set<string>();

    return {
      stays: result.stays.map((stay) => toStayListItem(stay, savedIds.has(stay.id))),
      meta: buildPaginationMeta({
        page: result.page,
        limit: result.limit,
        total: result.total,
      }),
    };
  },

  async search(input: StaySearchInput, userId?: string) {
    const catalogResult = await staysRepository.search(input);
    const savedIds = userId
      ? await staysRepository.findSavedStayIds(
          userId,
          catalogResult.stays.map((stay) => stay.id),
        )
      : new Set<string>();

    const catalogItems = catalogResult.stays.map((stay) =>
      toStayListItem(stay, savedIds.has(stay.id)),
    );

    const accommodationProvider = providerFactory.getAccommodationProvider();
    const providerItems = await searchProviderStays(input);
    const merged = mergeStaySearchResults(catalogItems, providerItems);
    const paginated = paginateItems(merged, input.page, input.limit);

    return {
      stays: paginated,
      meta: {
        ...buildPaginationMeta({
          page: input.page,
          limit: input.limit,
          total: merged.length,
        }),
        ...(providerItems.length > 0
          ? {
              provider: accommodationProvider.name,
              providerCount: providerItems.length,
            }
          : {}),
        ...(input.checkIn && input.checkOut && input.guests
          ? {
              dateFilterApplied: providerItems.length > 0,
              guestFilterApplied: providerItems.length > 0,
            }
          : {
              ...(input.checkIn || input.checkOut ? { dateFilterApplied: false } : {}),
              ...(input.guests ? { guestFilterApplied: false } : {}),
            }),
      },
    };
  },

  async getBySlug(slug: string, userId?: string) {
    const stay = await staysRepository.findBySlug(slug);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    const nearbyExperiences = await staysRepository.findNearbyExperiences(stay.destinationId);
    const savedIds = userId
      ? await staysRepository.findSavedStayIds(userId, [stay.id])
      : new Set<string>();

    return toStayDetail(stay, nearbyExperiences, savedIds.has(stay.id));
  },

  async getAvailability(stayIdOrSlug: string, input: StayAvailabilityInput) {
    const stay = await staysRepository.findByIdOrSlug(stayIdOrSlug);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    const accommodationProvider = providerFactory.getAccommodationProvider();
    const providerPropertyId = stay.providerPropertyId;

    if (accommodationProvider.isConfigured() && providerPropertyId) {
      try {
        return await fetchProviderAvailability({
          stayId: stay.id,
          providerPropertyId,
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          guests: input.guests,
          rooms: input.rooms,
        });
      } catch (error) {
        if (error instanceof ProviderUnavailableError) {
          throw error;
        }

        throw new ProviderUnavailableError("Live availability is temporarily unavailable.");
      }
    }

    return buildStayAvailability({
      stay,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      rooms: input.rooms,
    });
  },

  async listReviews(stayIdOrSlug: string, page: number, limit: number) {
    const stay = await staysRepository.findByIdOrSlug(stayIdOrSlug);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    const result = await staysRepository.listReviews(stay.id, page, limit);

    return {
      reviews: result.reviews.map(toReviewSummary),
      aggregate: {
        average: result.aggregate._avg.rating ? Number(result.aggregate._avg.rating) : 0,
        count: result.aggregate._count.rating,
      },
      meta: buildPaginationMeta({ page, limit, total: result.total }),
    };
  },

  async createReview(
    stayIdOrSlug: string,
    userId: string,
    input: { rating: number; body?: string },
  ) {
    const stay = await staysRepository.findByIdOrSlug(stayIdOrSlug);

    if (!stay) {
      throw new AppError(404, "NOT_FOUND", "Stay not found.");
    }

    const existingReview = await staysRepository.findExistingReview(userId, stay.id);
    if (existingReview) {
      throw new AppError(409, "CONFLICT", "You have already reviewed this stay.");
    }

    const isEligible = await staysRepository.isUserEligibleToReviewStay(userId, stay.id);
    if (!isEligible) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can review this stay after adding it to a trip itinerary or completing a stay booking.",
      );
    }

    const review = await staysRepository.createReview({
      userId,
      stayId: stay.id,
      rating: input.rating,
      body: input.body,
    });

    return toReviewSummary(review);
  },
};
