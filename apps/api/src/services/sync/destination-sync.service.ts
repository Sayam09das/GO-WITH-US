import { logger } from "../../infrastructure/logging/logger.js";
import { enqueueDestinationSyncJob } from "../../infrastructure/queue/enqueue.js";
import { AppError } from "../../lib/errors.js";
import { providerFactory } from "../../providers/index.js";
import type { NormalizedPlace } from "../../providers/places/places.types.js";
import { destinationSyncRepository } from "./destination-sync.repository.js";

export const destinationSyncService = {
  /**
   * Upsert a GO WITH US destination from a normalized provider place.
   * Provider-owned fields are refreshed; editorial fields are preserved on update.
   */
  async upsertFromPlace(place: NormalizedPlace, options?: { publish?: boolean }) {
    return destinationSyncRepository.upsertFromPlace({
      place,
      publish: options?.publish ?? false,
    });
  },

  /** Fetch live provider details and upsert without overwriting editorial content. */
  async syncDestination(providerPlaceId: string, provider?: string) {
    const placesProvider = providerFactory.getPlacesProvider();

    if (!placesProvider.isConfigured()) {
      throw new AppError(503, "PROVIDER_UNAVAILABLE", "Places provider is not configured.");
    }

    const activeProvider = provider ?? placesProvider.name;
    const place = await placesProvider.getDetails(providerPlaceId);

    if (!place) {
      await destinationSyncRepository.markSyncFailed(activeProvider, providerPlaceId);
      throw new AppError(404, "NOT_FOUND", "Provider place not found.");
    }

    try {
      const destination = await this.upsertFromPlace(place);
      logger.info("destination.sync.completed", {
        destinationId: destination.id,
        provider: activeProvider,
        providerPlaceId,
      });
      return destination;
    } catch (error) {
      await destinationSyncRepository.markSyncFailed(activeProvider, providerPlaceId);
      throw error;
    }
  },

  /** Queue a background sync job for large-scale refresh workflows. */
  async enqueueSync(providerPlaceId: string, provider?: string): Promise<boolean> {
    const placesProvider = providerFactory.getPlacesProvider();
    const activeProvider = provider ?? placesProvider.name;

    return enqueueDestinationSyncJob({
      type: "sync-destination",
      provider: activeProvider,
      providerPlaceId,
    });
  },
};
