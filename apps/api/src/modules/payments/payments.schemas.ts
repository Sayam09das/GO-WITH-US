import { z } from "zod";

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid(),
});

export const paymentWebhookSchema = z.object({
  id: z.string().trim().min(1).max(255),
  type: z.string().trim().min(1).max(120),
  data: z.object({
    paymentId: z.string().uuid(),
    bookingId: z.string().uuid().optional(),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>;
