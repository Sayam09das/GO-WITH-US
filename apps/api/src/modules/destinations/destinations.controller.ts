import type { NextFunction, Request, Response } from "express";
import { sendData, sendError } from "../../lib/errors.js";
import { getOptionalAuthUserId, handleControllerError } from "../../middleware/auth.js";
import {
  destinationIdParamSchema,
  destinationSearchSchema,
  destinationSlugParamSchema,
  listDestinationReviewsQuerySchema,
  listDestinationsQuerySchema,
} from "./destinations.schemas.js";
import { destinationsService } from "./destinations.service.js";

export const destinationsController = {
  async list(req: Request, res: Response) {
    try {
      const query = listDestinationsQuerySchema.parse(req.query);
      const result = await destinationsService.list({
        page: query.page,
        limit: query.limit,
        featured: query.featured,
        sort: query.sort,
        userId: getOptionalAuthUserId(req),
      });
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async search(req: Request, res: Response) {
    try {
      const body = destinationSearchSchema.parse(req.body);
      const result = await destinationsService.search(body, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async featured(req: Request, res: Response) {
    try {
      const destinations = await destinationsService.listFeatured(getOptionalAuthUserId(req));
      sendData(res, 200, { destinations });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async categories(_req: Request, res: Response) {
    try {
      const categories = await destinationsService.listCategories();
      sendData(res, 200, { categories });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const params = destinationSlugParamSchema.parse(req.params);
      const destination = await destinationsService.getBySlug(
        params.slug,
        getOptionalAuthUserId(req),
      );
      sendData(res, 200, { destination });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listReviews(req: Request, res: Response) {
    try {
      const params = destinationIdParamSchema.parse(req.params);
      const query = listDestinationReviewsQuerySchema.parse(req.query);
      const result = await destinationsService.listReviews(params.destinationId, query);
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};

function acceptsComplexSearchMethod(method: string): boolean {
  return method === "POST" || method === "QUERY";
}

export function handleDestinationSearch(req: Request, res: Response, next: NextFunction) {
  if (acceptsComplexSearchMethod(req.method)) {
    void destinationsController.search(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use QUERY for complex destination search.");
}
