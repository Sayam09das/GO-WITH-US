import { env } from "../../../config/env.js";
import { logger } from "../../../infrastructure/logging/logger.js";

const DEFAULT_TIMEOUT_MS = 10_000;

type BookingSearchResponse = {
  result?: Array<{
    id: string | number;
    name?: string;
    city?: string;
    country?: string;
    min_total_price?: number;
    price?: number;
    max_persons?: number;
  }>;
};

export class BookingClient {
  isConfigured(): boolean {
    return env.bookingApiKey.length > 0;
  }

  async searchHotels(params: {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    limit: number;
  }): Promise<BookingSearchResponse> {
    if (!this.isConfigured()) {
      return { result: [] };
    }

    const url = new URL(`${env.bookingApiUrl.replace(/\/$/, "")}/hotels/search`);
    url.searchParams.set("dest_id", params.destination);
    url.searchParams.set("checkin", params.checkIn);
    url.searchParams.set("checkout", params.checkOut);
    url.searchParams.set("adults", String(params.adults));
    url.searchParams.set("children", String(params.children));
    url.searchParams.set("limit", String(params.limit));

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${env.bookingApiKey}`,
        },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`Booking.com request failed with status ${response.status}.`);
      }

      return (await response.json()) as BookingSearchResponse;
    } catch (error) {
      logger.warn("provider.booking.request_failed", {
        message: error instanceof Error ? error.message : "Unknown Booking.com error",
      });
      return { result: [] };
    }
  }
}
