/** Shared UX copy for global states — see docs/CONTENT_GUIDELINES.md */

export const GLOBAL_ERROR_COPY = {
  title: "Something went wrong",
  description: "We couldn't load this part of GO WITH US. Check your connection and try again.",
  retryLabel: "Try again",
  homeLabel: "Go home",
} as const;

export const GLOBAL_FATAL_ERROR_COPY = {
  title: "GO WITH US hit a snag",
  description:
    "The application couldn't render this view. You can try again or return to the homepage.",
  retryLabel: "Try again",
  homeLabel: "Go home",
} as const;

export const NOT_FOUND_COPY = {
  title: "This place isn't on our map",
  description: "The page you're looking for may have moved, or it isn't part of GO WITH US yet.",
  primaryLabel: "Explore destinations",
  secondaryLabel: "Go home",
} as const;

export const LOADING_COPY = {
  default: "Loading…",
  catalog: "Loading places…",
} as const;
