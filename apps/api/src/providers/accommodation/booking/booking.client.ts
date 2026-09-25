import { providersConfig } from "../../../config/providers.js";
import { providerHttpRequest } from "../../lib/provider-http.client.js";

type BookingSearchResponse = {
  result?: Array<{
    id: string | number;
    name?: string;
    city?: string;
    country?: string;
    min_total_price?: number;
    price?: number;
    max_persons?: number;
    review_score?: number;
    main_photo_url?: string;
    hotel_facilities?: string[];
  }>;
};

export class BookingClient {
  private readonly config = providersConfig.accommodation.booking;

  isConfigured(): boolean {
    return this.config.apiKey.length > 0;
  }

  async searchHotels(params: {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
    limit: number;
  }): Promise<BookingSearchResponse> {
    if (!this.isConfigured()) {
      return { result: [] };
    }

    const url = new URL(`${this.config.baseUrl.replace(/\/$/, "")}/hotels/search`);
    url.searchParams.set("dest_id", params.destination);
    url.searchParams.set("checkin", params.checkIn);
    url.searchParams.set("checkout", params.checkOut);
    url.searchParams.set("adults", String(params.adults));
    url.searchParams.set("children", String(params.children));
    url.searchParams.set("room_number", String(params.rooms));
    url.searchParams.set("limit", String(params.limit));

    return providerHttpRequest<BookingSearchResponse>({
      url,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      timeoutMs: this.config.timeoutMs,
      provider: "booking",
      operation: "searchHotels",
    });
  }
}
