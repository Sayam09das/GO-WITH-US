import type { Prisma, TripStatus } from "../../generated/client.js";
import { prisma } from "../../lib/db.js";

export const usersRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  updateProfile(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  listSavedDestinations(userId: string) {
    return prisma.savedItem.findMany({
      where: { userId, itemType: "destination" },
      orderBy: { createdAt: "desc" },
    });
  },

  listSavedStays(userId: string) {
    return prisma.savedItem.findMany({
      where: { userId, itemType: "stay" },
      orderBy: { createdAt: "desc" },
    });
  },

  listSavedExperiences(userId: string) {
    return prisma.savedItem.findMany({
      where: { userId, itemType: "experience" },
      orderBy: { createdAt: "desc" },
    });
  },

  listSavedRestaurants(userId: string) {
    return prisma.savedItem.findMany({
      where: { userId, itemType: "restaurant" },
      orderBy: { createdAt: "desc" },
    });
  },

  findSavedDestination(userId: string, destinationId: string) {
    return prisma.savedItem.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType: "destination",
          itemId: destinationId,
        },
      },
    });
  },

  findSavedStay(userId: string, stayId: string) {
    return prisma.savedItem.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType: "stay",
          itemId: stayId,
        },
      },
    });
  },

  findSavedExperience(userId: string, experienceId: string) {
    return prisma.savedItem.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType: "experience",
          itemId: experienceId,
        },
      },
    });
  },

  findSavedRestaurant(userId: string, restaurantId: string) {
    return prisma.savedItem.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType: "restaurant",
          itemId: restaurantId,
        },
      },
    });
  },

  createSavedItem(
    userId: string,
    itemType: "destination" | "stay" | "experience" | "restaurant",
    itemId: string,
  ) {
    return prisma.savedItem.create({
      data: { userId, itemType, itemId },
    });
  },

  deleteSavedItem(id: string) {
    return prisma.savedItem.delete({ where: { id } });
  },

  findPublishedDestination(id: string) {
    return prisma.destination.findFirst({
      where: { id, isPublished: true },
    });
  },

  findPublishedStay(id: string) {
    return prisma.stay.findFirst({
      where: { id, isPublished: true },
      include: { destination: true },
    });
  },

  findDestinationsByIds(ids: string[]) {
    return prisma.destination.findMany({
      where: { id: { in: ids }, isPublished: true },
    });
  },

  findStaysByIds(ids: string[]) {
    return prisma.stay.findMany({
      where: { id: { in: ids }, isPublished: true },
      include: { destination: true },
    });
  },

  findPublishedExperience(id: string) {
    return prisma.experience.findFirst({
      where: { id, isPublished: true },
      include: { destination: true },
    });
  },

  findExperiencesByIds(ids: string[]) {
    return prisma.experience.findMany({
      where: { id: { in: ids }, isPublished: true },
      include: { destination: true },
    });
  },

  findPublishedRestaurant(id: string) {
    return prisma.restaurant.findFirst({
      where: { id, isPublished: true },
      include: { destination: true },
    });
  },

  findRestaurantsByIds(ids: string[]) {
    return prisma.restaurant.findMany({
      where: { id: { in: ids }, isPublished: true },
      include: { destination: true },
    });
  },

  listTrips(userId: string, status?: TripStatus) {
    return prisma.trip.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      include: { destination: true },
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
    });
  },

  listActivities(userId: string, limit = 20) {
    return prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
};
