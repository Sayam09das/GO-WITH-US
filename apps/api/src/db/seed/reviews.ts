import type { ItemType, PrismaClient } from "@prisma/client";
import type { CatalogIds } from "./helpers.js";

const REVIEW_BODIES = [
  "Exactly the kind of place we hoped to find — calm, welcoming, and easy to return to.",
  "Great pacing and thoughtful details. Would happily recommend to friends planning a similar trip.",
  "Memorable without feeling over-produced. We left with a short list of places to revisit.",
  "Staff were warm, directions were clear, and the setting matched the photos in the best way.",
  "A highlight of our week. Small touches made it feel personal rather than packaged.",
  "Well located for exploring on foot. Mornings here were especially peaceful.",
  "Food, views, and service all felt aligned with the destination's character.",
  "We appreciated how unhurried everything felt — no pressure to rush through the experience.",
  "Clean, comfortable, and genuinely local in spirit. Already planning a return visit.",
  "Guide was knowledgeable and friendly. Learned details we would have missed on our own.",
];

type ReviewTarget = {
  itemType: ItemType;
  itemId: string;
};

function buildTargets(ids: CatalogIds): ReviewTarget[] {
  const targets: ReviewTarget[] = [];

  for (const id of ids.destinations.values()) {
    targets.push({ itemType: "destination", itemId: id });
  }
  for (const id of ids.stays.values()) {
    targets.push({ itemType: "stay", itemId: id });
  }
  for (const id of ids.experiences.values()) {
    targets.push({ itemType: "experience", itemId: id });
  }
  for (const id of ids.restaurants.values()) {
    targets.push({ itemType: "restaurant", itemId: id });
  }
  for (const id of ids.places.values()) {
    targets.push({ itemType: "place", itemId: id });
  }

  return targets;
}

export async function seedReviews(prisma: PrismaClient, ids: CatalogIds): Promise<void> {
  const userIds = [...ids.users.values()];
  const targets = buildTargets(ids);

  if (userIds.length === 0 || targets.length === 0) {
    return;
  }

  let created = 0;
  let userIndex = 0;

  for (let targetIndex = 0; targetIndex < targets.length && created < 150; targetIndex += 1) {
    const target = targets[targetIndex];
    if (!target) {
      continue;
    }

    const userId = userIds[userIndex % userIds.length];
    if (!userId) {
      continue;
    }
    userIndex += 1;

    const rating = 3 + ((targetIndex + userIndex) % 3);
    const body =
      REVIEW_BODIES[(targetIndex + userIndex) % REVIEW_BODIES.length] ?? REVIEW_BODIES[0];

    await prisma.review.upsert({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType: target.itemType,
          itemId: target.itemId,
        },
      },
      update: {
        rating,
        title: rating >= 4 ? "Worth the trip" : "Solid experience",
        body,
        status: "published",
      },
      create: {
        userId,
        itemType: target.itemType,
        itemId: target.itemId,
        rating,
        title: rating >= 4 ? "Worth the trip" : "Solid experience",
        body,
        status: "published",
      },
    });

    created += 1;
  }

  await refreshReviewAggregates(prisma, ids);
}

async function refreshReviewAggregates(prisma: PrismaClient, ids: CatalogIds): Promise<void> {
  async function refreshTable(
    itemType: ItemType,
    table: "destination" | "stay" | "experience" | "restaurant" | "place",
    idMap: Map<string, string>,
  ) {
    for (const itemId of idMap.values()) {
      const aggregate = await prisma.review.aggregate({
        where: { itemType, itemId, status: "published" },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const data = {
        ratingAvg: aggregate._avg.rating,
        reviewCount: aggregate._count.rating,
      };

      switch (table) {
        case "destination":
          await prisma.destination.update({ where: { id: itemId }, data });
          break;
        case "stay":
          await prisma.stay.update({ where: { id: itemId }, data });
          break;
        case "experience":
          await prisma.experience.update({ where: { id: itemId }, data });
          break;
        case "restaurant":
          await prisma.restaurant.update({ where: { id: itemId }, data });
          break;
        case "place":
          await prisma.place.update({ where: { id: itemId }, data });
          break;
      }
    }
  }

  await refreshTable("destination", "destination", ids.destinations);
  await refreshTable("stay", "stay", ids.stays);
  await refreshTable("experience", "experience", ids.experiences);
  await refreshTable("restaurant", "restaurant", ids.restaurants);
  await refreshTable("place", "place", ids.places);
}
