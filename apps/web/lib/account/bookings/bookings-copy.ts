export const BOOKINGS_PAGE_COPY = {
  eyebrow: "YOUR RESERVATIONS",
  heading: "Bookings",
  supporting: "Manage your stays, experiences, and reservations in one place.",
  searchPlaceholder: "Search bookings",
  upcomingLabel: "UPCOMING",
  viewBooking: "View booking",
  bookAgain: "Book again",
  viewDetails: "View details",
  bottomCta: {
    heading: "Ready for your next reservation?",
    supporting: "Browse stays and experiences across GO WITH US.",
    action: "Explore stays",
    href: "/stays",
  },
} as const;

export const BOOKINGS_TABS = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;

export type BookingsTabId = (typeof BOOKINGS_TABS)[number]["id"];

export const BOOKINGS_EMPTY_COPY = {
  all: {
    title: "No bookings yet.",
    description: "Your next stay or experience could start here.",
    action: "Explore stays",
    href: "/stays",
  },
  category: {
    title: "Nothing in this view",
    description: "Try another filter or explore new places to book.",
  },
} as const;
