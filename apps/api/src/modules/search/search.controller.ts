import type { NextFunction, Request, Response } from "express";
import { sendData, sendError } from "../../lib/errors.js";
import { getOptionalAuthUserId, handleControllerError } from "../../middleware/auth.js";
import { globalSearchBodySchema, globalSearchQuerySchema } from "./search.schemas.js";
import { searchService } from "./search.service.js";

export const searchController = {
  async searchByQuery(req: Request, res: Response) {
    try {
      const query = globalSearchQuerySchema.parse(req.query);
      const result = await searchService.searchByQuery(query, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async searchWithLocation(req: Request, res: Response) {
    try {
      const body = globalSearchBodySchema.parse(req.body);
      const result = await searchService.searchWithLocation(body, getOptionalAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};

export function handleGlobalSearch(req: Request, res: Response, next: NextFunction) {
  if (req.method === "POST" || req.method === "QUERY") {
    void searchController.searchWithLocation(req, res);
    return;
  }

  if (req.method === "OPTIONS") {
    next();
    return;
  }

  sendError(res, 405, "METHOD_NOT_ALLOWED", "Use GET, POST, or QUERY for global search.");
}
