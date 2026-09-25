import { env } from "../../../config/env.js";
import { logger } from "../../../infrastructure/logging/logger.js";

const DEFAULT_TIMEOUT_MS = 8_000;

type FoursquarePlaceLocation = {
  formatted_address?: string;
  address?: string;
  lat?: number;
  lng?: number;
};

type FoursquarePlaceRecord = {
  fsq_id: string;
  name: string;
  location?: FoursquarePlaceLocation;
  geocodes?: {
    main?: {
      latitude?: number;
      longitude?: number;
    };
  };
  categories?: Array<{ name?: string }>;
};

type FoursquareSearchResponse = {
  results?: FoursquarePlaceRecord[];
};

type FoursquarePlaceResponse = FoursquarePlaceRecord;

export class FoursquareClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = env.foursquareApiKey;
    this.baseUrl = env.foursquareApiUrl.replace(/\/$/, "");
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  async searchPlaces(params: {
    query: string;
    limit: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<FoursquareSearchResponse> {
    const url = new URL(`${this.baseUrl}/places/search`);
    url.searchParams.set("query", params.query);
    url.searchParams.set("limit", String(params.limit));

    if (params.latitude != null && params.longitude != null) {
      url.searchParams.set("ll", `${params.latitude},${params.longitude}`);
    }

    if (params.radius != null) {
      url.searchParams.set("radius", String(params.radius));
    }

    return this.request<FoursquareSearchResponse>(url);
  }

  async getPlace(sourceId: string): Promise<FoursquarePlaceResponse | null> {
    try {
      return await this.request<FoursquarePlaceResponse>(
        new URL(`${this.baseUrl}/places/${encodeURIComponent(sourceId)}`),
      );
    } catch (error) {
      logger.warn("provider.foursquare.details_failed", {
        sourceId,
        message: error instanceof Error ? error.message : "Unknown Foursquare error",
      });
      return null;
    }
  }

  private async request<T>(url: URL): Promise<T> {
    if (!this.isConfigured()) {
      return {} as T;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: this.apiKey,
      },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Foursquare request failed with status ${response.status}.`);
    }

    return (await response.json()) as T;
  }
}
