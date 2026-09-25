export type PlacesProviderName = "none" | "foursquare" | "google";
export type AccommodationProviderName = "none" | "booking";
export type ExperienceProviderName = "none" | "amadeus";

export type ProvidersConfig = {
  places: {
    provider: PlacesProviderName;
    foursquare: {
      apiKey: string;
      baseUrl: string;
      timeoutMs: number;
    };
  };
  accommodation: {
    provider: AccommodationProviderName;
    booking: {
      apiKey: string;
      baseUrl: string;
      timeoutMs: number;
    };
  };
  experiences: {
    provider: ExperienceProviderName;
    amadeus: {
      clientId: string;
      clientSecret: string;
      baseUrl: string;
      timeoutMs: number;
    };
  };
  http: {
    defaultTimeoutMs: number;
    maxRetries: number;
  };
};

function readEnv(primary: string, legacyKeys: string[] = []): string | undefined {
  const value = process.env[primary]?.trim();
  if (value) {
    return value;
  }

  for (const legacyKey of legacyKeys) {
    const legacyValue = process.env[legacyKey]?.trim();
    if (legacyValue) {
      return legacyValue;
    }
  }

  return undefined;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? fallback);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`Invalid integer value: ${value ?? fallback}`);
  }

  return parsed;
}

function normalizeProviderName<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  const normalized = (value ?? fallback).trim().toLowerCase() as T;
  return allowed.includes(normalized) ? normalized : fallback;
}

function requireWhen(condition: boolean, message: string): void {
  if (condition) {
    throw new Error(message);
  }
}

export function loadProvidersConfig(): ProvidersConfig {
  const defaultTimeoutMs = parsePositiveInt(readEnv("PROVIDER_HTTP_TIMEOUT_MS"), 8_000);
  const maxRetries = parsePositiveInt(readEnv("PROVIDER_HTTP_MAX_RETRIES"), 1);

  const placesProvider = normalizeProviderName(
    readEnv("PLACES_PROVIDER", ["PROVIDER_PLACES"]),
    ["none", "foursquare", "google"] as const,
    "none",
  );

  const accommodationProvider = normalizeProviderName(
    readEnv("ACCOMMODATION_PROVIDER", ["PROVIDER_ACCOMMODATION"]),
    ["none", "booking"] as const,
    "none",
  );

  const experienceProvider = normalizeProviderName(
    readEnv("EXPERIENCE_PROVIDER", ["PROVIDER_EXPERIENCES"]),
    ["none", "amadeus"] as const,
    "none",
  );

  const foursquareApiKey = readEnv("FOURSQUARE_API_KEY") ?? "";
  const bookingApiKey = readEnv("BOOKING_API_KEY") ?? "";
  const amadeusClientId = readEnv("AMADEUS_CLIENT_ID", ["AMADEUS_API_KEY"]) ?? "";
  const amadeusClientSecret = readEnv("AMADEUS_CLIENT_SECRET", ["AMADEUS_API_SECRET"]) ?? "";

  return {
    places: {
      provider: placesProvider,
      foursquare: {
        apiKey: foursquareApiKey,
        baseUrl: readEnv("FOURSQUARE_API_URL") ?? "https://api.foursquare.com/v3",
        timeoutMs: defaultTimeoutMs,
      },
    },
    accommodation: {
      provider: accommodationProvider,
      booking: {
        apiKey: bookingApiKey,
        baseUrl: readEnv("BOOKING_API_URL") ?? "https://booking-com.p.rapidapi.com",
        timeoutMs: defaultTimeoutMs,
      },
    },
    experiences: {
      provider: experienceProvider,
      amadeus: {
        clientId: amadeusClientId,
        clientSecret: amadeusClientSecret,
        baseUrl: readEnv("AMADEUS_API_URL") ?? "https://test.api.amadeus.com",
        timeoutMs: defaultTimeoutMs,
      },
    },
    http: {
      defaultTimeoutMs,
      maxRetries,
    },
  };
}

export function validateProvidersConfig(config: ProvidersConfig): void {
  requireWhen(
    config.places.provider === "foursquare" && config.places.foursquare.apiKey.length === 0,
    "Missing environment variable: FOURSQUARE_API_KEY (required when PLACES_PROVIDER=foursquare)",
  );

  requireWhen(
    config.places.provider === "google",
    "PLACES_PROVIDER=google is not implemented yet. Use foursquare or none.",
  );

  requireWhen(
    config.accommodation.provider === "booking" && config.accommodation.booking.apiKey.length === 0,
    "Missing environment variable: BOOKING_API_KEY (required when ACCOMMODATION_PROVIDER=booking)",
  );

  requireWhen(
    config.experiences.provider === "amadeus" &&
      (config.experiences.amadeus.clientId.length === 0 ||
        config.experiences.amadeus.clientSecret.length === 0),
    "Missing environment variables: AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET (required when EXPERIENCE_PROVIDER=amadeus)",
  );
}

export const providersConfig = loadProvidersConfig();

validateProvidersConfig(providersConfig);
