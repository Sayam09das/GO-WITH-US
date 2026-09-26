import type { NotificationSummary } from "@gowithus/types";
import type { LucideIcon } from "lucide-react";
import { Bell, CalendarClock, Compass, FileText, MapPinned, Plane, Sparkles } from "lucide-react";
import type { NotificationsTabId } from "@/lib/account/notifications/notifications-copy";

export function filterNotificationsByTab(
  items: NotificationSummary[],
  tab: NotificationsTabId,
): NotificationSummary[] {
  if (tab === "all") {
    return items;
  }

  return items.filter((item) => item.filterCategory === tab);
}

export function countNotificationsByTab(
  items: NotificationSummary[],
): Record<NotificationsTabId, number> {
  return {
    all: items.length,
    trips: items.filter((item) => item.filterCategory === "trips").length,
    bookings: items.filter((item) => item.filterCategory === "bookings").length,
    itineraries: items.filter((item) => item.filterCategory === "itineraries").length,
    updates: items.filter((item) => item.filterCategory === "updates").length,
  };
}

export function notificationIcon(item: NotificationSummary): LucideIcon {
  if (item.filterCategory === "bookings") {
    return CalendarClock;
  }

  if (item.filterCategory === "itineraries") {
    return MapPinned;
  }

  if (item.filterCategory === "trips") {
    return Plane;
  }

  if (/experience/.test(item.title.toLowerCase())) {
    return Sparkles;
  }

  if (/story|editorial/.test(item.title.toLowerCase())) {
    return FileText;
  }

  if (/destination/.test(item.title.toLowerCase())) {
    return Compass;
  }

  return Bell;
}

export type NotificationTimelineSection = {
  id: string;
  label: string;
  items: NotificationSummary[];
};

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return startOfLocalDay(a).getTime() === startOfLocalDay(b).getTime();
}

export function buildNotificationTimeline(
  items: NotificationSummary[],
): NotificationTimelineSection[] {
  const unread = items.filter((item) => !item.isRead);
  const read = items.filter((item) => item.isRead);

  const sections: NotificationTimelineSection[] = [];

  if (unread.length > 0) {
    sections.push({ id: "unread", label: "Unread", items: unread });
  }

  const now = new Date();
  const todayStart = startOfLocalDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const todayRead: NotificationSummary[] = [];
  const yesterdayRead: NotificationSummary[] = [];
  const earlierRead: NotificationSummary[] = [];

  for (const item of read) {
    const created = new Date(item.createdAt);
    if (isSameLocalDay(created, now)) {
      todayRead.push(item);
      continue;
    }

    if (isSameLocalDay(created, yesterdayStart)) {
      yesterdayRead.push(item);
      continue;
    }

    earlierRead.push(item);
  }

  if (todayRead.length > 0) {
    sections.push({ id: "today", label: "Today", items: todayRead });
  }

  if (yesterdayRead.length > 0) {
    sections.push({ id: "yesterday", label: "Yesterday", items: yesterdayRead });
  }

  if (earlierRead.length > 0) {
    sections.push({ id: "earlier", label: "Earlier", items: earlierRead });
  }

  return sections;
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

export function formatNotificationTime(isoDate: string, now = Date.now()): string {
  const created = new Date(isoDate).getTime();
  const diffSeconds = Math.round((created - now) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 60) {
    return relativeTimeFormatter.format(diffSeconds, "second");
  }

  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) {
    return relativeTimeFormatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return relativeTimeFormatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) === 1) {
    return "Yesterday";
  }

  if (Math.abs(diffDays) < 7) {
    return relativeTimeFormatter.format(diffDays, "day");
  }

  return new Date(isoDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}
