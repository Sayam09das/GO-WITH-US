import type { Prisma, UserActivityType } from "@prisma/client";
import { prisma } from "./db.js";

export async function logUserActivity(input: {
  userId: string;
  type: UserActivityType;
  title: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.userActivity.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      metadata: input.metadata,
    },
  });
}
