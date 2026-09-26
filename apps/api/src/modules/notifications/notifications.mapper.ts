import type { Notification } from "../../generated/client.js";

export type NotificationFilterCategory = "trips" | "bookings" | "itineraries" | "updates";

export type NotificationListItem = {
  id: string;
  type: Notification["type"];
  filterCategory: NotificationFilterCategory;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  action: { label: string; href: string } | null;
};

function resolveFilterCategory(
  type: Notification["type"],
  title: string,
  body: string,
): NotificationFilterCategory {
  const text = `${title} ${body}`.toLowerCase();

  if (type === "trip_reminder") {
    return "trips";
  }

  if (type === "itinerary_alert") {
    return "itineraries";
  }

  if (/booking|reservation|payment|confirmed|cancelled|stay has been/.test(text)) {
    return "bookings";
  }

  if (/itinerary|planning|activity added|shared/.test(text)) {
    return "itineraries";
  }

  if (/trip|journey|departure|coming up|starts in/.test(text)) {
    return "trips";
  }

  return "updates";
}

function resolveAction(
  type: Notification["type"],
  tripId: string | null,
  filterCategory: NotificationFilterCategory,
  title: string,
): { label: string; href: string } | null {
  if (
    tripId &&
    (type === "trip_reminder" ||
      type === "itinerary_alert" ||
      filterCategory === "trips" ||
      filterCategory === "itineraries")
  ) {
    return {
      label: type === "itinerary_alert" ? "Open itinerary" : "View trip",
      href: `/account/itineraries/${tripId}`,
    };
  }

  if (filterCategory === "bookings") {
    return { label: "View booking", href: "/account/bookings" };
  }

  if (/story|editorial|journal/.test(title.toLowerCase())) {
    return { label: "Read story", href: "/journal" };
  }

  if (/experience|destination|discover/.test(title.toLowerCase())) {
    return { label: "Explore", href: "/account/discover" };
  }

  return null;
}

export function toNotificationListItem(notification: Notification): NotificationListItem {
  const filterCategory = resolveFilterCategory(
    notification.type,
    notification.title,
    notification.body,
  );

  return {
    id: notification.id,
    type: notification.type,
    filterCategory,
    title: notification.title,
    description: notification.body,
    isRead: notification.readAt !== null,
    createdAt: notification.createdAt.toISOString(),
    action: resolveAction(
      notification.type,
      notification.tripId,
      filterCategory,
      notification.title,
    ),
  };
}
