import { TRANSPARENT_NAVBAR_ROUTES } from "./config";

export type NavbarVariant = "transparent" | "default";

export type NavbarVisualState = "transparent" | "default" | "scrolled";

/** `dark` = light nav text over a dark hero. `light` = dark text over a light/empty hero. */
export type NavbarOverlayTone = "light" | "dark";

export function resolveNavbarVariant(pathname: string): NavbarVariant {
  return TRANSPARENT_NAVBAR_ROUTES.includes(pathname as (typeof TRANSPARENT_NAVBAR_ROUTES)[number])
    ? "transparent"
    : "default";
}

export function resolveNavbarVisualState(
  variant: NavbarVariant,
  isScrolled: boolean,
): NavbarVisualState {
  if (variant === "transparent" && !isScrolled) {
    return "transparent";
  }

  if (variant === "transparent" && isScrolled) {
    return "scrolled";
  }

  if (isScrolled) {
    return "scrolled";
  }

  return "default";
}
