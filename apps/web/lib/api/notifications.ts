import type { NotificationListResponse, NotificationSummary } from "@gowithus/types";
import { apiFetch } from "./client";

export async function listNotifications(): Promise<NotificationListResponse> {
  return apiFetch<NotificationListResponse>("/notifications");
}

export async function markNotificationRead(notificationId: string): Promise<NotificationSummary> {
  const response = await apiFetch<{ notification: NotificationSummary }>(
    `/notifications/${notificationId}/read`,
    { method: "POST" },
  );
  return response.notification;
}

export async function markAllNotificationsRead(): Promise<number> {
  const response = await apiFetch<{ unreadCount: number }>("/notifications/read-all", {
    method: "POST",
  });
  return response.unreadCount;
}
