import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import { createPaymentSchema, paymentWebhookSchema } from "./payments.schemas.js";
import { paymentsService } from "./payments.service.js";

function readWebhookPayload(req: Request): string {
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString("utf8");
  }

  return JSON.stringify(req.body ?? {});
}

export const paymentsController = {
  async createPayment(req: Request, res: Response) {
    try {
      const body = createPaymentSchema.parse(req.body);
      const paymentIntent = await paymentsService.createPaymentIntent(
        getAuthUserId(req),
        body.bookingId,
      );
      sendData(res, 201, { paymentIntent });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async webhook(req: Request, res: Response) {
    try {
      const payload = readWebhookPayload(req);
      const parsedBody =
        typeof req.body === "object" && req.body != null && !Buffer.isBuffer(req.body)
          ? req.body
          : JSON.parse(payload);
      const event = paymentWebhookSchema.parse(parsedBody);
      const result = await paymentsService.processWebhook(
        payload,
        req.header("X-Webhook-Signature") ?? req.header("x-webhook-signature"),
        event,
      );
      sendData(res, 200, { received: true, ...result });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
