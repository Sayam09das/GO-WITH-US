import { Bookmark, type LucideIcon, Map as MapIcon, Search } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  /** Route prefix used for active-state matching. */
  match: string;
  icon?: LucideIcon;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: "Destinations", href: "/destinations", match: "/destinations" },
  { label: "Stays", href: "/stays", match: "/stays" },
  { label: "Experiences", href: "/experiences", match: "/experiences" },
];

export const UTILITY_NAV_ITEMS: NavItem[] = [
  { label: "Search", href: "/search", match: "/search", icon: Search },
  { label: "Saved", href: "/saved", match: "/saved", icon: Bookmark },
  { label: "Trips", href: "/trips", match: "/trips", icon: MapIcon },
];

export const ACCOUNT_SIGN_IN_HREF = "/sign-in";
export const ACCOUNT_HREF = "/account";

/** Routes that use transparent navbar overlay (hero-ready). Extend as needed. */
export const TRANSPARENT_NAVBAR_ROUTES = ["/"] as const;
