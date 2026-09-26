export const NOTIFICATIONS_PAGE_COPY = {
  eyebrow: "STAY UPDATED",
  heading: "Notifications",
  supporting: "Important updates and reminders for your journeys.",
  markAllRead: "Mark all as read",
  settingsPrompt: "Want to control what you receive?",
  settingsAction: "Manage notification preferences",
  settingsHref: "/account/settings#notifications",
} as const;

export const NOTIFICATIONS_TABS = [
  { id: "all", label: "All" },
  { id: "trips", label: "Trips" },
  { id: "bookings", label: "Bookings" },
  { id: "itineraries", label: "Itineraries" },
  { id: "updates", label: "Updates" },
] as const;

export type NotificationsTabId = (typeof NOTIFICATIONS_TABS)[number]["id"];

export const NOTIFICATIONS_EMPTY_COPY = {
  title: "You're all caught up.",
  description: "New updates about your journeys will appear here.",
} as const;

export const NOTIFICATIONS_SECTION_LABELS = {
  unread: "Unread",
  today: "Today",
  yesterday: "Yesterday",
  earlier: "Earlier",
} as const;

/** Poll interval while the notifications page is open (ms). */
export const NOTIFICATIONS_POLL_INTERVAL_MS = 15_000;

/** Poll interval for header unread badge (ms). */
export const NOTIFICATIONS_BADGE_POLL_INTERVAL_MS = 30_000;

export const NOTIFICATIONS_UPDATED_EVENT = "gowithus:notifications-updated";
