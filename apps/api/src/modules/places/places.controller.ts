import type { NextFunction, Request, Response } from "express";
import { sendData, sendError } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import {
  createPlaceReviewSchema,
  listPlaceReviewsQuerySchema,
  listPlacesQuerySchema,
  placeIdParamSchema,
  placeSearchSchema,
  placeSlugParamSchema,
} from "./places.schemas.js";
import { placesService } from "./places.service.js";

export const placesController = {
  async list(req: Request, res: Response) {
    try {
      const query = listPlacesQuerySchema.parse(req.query);
      const result = await placesService.list(query);
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async search(req: Request, res: Response) {
    try {
      const body = placeSearchSchema.parse(req.body);
      const result = await placesService.search(body);
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async featured(_req: Request, res: Response) {
    try {
      const places = await placesService.listFeatured();
      sendData(res, 200, { places });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const params = placeSlugParamSchema.parse(req.params);
      const place = await placesService.getBySlug(params.slug);
      sendData(res, 200, { place });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listReviews(req: Request, res: Response) {
    try {
      const params = placeIdParamSchema.parse(req.params);
      const query = listPlaceReviewsQuerySchema.parse(req.query);
      const result = await placesService.listReviews(params.placeId, query);
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async createReview(req: Request, res: Response) {
    try {
      const params = placeIdParamSchema.parse(req.params);
      const body = createPlaceReviewSchema.parse(req.body);
      const review = await placesService.createReview(params.placeId, getAuthUserId(req), body);
      sendData(res, 201, { review });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};

function acceptsComplexSearchMethod(method: string): boolean {
  return method === "POST" || method === "QUERY";
}

export function handlePlaceSearch(req: Request, res: Response, next: NextFunction) {
  if (acceptsComplexSearchMethod(req.method)) {
    void placesController.search(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use POST for complex place search.");
}
