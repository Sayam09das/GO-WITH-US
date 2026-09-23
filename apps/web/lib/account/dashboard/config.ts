export interface DashboardNavItem {
  label: string;
  href: string;
  match: string;
}

export interface DashboardUser {
  firstName: string;
  fullName: string;
  email: string;
  initials: string;
}

/** Fixture user until auth session is wired. */
export const DASHBOARD_USER: DashboardUser = {
  firstName: "Sayam",
  fullName: "Sayam Das",
  email: "sayam@gowithus.com",
  initials: "S",
};

export const DASHBOARD_HEADER_COPY = {
  eyebrow: "YOUR JOURNEY",
  supporting: "Where will you go next?",
  exploreDestinations: "Explore destinations",
  notificationsLabel: "Notifications",
  profileMenuLabel: "Account menu",
  profileLinks: {
    profile: "My Profile",
    settings: "Settings",
    help: "Help",
    logOut: "Log out",
  },
} as const;

export const DASHBOARD_PROFILE_LINKS = [
  { label: DASHBOARD_HEADER_COPY.profileLinks.profile, href: "/account/profile" },
  { label: DASHBOARD_HEADER_COPY.profileLinks.settings, href: "/account/settings" },
  { label: DASHBOARD_HEADER_COPY.profileLinks.help, href: "/account/help" },
  { label: DASHBOARD_HEADER_COPY.profileLinks.logOut, href: "/sign-in" },
] as const;
