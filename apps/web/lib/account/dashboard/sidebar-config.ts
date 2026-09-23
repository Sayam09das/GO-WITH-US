import type { LucideIcon } from "lucide-react";
import { Bookmark, Compass, Home, Luggage, User } from "lucide-react";

export interface DashboardSidebarNavItem {
  label: string;
  href: string;
  match: string;
}

export interface DashboardSidebarNavGroup {
  label: string;
  items: DashboardSidebarNavItem[];
}

export interface DashboardMobileTabItem {
  label: string;
  href: string;
  match: string;
  icon: LucideIcon;
}

export const DASHBOARD_SIDEBAR_WIDTH_CLASS = "w-[15.625rem]";
export const DASHBOARD_SIDEBAR_OFFSET_CLASS = "lg:pl-[15.625rem]";

export const DASHBOARD_SIDEBAR_GROUPS: DashboardSidebarNavGroup[] = [
  {
    label: "EXPLORE",
    items: [
      { label: "Overview", href: "/account", match: "/account" },
      { label: "Discover", href: "/account/discover", match: "/account/discover" },
      { label: "My Trips", href: "/trips", match: "/trips" },
      { label: "Bookings", href: "/account/bookings", match: "/account/bookings" },
      { label: "Saved", href: "/saved", match: "/saved" },
    ],
  },
  {
    label: "YOUR JOURNEY",
    items: [
      { label: "Itineraries", href: "/account/itineraries", match: "/account/itineraries" },
      { label: "Travel Documents", href: "/account/documents", match: "/account/documents" },
      { label: "Recently Viewed", href: "/account/recent", match: "/account/recent" },
    ],
  },
  {
    label: "PERSONAL",
    items: [
      { label: "Notifications", href: "/account/notifications", match: "/account/notifications" },
      { label: "Profile", href: "/account/profile", match: "/account/profile" },
      { label: "Settings", href: "/account/settings", match: "/account/settings" },
    ],
  },
];

export const DASHBOARD_SIDEBAR_HELP = {
  label: "Help & Support",
  href: "/account/help",
  match: "/account/help",
} as const;

export const DASHBOARD_SIDEBAR_USER_COPY = {
  accountType: "Personal account",
  menuLabel: "Account menu",
} as const;

export const DASHBOARD_SIDEBAR_USER_LINKS = [
  { label: "Profile", href: "/account/profile" },
  { label: "Account settings", href: "/account/settings" },
  { label: "Log out", href: "/sign-in" },
] as const;

export const DASHBOARD_MOBILE_TAB_ITEMS: DashboardMobileTabItem[] = [
  { label: "Home", href: "/account", match: "/account", icon: Home },
  { label: "Trips", href: "/trips", match: "/trips", icon: Luggage },
  { label: "Saved", href: "/saved", match: "/saved", icon: Bookmark },
  { label: "Explore", href: "/account/discover", match: "/account/discover", icon: Compass },
  { label: "Profile", href: "/account/profile", match: "/account/profile", icon: User },
];
