export const DASHBOARD_HERO_COPY = {
  eyebrow: "YOUR JOURNEY",
  heading: "Where will you go next?",
  supporting:
    "Discover places worth remembering, plan your next escape, and keep every journey in one place.",
  primaryAction: "Explore destinations",
  secondaryAction: "View my trips",
} as const;

export interface DashboardHeroVisualConfig {
  src: string;
  alt: string;
  objectPosition: string;
  locationLabel: string;
  locationTagline: string;
}

export const DASHBOARD_HERO_VISUAL: DashboardHeroVisualConfig = {
  src: "/landingImg/travelimg/travel-5.jpg",
  alt: "Traditional Kyoto street with wooden architecture and soft morning light",
  objectPosition: "object-center",
  locationLabel: "KYOTO, JAPAN",
  locationTagline: "A slower way to travel",
};

export const DASHBOARD_HERO_LINKS = {
  explore: "/account/discover",
  trips: "/trips",
} as const;
