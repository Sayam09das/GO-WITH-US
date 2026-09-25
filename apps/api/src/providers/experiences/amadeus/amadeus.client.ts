import { providersConfig } from "../../../config/providers.js";
import { providerHttpRequest } from "../../lib/provider-http.client.js";

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

type AmadeusTokenResponse = {
  access_token?: string;
};

export class AmadeusClient {
  private readonly config = providersConfig.experiences.amadeus;

  isConfigured(): boolean {
    return this.config.clientId.length > 0 && this.config.clientSecret.length > 0;
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

    const url = new URL(`${this.config.baseUrl.replace(/\/$/, "")}/v1/shopping/activities`);
    url.searchParams.set("latitude", String(params.latitude));
    url.searchParams.set("longitude", String(params.longitude));
    url.searchParams.set("radius", String(params.radiusKm ?? 20));

    return providerHttpRequest<AmadeusActivitiesResponse>({
      url,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeoutMs: this.config.timeoutMs,
      provider: "amadeus",
      operation: "searchActivities",
    });
  }

  private async fetchAccessToken(): Promise<string | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      });

      const response = await providerHttpRequest<AmadeusTokenResponse>({
        url: new URL(`${this.config.baseUrl.replace(/\/$/, "")}/v1/security/oauth2/token`),
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
        timeoutMs: this.config.timeoutMs,
        provider: "amadeus",
        operation: "fetchAccessToken",
        retryable: false,
      });

      return response.access_token ?? null;
    } catch {
      return null;
    }
  }
}
