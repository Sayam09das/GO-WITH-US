export interface AuthVisualConfig {
  src: string;
  alt: string;
  objectPosition: string;
  quote: string;
}

export const AUTH_VISUALS = {
  signIn: {
    src: "/landingImg/hero/hero-balloon.jpg",
    alt: "Hot air balloons floating over Cappadocia at sunrise",
    objectPosition: "object-center",
    quote:
      "Discover destinations, save what inspires you, and shape day-by-day trips with calm, editorial clarity.",
  },
  signUp: {
    src: "/landingImg/hero/hero-resort.jpg",
    alt: "Overwater resort bungalows along a turquoise lagoon with a mountain backdrop",
    objectPosition: "object-[center_35%]",
    quote: "Create an account to save places, start trips, and return to your plans anytime.",
  },
  forgotPassword: {
    src: "/landingImg/hero/hero-boardwalk.jpg",
    alt: "Traveler walking along a tropical pier toward overwater bungalows",
    objectPosition: "object-[center_20%]",
    quote: "We'll help you get back into your account — calmly, securely, and without the noise.",
  },
  resetPassword: {
    src: "/landingImg/hero/hero-hiker.jpg",
    alt: "Hiker photographing snow-capped mountain peaks from a rocky ridge",
    objectPosition: "object-[65%_center]",
    quote: "Choose a new password and continue planning the journeys that matter to you.",
  },
} as const satisfies Record<string, AuthVisualConfig>;
