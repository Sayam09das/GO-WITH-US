import type { NextFunction, Request, Response } from "express";
import { sendData, sendError } from "../../lib/errors.js";
import { handleControllerError } from "../../middleware/auth.js";
import {
  listStoriesQuerySchema,
  storySearchSchema,
  storySlugParamSchema,
} from "./stories.schemas.js";
import { storiesService } from "./stories.service.js";

export const storiesController = {
  async list(req: Request, res: Response) {
    try {
      const query = listStoriesQuerySchema.parse(req.query);
      const result = await storiesService.list({
        page: query.page,
        limit: query.limit,
        category: query.category,
        featured: query.featured,
      });
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async featured(_req: Request, res: Response) {
    try {
      const stories = await storiesService.listFeatured();
      sendData(res, 200, { stories });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async categories(_req: Request, res: Response) {
    try {
      const categories = storiesService.listCategories();
      sendData(res, 200, { categories });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async search(req: Request, res: Response) {
    try {
      const body = storySearchSchema.parse(req.body);
      const result = await storiesService.search(body);
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async getBySlug(req: Request, res: Response) {
    try {
      const params = storySlugParamSchema.parse(req.params);
      const story = await storiesService.getBySlug(params.slug);
      sendData(res, 200, { story });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};

function acceptsComplexSearchMethod(method: string): boolean {
  return method === "POST" || method === "QUERY";
}

export function handleStorySearch(req: Request, res: Response, next: NextFunction) {
  if (acceptsComplexSearchMethod(req.method)) {
    void storiesController.search(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use QUERY for complex story search.");
}
