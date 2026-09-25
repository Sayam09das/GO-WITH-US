import { providersConfig } from "../../../config/providers.js";
import { providerHttpRequest } from "../../lib/provider-http.client.js";

type FoursquarePlaceLocation = {
  formatted_address?: string;
  address?: string;
  locality?: string;
  region?: string;
  country?: string;
  postcode?: string;
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
  private readonly config = providersConfig.places.foursquare;

  isConfigured(): boolean {
    return this.config.apiKey.length > 0;
  }

  async searchPlaces(params: {
    query: string;
    limit: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }): Promise<FoursquareSearchResponse> {
    const url = new URL(`${this.config.baseUrl.replace(/\/$/, "")}/places/search`);
    url.searchParams.set("query", params.query);
    url.searchParams.set("limit", String(params.limit));

    if (params.latitude != null && params.longitude != null) {
      url.searchParams.set("ll", `${params.latitude},${params.longitude}`);
    }

    if (params.radius != null) {
      url.searchParams.set("radius", String(params.radius));
    }

    return providerHttpRequest<FoursquareSearchResponse>({
      url,
      headers: {
        Accept: "application/json",
        Authorization: this.config.apiKey,
      },
      timeoutMs: this.config.timeoutMs,
      provider: "foursquare",
      operation: "searchPlaces",
    });
  }

  async getPlace(sourceId: string): Promise<FoursquarePlaceResponse | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      return await providerHttpRequest<FoursquarePlaceResponse>({
        url: new URL(
          `${this.config.baseUrl.replace(/\/$/, "")}/places/${encodeURIComponent(sourceId)}`,
        ),
        headers: {
          Accept: "application/json",
          Authorization: this.config.apiKey,
        },
        timeoutMs: this.config.timeoutMs,
        provider: "foursquare",
        operation: "getPlace",
        retryable: false,
      });
    } catch {
      return null;
    }
  }

  async reverseGeocode(params: {
    latitude: number;
    longitude: number;
  }): Promise<FoursquarePlaceRecord | null> {
    const response = await this.searchPlaces({
      query: "place",
      limit: 1,
      latitude: params.latitude,
      longitude: params.longitude,
      radius: 250,
    });

    return response.results?.[0] ?? null;
  }
}

export type { FoursquarePlaceRecord };
