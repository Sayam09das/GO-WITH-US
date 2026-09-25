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

    const [latitudeRaw, longitudeRaw] = input.destination.split(",");
    const latitude = Number(latitudeRaw);
    const longitude = Number(longitudeRaw);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return [];
    }

    const response = await this.client.searchActivities({
      latitude,
      longitude,
    });

    return (response.data ?? []).map((activity) => ({
      id: activity.id,
      title: activity.name,
      source: this.name,
      sourceId: activity.id,
      destination: input.destination,
      durationLabel: null,
      priceFrom: activity.price?.amount ? Number(activity.price.amount) : null,
    }));
  }
}
