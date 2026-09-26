import type { NotificationJobPayload } from "@gowithus/jobs";
import { AppError } from "../../lib/errors.js";
import { toNotificationListItem } from "./notifications.mapper.js";
import { notificationsRepository } from "./notifications.repository.js";

export const notificationsService = {
  async listForUser(userId: string) {
    const [items, unreadCount] = await Promise.all([
      notificationsRepository.listByUser(userId),
      notificationsRepository.countUnread(userId),
    ]);

    return {
      items: items.map(toNotificationListItem),
      unreadCount,
    };
  },

  async markRead(userId: string, notificationId: string) {
    const existing = await notificationsRepository.findOwned(userId, notificationId);
    if (!existing) {
      throw new AppError(404, "NOT_FOUND", "Notification not found.");
    }

    if (!existing.readAt) {
      await notificationsRepository.markRead(userId, notificationId);
    }

    const refreshed = await notificationsRepository.findOwned(userId, notificationId);
    if (!refreshed) {
      throw new AppError(404, "NOT_FOUND", "Notification not found.");
    }

    return toNotificationListItem(refreshed);
  },

  async markAllRead(userId: string) {
    await notificationsRepository.markAllRead(userId);
    return notificationsRepository.countUnread(userId);
  },

  async createFromJob(input: NotificationJobPayload) {
    await notificationsRepository.create({
      userId: input.userId,
      type: input.notificationType,
      title: input.title,
      body: input.body,
      tripId: input.metadata?.tripId ?? null,
    });
  },
};
