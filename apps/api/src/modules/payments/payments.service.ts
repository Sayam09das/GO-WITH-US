import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../../config/env.js";
import { logger } from "../../infrastructure/logging/logger.js";
import { prisma } from "../../lib/db.js";
import { AppError } from "../../lib/errors.js";
import type { PaymentWebhookInput } from "./payments.schemas.js";

export type PaymentIntentResult = {
  paymentId: string;
  provider: "manual";
  clientSecret: null;
  amount: number;
};

function verifyWebhookSignature(payload: string, signatureHeader: string | undefined): void {
  const secret = env.paymentWebhookSecret;

  if (!secret) {
    if (env.isProduction) {
      throw new AppError(500, "INTERNAL_ERROR", "Payment webhook secret is not configured.");
    }

    return;
  }

  if (!signatureHeader?.trim()) {
    throw new AppError(401, "UNAUTHENTICATED", "Missing webhook signature.");
  }

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const provided = signatureHeader.replace(/^sha256=/, "").trim();

  const expectedBuffer = Buffer.from(expected, "utf8");
  const providedBuffer = Buffer.from(provided, "utf8");

  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    throw new AppError(401, "UNAUTHENTICATED", "Invalid webhook signature.");
  }
}

function readProcessedEventIds(metadata: unknown): string[] {
  if (typeof metadata !== "object" || metadata == null || Array.isArray(metadata)) {
    return [];
  }

  const events = (metadata as Record<string, unknown>).processedEvents;
  return Array.isArray(events)
    ? events.filter((value): value is string => typeof value === "string")
    : [];
}

export const paymentsService = {
  async createPaymentIntent(userId: string, bookingId: string): Promise<PaymentIntentResult> {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });

    if (!booking) {
      throw new AppError(404, "NOT_FOUND", "Booking not found.");
    }

    if (booking.status === "cancelled" || booking.status === "expired") {
      throw new AppError(409, "CONFLICT", "This booking is no longer payable.");
    }

    const existingPending = await prisma.payment.findFirst({
      where: {
        bookingId: booking.id,
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingPending) {
      return {
        paymentId: existingPending.id,
        provider: "manual",
        clientSecret: null,
        amount: existingPending.amount,
      };
    }

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "manual",
        amount: booking.totalAmount,
        currency: booking.currency,
        status: "pending",
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: "pending" },
    });

    return {
      paymentId: payment.id,
      provider: "manual",
      clientSecret: null,
      amount: payment.amount,
    };
  },

  async processWebhook(
    payload: string,
    signatureHeader: string | undefined,
    event: PaymentWebhookInput,
  ) {
    verifyWebhookSignature(payload, signatureHeader);

    if (event.type !== "payment.succeeded") {
      return { processed: false, reason: "ignored_event_type" as const };
    }

    const payment = await prisma.payment.findUnique({
      where: { id: event.data.paymentId },
      include: { booking: true },
    });

    if (!payment) {
      throw new AppError(404, "NOT_FOUND", "Payment not found.");
    }

    if (event.data.bookingId && event.data.bookingId !== payment.bookingId) {
      throw new AppError(400, "VALIDATION_ERROR", "Payment booking mismatch.");
    }

    const processedEvents = readProcessedEventIds(payment.metadata);
    if (processedEvents.includes(event.id)) {
      return { processed: true, duplicate: true as const };
    }

    if (payment.status === "paid") {
      return { processed: true, duplicate: true as const };
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "paid",
          paidAt: new Date(),
          metadata: {
            ...(typeof payment.metadata === "object" &&
            payment.metadata != null &&
            !Array.isArray(payment.metadata)
              ? payment.metadata
              : {}),
            processedEvents: [...processedEvents, event.id],
          },
        },
      });

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: "paid",
          status: "confirmed",
        },
      });
    });

    logger.info("payment.webhook_processed", {
      paymentId: payment.id,
      bookingId: payment.bookingId,
      eventId: event.id,
      duplicate: false,
    });

    return { processed: true, duplicate: false as const };
  },
};
