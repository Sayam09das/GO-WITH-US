import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import { catalogRateLimit, searchRateLimit } from "../../middleware/rate-limit.js";
import {
  experiencesController,
  handleExperienceAvailability,
  handleExperienceSearch,
} from "./experiences.controller.js";

const experiencesRouter = Router();

experiencesRouter.use(optionalAuth);
experiencesRouter.use(catalogRateLimit);

experiencesRouter.get("/", experiencesController.list);
experiencesRouter.all("/search", searchRateLimit, handleExperienceSearch);
experiencesRouter.get("/featured", experiencesController.featured);
experiencesRouter.all("/:experienceId/availability", handleExperienceAvailability);
experiencesRouter.get("/:experienceId/reviews", experiencesController.listReviews);
experiencesRouter.post("/:experienceId/reviews", requireAuth, experiencesController.createReview);
experiencesRouter.get("/:slug", experiencesController.getBySlug);

export { experiencesRouter };
