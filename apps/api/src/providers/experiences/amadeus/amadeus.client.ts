import { env } from "../../../config/env.js";
import { logger } from "../../../infrastructure/logging/logger.js";

const DEFAULT_TIMEOUT_MS = 10_000;

type AmadeusActivitiesResponse = {
  data?: Array<{
    id: string;
    name: string;
    shortDescription?: string;
    geoCode?: {
      latitude?: number;
      longitude?: number;
    };
    price?: {
      amount?: string;
    };
  }>;
};

export class AmadeusClient {
  isConfigured(): boolean {
    return env.amadeusApiKey.length > 0 && env.amadeusApiSecret.length > 0;
  }

  async searchActivities(params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
  }): Promise<AmadeusActivitiesResponse> {
    if (!this.isConfigured()) {
      return { data: [] };
    }

    const token = await this.fetchAccessToken();
    if (!token) {
      return { data: [] };
    }

    const url = new URL(`${env.amadeusApiUrl.replace(/\/$/, "")}/v1/shopping/activities`);
    url.searchParams.set("latitude", String(params.latitude));
    url.searchParams.set("longitude", String(params.longitude));
    url.searchParams.set("radius", String(params.radiusKm ?? 20));

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`Amadeus request failed with status ${response.status}.`);
      }

      return (await response.json()) as AmadeusActivitiesResponse;
    } catch (error) {
      logger.warn("provider.amadeus.request_failed", {
        message: error instanceof Error ? error.message : "Unknown Amadeus error",
      });
      return { data: [] };
    }
  }

  private async fetchAccessToken(): Promise<string | null> {
    try {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: env.amadeusApiKey,
        client_secret: env.amadeusApiSecret,
      });

      const response = await fetch(
        `${env.amadeusApiUrl.replace(/\/$/, "")}/v1/security/oauth2/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
          signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
        },
      );

      if (!response.ok) {
        throw new Error(`Amadeus auth failed with status ${response.status}.`);
      }

      const payload = (await response.json()) as { access_token?: string };
      return payload.access_token ?? null;
    } catch (error) {
      logger.warn("provider.amadeus.auth_failed", {
        message: error instanceof Error ? error.message : "Unknown Amadeus auth error",
      });
      return null;
    }
  }
}
