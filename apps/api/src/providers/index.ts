import { env } from "../config/env.js";
import type { AccommodationProvider } from "./accommodation/accommodation.provider.js";
import { BookingAccommodationProvider } from "./accommodation/booking/booking.provider.js";
import { NoopAccommodationProvider } from "./accommodation/noop.accommodation.provider.js";
import { AmadeusExperienceProvider } from "./experiences/amadeus/amadeus.provider.js";
import type { ExperienceProvider } from "./experiences/experiences.provider.js";
import { NoopExperienceProvider } from "./experiences/noop.experiences.provider.js";
import { FoursquarePlacesProvider } from "./places/foursquare/foursquare.provider.js";
import { NoopPlacesProvider } from "./places/noop.places.provider.js";
import type { PlacesProvider } from "./places/places.provider.js";
import type { ProviderSource } from "./provider.types.js";

function normalizeProviderName(value: string): string {
  return value.trim().toLowerCase();
}

class ProviderFactory {
  private placesProvider: PlacesProvider | null = null;
  private accommodationProvider: AccommodationProvider | null = null;
  private experienceProvider: ExperienceProvider | null = null;

  getPlacesProvider(): PlacesProvider {
    if (!this.placesProvider) {
      this.placesProvider = this.createPlacesProvider();
    }

    return this.placesProvider;
  }

  getAccommodationProvider(): AccommodationProvider {
    if (!this.accommodationProvider) {
      this.accommodationProvider = this.createAccommodationProvider();
    }

    return this.accommodationProvider;
  }

  getExperienceProvider(): ExperienceProvider {
    if (!this.experienceProvider) {
      this.experienceProvider = this.createExperienceProvider();
    }

    return this.experienceProvider;
  }

  activeProviders(): ProviderSource[] {
    const providers: ProviderSource[] = [];

    if (this.getPlacesProvider().isConfigured()) {
      providers.push(this.getPlacesProvider().name);
    }

    if (this.getAccommodationProvider().isConfigured()) {
      providers.push(this.getAccommodationProvider().name);
    }

    if (this.getExperienceProvider().isConfigured()) {
      providers.push(this.getExperienceProvider().name);
    }

    return providers;
  }

  private createPlacesProvider(): PlacesProvider {
    switch (normalizeProviderName(env.providerPlaces)) {
      case "foursquare":
        return new FoursquarePlacesProvider();
      default:
        return new NoopPlacesProvider();
    }
  }

  private createAccommodationProvider(): AccommodationProvider {
    switch (normalizeProviderName(env.providerAccommodation)) {
      case "booking":
        return new BookingAccommodationProvider();
      default:
        return new NoopAccommodationProvider();
    }
  }

  private createExperienceProvider(): ExperienceProvider {
    switch (normalizeProviderName(env.providerExperiences)) {
      case "amadeus":
        return new AmadeusExperienceProvider();
      default:
        return new NoopExperienceProvider();
    }
  }
}

export const providerFactory = new ProviderFactory();

export type { AccommodationProvider } from "./accommodation/accommodation.provider.js";
export type { ExperienceProvider } from "./experiences/experiences.provider.js";
export type { PlacesProvider } from "./places/places.provider.js";
export type { ProviderSource } from "./provider.types.js";
