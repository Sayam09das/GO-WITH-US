import type { TravelDocumentCategory } from "../../generated/client.js";
import { AppError } from "../../lib/errors.js";
import { deleteUserFile, storageEnv, uploadUserFile } from "../../lib/supabase-storage.js";
import { assertDocumentMime, formatFileSize } from "../../lib/upload.js";
import { documentsRepository } from "./documents.repository.js";

export type TravelDocumentListItem = {
  id: string;
  name: string;
  category: TravelDocumentCategory;
  tripId: string | null;
  tripLabel: string | null;
  dateLabel: string;
  mimeType: string;
  fileType: string;
  fileSizeLabel: string;
  sizeBytes: number;
  publicUrl: string;
  createdAt: string;
};

function formatTripLabel(trip: {
  title: string;
  destination: { title: string; country: string } | null;
}): string {
  if (trip.destination) {
    return `${trip.destination.title}, ${trip.destination.country}`;
  }
  return trip.title;
}

function formatDocumentDate(value: Date): string {
  return value.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mimeToFileType(mimeType: string): string {
  if (mimeType === "application/pdf") {
    return "PDF";
  }
  if (mimeType === "image/png") {
    return "PNG";
  }
  if (mimeType === "image/webp") {
    return "WebP";
  }
  return "JPG";
}

function toListItem(
  document: Awaited<ReturnType<typeof documentsRepository.listByUser>>[number],
): TravelDocumentListItem {
  return {
    id: document.id,
    name: document.name,
    category: document.category,
    tripId: document.tripId,
    tripLabel: document.trip ? formatTripLabel(document.trip) : null,
    dateLabel: formatDocumentDate(document.createdAt),
    mimeType: document.mimeType,
    fileType: mimeToFileType(document.mimeType),
    fileSizeLabel: formatFileSize(document.sizeBytes),
    sizeBytes: document.sizeBytes,
    publicUrl: document.publicUrl,
    createdAt: document.createdAt.toISOString(),
  };
}

export const documentsService = {
  async listDocuments(userId: string): Promise<TravelDocumentListItem[]> {
    const documents = await documentsRepository.listByUser(userId);
    return documents.map(toListItem);
  },

  async uploadDocument(
    userId: string,
    input: {
      file: Express.Multer.File;
      name?: string;
      category?: TravelDocumentCategory;
      tripId?: string | null;
    },
  ): Promise<TravelDocumentListItem> {
    assertDocumentMime(input.file.mimetype);

    const upload = await uploadUserFile({
      bucket: storageEnv.supabaseDocumentsBucket,
      userId,
      fileName: input.file.originalname,
      mimeType: input.file.mimetype,
      buffer: input.file.buffer,
    });

    const document = await documentsRepository.create({
      userId,
      tripId: input.tripId ?? null,
      name: input.name?.trim() || input.file.originalname,
      category: input.category ?? "other",
      storagePath: upload.storagePath,
      publicUrl: upload.publicUrl,
      mimeType: input.file.mimetype,
      sizeBytes: input.file.size,
    });

    const listed = await documentsRepository.listByUser(userId);
    const created = listed.find((item) => item.id === document.id);
    if (!created) {
      throw new AppError(500, "INTERNAL_ERROR", "Document saved but could not be loaded.");
    }

    return toListItem(created);
  },

  async deleteDocument(userId: string, documentId: string): Promise<void> {
    const document = await documentsRepository.findOwned(userId, documentId);
    if (!document) {
      throw new AppError(404, "NOT_FOUND", "Document not found.");
    }

    await deleteUserFile({
      bucket: storageEnv.supabaseDocumentsBucket,
      storagePath: document.storagePath,
    }).catch(() => undefined);

    await documentsRepository.delete(userId, documentId);
  },
};
