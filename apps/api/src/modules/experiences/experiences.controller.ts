import type { NextFunction, Request, Response } from "express";
import { sendData, sendError } from "../../lib/errors.js";
import {
  getAuthUserId,
  getOptionalAuthUserId,
  handleControllerError,
} from "../../middleware/auth.js";
import {
  createExperienceReviewSchema,
  experienceAvailabilitySchema,
  experienceIdParamSchema,
  experienceSearchSchema,
  experienceSlugParamSchema,
  listExperienceReviewsQuerySchema,
  listExperiencesQuerySchema,
} from "./experiences.schemas.js";
import { experiencesService } from "./experiences.service.js";

export const experiencesController = {
  async list(req: Request, res: Response) {
    try {
      const query = listExperiencesQuerySchema.parse(req.query);
      const result = await experiencesService.list(query, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async search(req: Request, res: Response) {
    try {
      const body = experienceSearchSchema.parse(req.body);
      const result = await experiencesService.search(body, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async featured(req: Request, res: Response) {
    try {
      const experiences = await experiencesService.listFeatured(getOptionalAuthUserId(req));
      sendData(res, 200, { experiences });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const params = experienceSlugParamSchema.parse(req.params);
      const experience = await experiencesService.getBySlug(
        params.slug,
        getOptionalAuthUserId(req),
      );
      sendData(res, 200, { experience });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async listReviews(req: Request, res: Response) {
    try {
      const params = experienceIdParamSchema.parse(req.params);
      const query = listExperienceReviewsQuerySchema.parse(req.query);
      const result = await experiencesService.listReviews(params.experienceId, {
        page: query.page,
        limit: query.limit,
        rating: query.rating,
        sort: query.sort,
      });
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async createReview(req: Request, res: Response) {
    try {
      const params = experienceIdParamSchema.parse(req.params);
      const body = createExperienceReviewSchema.parse(req.body);
      const review = await experiencesService.createReview(
        params.experienceId,
        getAuthUserId(req),
        body,
      );
      sendData(res, 201, { review });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getAvailability(req: Request, res: Response) {
    try {
      const params = experienceIdParamSchema.parse(req.params);
      const body = experienceAvailabilitySchema.parse(req.body);
      const availability = await experiencesService.getAvailability(params.experienceId, body);
      sendData(res, 200, { availability });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};

export function handleExperienceAvailability(req: Request, res: Response, next: NextFunction) {
  if (req.method === "QUERY") {
    void experiencesController.getAvailability(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use QUERY for experience availability.");
}

export function handleExperienceSearch(req: Request, res: Response, next: NextFunction) {
  if (req.method === "QUERY") {
    void experiencesController.search(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use QUERY for complex experience search.");
}
