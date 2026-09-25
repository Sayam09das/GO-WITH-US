import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import {
  bookingIdParamSchema,
  cancelBookingSchema,
  createBookingSchema,
  listBookingsQuerySchema,
} from "./bookings.schemas.js";
import { bookingsService } from "./bookings.service.js";

function readIdempotencyKey(req: Request): string | undefined {
  const value = req.header("Idempotency-Key") ?? req.header("idempotency-key");
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 255) : undefined;
}

export const bookingsController = {
  async createBooking(req: Request, res: Response) {
    try {
      const body = createBookingSchema.parse(req.body);
      const result = await bookingsService.createBooking(
        getAuthUserId(req),
        body,
        readIdempotencyKey(req),
      );
      sendData(res, result.created ? 201 : 200, { booking: result.booking });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listBookings(req: Request, res: Response) {
    try {
      const query = listBookingsQuerySchema.parse(req.query);
      const items = await bookingsService.listBookings(getAuthUserId(req), query.status);
      sendData(res, 200, { items });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getBooking(req: Request, res: Response) {
    try {
      const params = bookingIdParamSchema.parse(req.params);
      const booking = await bookingsService.getBooking(getAuthUserId(req), params.bookingId);
      sendData(res, 200, { booking });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async cancelBooking(req: Request, res: Response) {
    try {
      const params = bookingIdParamSchema.parse(req.params);
      const body = cancelBookingSchema.parse(req.body ?? {});
      const booking = await bookingsService.cancelBooking(
        getAuthUserId(req),
        params.bookingId,
        body.note,
      );
      sendData(res, 200, { booking });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
