import type { ExperienceProvider } from "./experiences.provider.js";
import type {
  ExperienceAvailabilityInput,
  ExperienceSearchInput,
  NormalizedExperienceAvailability,
  NormalizedExperienceListing,
} from "./experiences.types.js";

export class NoopExperienceProvider implements ExperienceProvider {
  readonly name = "none" as const;

  isConfigured(): boolean {
    return false;
  }

  async searchAvailability(
    _input: ExperienceAvailabilityInput,
  ): Promise<NormalizedExperienceAvailability | null> {
    return null;
  }

  async searchListings(_input: ExperienceSearchInput): Promise<NormalizedExperienceListing[]> {
    return [];
  }
}
