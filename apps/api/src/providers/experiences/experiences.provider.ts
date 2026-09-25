import type { ProviderCapabilities } from "../provider.types.js";
import type {
  ExperienceAvailabilityInput,
  ExperienceSearchInput,
  NormalizedExperienceAvailability,
  NormalizedExperienceListing,
} from "./experiences.types.js";

export interface ExperienceProvider extends ProviderCapabilities {
  searchAvailability(
    input: ExperienceAvailabilityInput,
  ): Promise<NormalizedExperienceAvailability | null>;
  searchListings(input: ExperienceSearchInput): Promise<NormalizedExperienceListing[]>;
}
