import type { TravelDocumentCategory } from "../../generated/client.js";
import { prisma } from "../../lib/db.js";

export const documentsRepository = {
  listByUser(userId: string) {
    return prisma.userTravelDocument.findMany({
      where: { userId },
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            destination: { select: { title: true, country: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findOwned(userId: string, documentId: string) {
    return prisma.userTravelDocument.findFirst({
      where: { id: documentId, userId },
    });
  },

  create(input: {
    userId: string;
    tripId?: string | null;
    name: string;
    category: TravelDocumentCategory;
    storagePath: string;
    publicUrl: string;
    mimeType: string;
    sizeBytes: number;
  }) {
    return prisma.userTravelDocument.create({ data: input });
  },

  delete(userId: string, documentId: string) {
    return prisma.userTravelDocument.deleteMany({
      where: { id: documentId, userId },
    });
  },
};
