import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { reviewsController } from "./reviews.controller.js";

const reviewsRouter = Router();

reviewsRouter.post("/", requireAuth, reviewsController.createReview);
reviewsRouter.patch("/:reviewId", requireAuth, reviewsController.updateReview);
reviewsRouter.delete("/:reviewId", requireAuth, reviewsController.deleteReview);
reviewsRouter.post("/:reviewId/report", requireAuth, reviewsController.reportReview);

export { reviewsRouter };
