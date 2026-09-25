import type { NextFunction, Request, Response } from "express";
import { sendData, sendError } from "../../lib/errors.js";
import {
  getAuthUserId,
  getOptionalAuthUserId,
  handleControllerError,
} from "../../middleware/auth.js";
import {
  createStayReviewSchema,
  listStayReviewsQuerySchema,
  listStaysQuerySchema,
  stayAvailabilitySchema,
  stayIdParamSchema,
  staySearchSchema,
  staySlugParamSchema,
} from "./stays.schemas.js";
import { staysService } from "./stays.service.js";

export const staysController = {
  async list(req: Request, res: Response) {
    try {
      const query = listStaysQuerySchema.parse(req.query);
      const result = await staysService.list(query, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async search(req: Request, res: Response) {
    try {
      const body = staySearchSchema.parse(req.body);
      const result = await staysService.search(body, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const params = staySlugParamSchema.parse(req.params);
      const stay = await staysService.getBySlug(params.slug, getOptionalAuthUserId(req));
      sendData(res, 200, { stay });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getAvailability(req: Request, res: Response) {
    try {
      const params = stayIdParamSchema.parse(req.params);
      const body = stayAvailabilitySchema.parse(req.body);
      const availability = await staysService.getAvailability(params.stayId, body);
      sendData(res, 200, { availability });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listReviews(req: Request, res: Response) {
    try {
      const params = stayIdParamSchema.parse(req.params);
      const query = listStayReviewsQuerySchema.parse(req.query);
      const result = await staysService.listReviews(params.stayId, query.page, query.limit);
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async createReview(req: Request, res: Response) {
    try {
      const params = stayIdParamSchema.parse(req.params);
      const body = createStayReviewSchema.parse(req.body);
      const review = await staysService.createReview(params.stayId, getAuthUserId(req), body);
      sendData(res, 201, { review });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};

export function handleStaySearch(req: Request, res: Response, next: NextFunction) {
  if (req.method === "QUERY") {
    void staysController.search(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use QUERY for complex stay search.");
}

export function handleStayAvailability(req: Request, res: Response, next: NextFunction) {
  if (req.method === "QUERY") {
    void staysController.getAvailability(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use QUERY for stay availability.");
}
