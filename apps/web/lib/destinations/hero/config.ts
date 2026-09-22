export const DESTINATIONS_HERO_COPY = {
  eyebrow: "Destinations",
  headline: "Find somewhere worth going.",
  intro:
    "Discover cities, coastlines, mountains, and quieter places worth building a journey around.",
} as const;

export interface DestinationsHeroImageConfig {
  src: string;
  alt: string;
  objectPosition: string;
  destinationName: string;
  destinationCountry: string;
}

/** Hero image matches the destination label — Cappadocia, Turkey. */
export const DESTINATIONS_HERO_IMAGE: DestinationsHeroImageConfig = {
  src: "/landingImg/about/about-cappadocia.jpg",
  alt: "Hot air balloons floating over Cappadocia at sunrise",
  objectPosition: "object-center",
  destinationName: "Cappadocia",
  destinationCountry: "Turkey",
};
