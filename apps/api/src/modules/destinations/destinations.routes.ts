import { Router } from "express";
import { optionalAuth } from "../../middleware/auth.js";
import { catalogRateLimit, searchRateLimit } from "../../middleware/rate-limit.js";
import { destinationsController, handleDestinationSearch } from "./destinations.controller.js";

const destinationsRouter = Router();

destinationsRouter.use(optionalAuth);
destinationsRouter.use(catalogRateLimit);

destinationsRouter.get("/", destinationsController.list);
destinationsRouter.get("/featured", destinationsController.featured);
destinationsRouter.get("/categories", destinationsController.categories);
destinationsRouter.all("/search", searchRateLimit, handleDestinationSearch);
destinationsRouter.get("/:destinationId/reviews", destinationsController.listReviews);
destinationsRouter.get("/:slug", destinationsController.getBySlug);

export { destinationsRouter };
