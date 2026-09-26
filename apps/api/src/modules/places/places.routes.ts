import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import { catalogRateLimit, searchRateLimit } from "../../middleware/rate-limit.js";
import { handlePlaceSearch, placesController } from "./places.controller.js";

const placesRouter = Router();

placesRouter.use(optionalAuth);
placesRouter.use(catalogRateLimit);

placesRouter.get("/", placesController.list);
placesRouter.all("/search", searchRateLimit, handlePlaceSearch);
placesRouter.get("/featured", placesController.featured);
placesRouter.get("/:placeId/reviews", placesController.listReviews);
placesRouter.post("/:placeId/reviews", requireAuth, placesController.createReview);
placesRouter.get("/:slug", placesController.getBySlug);

export { placesRouter };
