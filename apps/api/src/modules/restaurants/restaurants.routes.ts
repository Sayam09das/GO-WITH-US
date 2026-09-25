import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import { catalogRateLimit, searchRateLimit } from "../../middleware/rate-limit.js";
import { handleRestaurantSearch, restaurantsController } from "./restaurants.controller.js";

const restaurantsRouter = Router();

restaurantsRouter.use(optionalAuth);
restaurantsRouter.use(catalogRateLimit);

restaurantsRouter.get("/", restaurantsController.list);
restaurantsRouter.all("/search", searchRateLimit, handleRestaurantSearch);
restaurantsRouter.get("/featured", restaurantsController.featured);
restaurantsRouter.get("/:restaurantId/reviews", restaurantsController.listReviews);
restaurantsRouter.post("/:restaurantId/reviews", requireAuth, restaurantsController.createReview);
restaurantsRouter.get("/:slug", restaurantsController.getBySlug);

export { restaurantsRouter };
