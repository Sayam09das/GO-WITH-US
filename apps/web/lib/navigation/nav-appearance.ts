import type { NavbarOverlayTone, NavbarVisualState } from "./variants";

/** True when nav text should be light (over a dark hero image). */
export function isDarkOverlay(
  visualState: NavbarVisualState,
  overlayTone: NavbarOverlayTone,
): boolean {
  return visualState === "transparent" && overlayTone === "dark";
}

export function navLinkTextClass(
  visualState: NavbarVisualState,
  overlayTone: NavbarOverlayTone,
  isActive: boolean,
): string {
  if (isDarkOverlay(visualState, overlayTone)) {
    return isActive
      ? "font-medium text-primary-foreground"
      : "text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground";
  }

  return isActive
    ? "font-medium text-foreground"
    : "text-foreground/70 hover:bg-secondary/70 hover:text-primary";
}

export function navIndicatorClass(
  visualState: NavbarVisualState,
  overlayTone: NavbarOverlayTone,
): string {
  return isDarkOverlay(visualState, overlayTone) ? "bg-primary-foreground" : "bg-primary";
}

export function brandWordmarkClass(
  visualState: NavbarVisualState,
  overlayTone: NavbarOverlayTone,
): string {
  if (isDarkOverlay(visualState, overlayTone)) {
    return "text-primary-foreground group-hover:text-primary-foreground";
  }

  return "text-heading group-hover:text-primary";
}

export function navIconClass(
  visualState: NavbarVisualState,
  overlayTone: NavbarOverlayTone,
  isActive: boolean,
): string {
  if (isDarkOverlay(visualState, overlayTone)) {
    return isActive
      ? "bg-primary-foreground/15 text-primary-foreground"
      : "text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground";
  }

  return isActive
    ? "bg-secondary text-primary"
    : "text-foreground/70 hover:bg-secondary hover:text-primary";
}

export function accountNavClass(
  visualState: NavbarVisualState,
  overlayTone: NavbarOverlayTone,
  isActive: boolean,
): string {
  const active = isActive ? "font-medium" : "";

  return cnMerge(
    active,
    isDarkOverlay(visualState, overlayTone)
      ? "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
      : "text-foreground/70 hover:bg-secondary hover:text-primary",
  );
}

function cnMerge(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
