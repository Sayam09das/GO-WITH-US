import { z } from "zod";

export const travelDocumentCategorySchema = z.enum([
  "bookings",
  "flights",
  "stays",
  "experiences",
  "invoices",
  "other",
]);

export const uploadTravelDocumentFieldsSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  category: travelDocumentCategorySchema.optional(),
  tripId: z.string().uuid().optional(),
});

export const documentIdParamSchema = z.object({
  documentId: z.string().uuid(),
});
