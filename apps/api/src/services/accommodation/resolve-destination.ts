import { prisma } from "../../lib/db.js";

export async function resolveAccommodationDestinationId(
  destination: string,
): Promise<string | null> {
  const trimmed = destination.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  const linkedDestination = await prisma.destination.findFirst({
    where: {
      OR: [
        { slug: { equals: trimmed, mode: "insensitive" } },
        { title: { equals: trimmed, mode: "insensitive" } },
      ],
      providerPlaceId: { not: null },
    },
    select: {
      providerPlaceId: true,
      provider: true,
    },
  });

  if (linkedDestination?.providerPlaceId) {
    return linkedDestination.providerPlaceId;
  }

  return null;
}
