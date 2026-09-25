import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import {
  createReviewSchema,
  reportReviewSchema,
  reviewIdParamSchema,
  updateReviewSchema,
} from "./reviews.schemas.js";
import { reviewsService } from "./reviews.service.js";

export const reviewsController = {
  async createReview(req: Request, res: Response) {
    try {
      const body = createReviewSchema.parse(req.body);
      const review = await reviewsService.createReview(getAuthUserId(req), body);
      sendData(res, 201, { review });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async updateReview(req: Request, res: Response) {
    try {
      const params = reviewIdParamSchema.parse(req.params);
      const body = updateReviewSchema.parse(req.body);
      const review = await reviewsService.updateReview(getAuthUserId(req), params.reviewId, body);
      sendData(res, 200, { review });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async deleteReview(req: Request, res: Response) {
    try {
      const params = reviewIdParamSchema.parse(req.params);
      await reviewsService.deleteReview(getAuthUserId(req), params.reviewId);
      res.status(204).send();
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async reportReview(req: Request, res: Response) {
    try {
      const params = reviewIdParamSchema.parse(req.params);
      const body = reportReviewSchema.parse(req.body);
      const report = await reviewsService.reportReview(getAuthUserId(req), params.reviewId, body);
      sendData(res, 201, { report });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
