import type { NotificationType } from "@prisma/client";
import { prisma } from "../../lib/db.js";

export const notificationsRepository = {
  listByUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, readAt: null },
    });
  },

  findOwned(userId: string, notificationId: string) {
    return prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });
  },

  markRead(userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId, readAt: null },
      data: { readAt: new Date() },
    });
  },

  markAllRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  },

  create(input: {
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    tripId?: string | null;
  }) {
    return prisma.notification.create({ data: input });
  },
};
