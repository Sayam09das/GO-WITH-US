import type { NextFunction, Request, Response } from "express";
import { sendData, sendError } from "../../lib/errors.js";
import {
  getAuthUserId,
  getOptionalAuthUserId,
  handleControllerError,
} from "../../middleware/auth.js";
import {
  createRestaurantReviewSchema,
  listRestaurantReviewsQuerySchema,
  listRestaurantsQuerySchema,
  restaurantIdParamSchema,
  restaurantSearchSchema,
  restaurantSlugParamSchema,
} from "./restaurants.schemas.js";
import { restaurantsService } from "./restaurants.service.js";

export const restaurantsController = {
  async list(req: Request, res: Response) {
    try {
      const query = listRestaurantsQuerySchema.parse(req.query);
      const result = await restaurantsService.list(query, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async search(req: Request, res: Response) {
    try {
      const body = restaurantSearchSchema.parse(req.body);
      const result = await restaurantsService.search(body, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async featured(req: Request, res: Response) {
    try {
      const restaurants = await restaurantsService.listFeatured(getOptionalAuthUserId(req));
      sendData(res, 200, { restaurants });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const params = restaurantSlugParamSchema.parse(req.params);
      const restaurant = await restaurantsService.getBySlug(
        params.slug,
        getOptionalAuthUserId(req),
      );
      sendData(res, 200, { restaurant });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listReviews(req: Request, res: Response) {
    try {
      const params = restaurantIdParamSchema.parse(req.params);
      const query = listRestaurantReviewsQuerySchema.parse(req.query);
      const result = await restaurantsService.listReviews(params.restaurantId, query);
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async createReview(req: Request, res: Response) {
    try {
      const params = restaurantIdParamSchema.parse(req.params);
      const body = createRestaurantReviewSchema.parse(req.body);
      const review = await restaurantsService.createReview(
        params.restaurantId,
        getAuthUserId(req),
        body,
      );
      sendData(res, 201, { review });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};

function acceptsComplexSearchMethod(method: string): boolean {
  return method === "POST" || method === "QUERY";
}

export function handleRestaurantSearch(req: Request, res: Response, next: NextFunction) {
  if (acceptsComplexSearchMethod(req.method)) {
    void restaurantsController.search(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use QUERY for complex restaurant search.");
}
