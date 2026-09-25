import { buildNormalizedPlaceId } from "../../places/places.mapper.js";
import type { ExperienceProvider } from "../experiences.provider.js";
import type {
  ExperienceAvailabilityInput,
  ExperienceSearchInput,
  NormalizedExperienceAvailability,
  NormalizedExperienceListing,
} from "../experiences.types.js";
import { AmadeusClient } from "./amadeus.client.js";

export class AmadeusExperienceProvider implements ExperienceProvider {
  readonly name = "amadeus" as const;
  private readonly client = new AmadeusClient();

  isConfigured(): boolean {
    return this.client.isConfigured();
  }

  async searchAvailability(
    input: ExperienceAvailabilityInput,
  ): Promise<NormalizedExperienceAvailability | null> {
    if (!this.isConfigured()) {
      return null;
    }

    const totalGuests = input.guests.adults + input.guests.children;
    const maxGuests = 12;

    return {
      experienceId: input.experienceId,
      date: input.date,
      startTime: input.startTime ?? "09:00",
      guests: input.guests,
      isAvailable: totalGuests <= maxGuests,
      options: [
        {
          id: `${input.experienceId}-amadeus-standard`,
          label: "Standard session",
          startTime: input.startTime ?? "09:00",
          maxGuests,
          priceFrom: null,
          available: totalGuests <= maxGuests,
        },
      ],
      source: this.name,
    };
  }

  async searchListings(input: ExperienceSearchInput): Promise<NormalizedExperienceListing[]> {
    if (!this.isConfigured()) {
      return [];
    }

    let latitude: number | undefined;
    let longitude: number | undefined;
    let radiusKm = 20;

    if (input.location) {
      latitude = input.location.latitude;
      longitude = input.location.longitude;
      radiusKm = Math.max(1, Math.round((input.location.radiusMeters ?? 20_000) / 1_000));
    } else if (input.destination) {
      const [latitudeRaw, longitudeRaw] = input.destination.split(",");
      latitude = Number(latitudeRaw);
      longitude = Number(longitudeRaw);
    }

    if (
      latitude == null ||
      longitude == null ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return [];
    }

    const response = await this.client.searchActivities({
      latitude,
      longitude,
      radiusKm,
    });

    return (response.data ?? [])
      .filter((activity) => {
        if (!input.query?.trim()) {
          return true;
        }

        const needle = input.query.trim().toLowerCase();
        return (
          activity.name.toLowerCase().includes(needle) ||
          activity.shortDescription?.toLowerCase().includes(needle)
        );
      })
      .slice(0, input.limit ?? 20)
      .map((activity) => {
        const providerExperienceId = activity.id;
        const provider = this.name;

        return {
          id: buildNormalizedPlaceId(provider, providerExperienceId),
          provider,
          providerExperienceId,
          title: activity.name,
          description: activity.shortDescription ?? null,
          destination: input.destination ?? null,
          location: {
            city: null,
            country: null,
            latitude: activity.geoCode?.latitude ?? latitude ?? 0,
            longitude: activity.geoCode?.longitude ?? longitude ?? 0,
          },
          durationLabel: null,
          rating: null,
          price: {
            amount: activity.price?.amount ? Number(activity.price.amount) : null,
            currency: "USD",
          },
          image: null,
          source: provider,
          sourceId: providerExperienceId,
        };
      });
  }
}
