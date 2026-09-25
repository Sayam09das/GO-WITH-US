import type { Destination, Prisma } from "../../generated/client.js";
import { prisma } from "../../lib/db.js";
import type { NormalizedPlace } from "../../providers/places/places.types.js";
import { buildProviderSlug } from "./slug.js";

const PLACEHOLDER_HERO =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80";

export type UpsertDestinationFromPlaceInput = {
  place: NormalizedPlace;
  publish?: boolean;
};

export const destinationSyncRepository = {
  findByProviderPlace(provider: string, providerPlaceId: string): Promise<Destination | null> {
    return prisma.destination.findFirst({
      where: {
        provider,
        providerPlaceId,
      },
    });
  },

  async upsertFromPlace(input: UpsertDestinationFromPlaceInput): Promise<Destination> {
    const { place, publish = false } = input;
    const provider = place.provider;
    const providerPlaceId = place.providerPlaceId;
    const now = new Date();

    const providerOwned: Prisma.DestinationUpdateInput = {
      title: place.name,
      city: place.city,
      region: place.region ?? place.city ?? undefined,
      country: place.country ?? undefined,
      latitude: place.latitude,
      longitude: place.longitude,
      provider,
      providerPlaceId,
      providerSyncedAt: now,
      syncStatus: "ACTIVE",
    };

    const existing = await this.findByProviderPlace(provider, providerPlaceId);

    if (existing) {
      return prisma.destination.update({
        where: { id: existing.id },
        data: providerOwned,
      });
    }

    const slug = buildProviderSlug(place.name, providerPlaceId);
    const slugConflict = await prisma.destination.findUnique({ where: { slug } });
    const resolvedSlug = slugConflict ? `${slug}-${Date.now().toString(36)}` : slug;

    return prisma.destination.create({
      data: {
        slug: resolvedSlug,
        title: place.name,
        country: place.country ?? "Unknown",
        region: place.region ?? place.city ?? place.country ?? "Unknown",
        city: place.city,
        heroImage: place.image ?? PLACEHOLDER_HERO,
        gallery: place.image ? [place.image] : [],
        overview: `Discover ${place.name}.`,
        highlights: [],
        budgetTier: "moderate",
        categoryTags: place.category ? [place.category] : [],
        travelStyles: [],
        latitude: place.latitude,
        longitude: place.longitude,
        provider,
        providerPlaceId,
        providerSyncedAt: now,
        syncStatus: "ACTIVE",
        isPublished: publish,
        isFeatured: false,
      },
    });
  },

  async markSyncFailed(provider: string, providerPlaceId: string): Promise<void> {
    await prisma.destination.updateMany({
      where: { provider, providerPlaceId },
      data: {
        syncStatus: "FAILED",
        providerSyncedAt: new Date(),
      },
    });
  },
};
