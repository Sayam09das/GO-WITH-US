import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import { handleRestaurantSearch, restaurantsController } from "./restaurants.controller.js";

const restaurantsRouter = Router();

restaurantsRouter.use(optionalAuth);

restaurantsRouter.get("/", restaurantsController.list);
restaurantsRouter.all("/search", handleRestaurantSearch);
restaurantsRouter.get("/featured", restaurantsController.featured);
restaurantsRouter.get("/:restaurantId/reviews", restaurantsController.listReviews);
restaurantsRouter.post("/:restaurantId/reviews", requireAuth, restaurantsController.createReview);
restaurantsRouter.get("/:slug", restaurantsController.getBySlug);

export { restaurantsRouter };
