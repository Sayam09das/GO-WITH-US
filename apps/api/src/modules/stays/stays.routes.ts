import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.js";
import { catalogRateLimit, searchRateLimit } from "../../middleware/rate-limit.js";
import { handleStayAvailability, handleStaySearch, staysController } from "./stays.controller.js";

const staysRouter = Router();

staysRouter.use(optionalAuth);
staysRouter.use(catalogRateLimit);

staysRouter.get("/", staysController.list);
staysRouter.all("/search", searchRateLimit, handleStaySearch);
staysRouter.get("/:stayId/reviews", staysController.listReviews);
staysRouter.post("/:stayId/reviews", requireAuth, staysController.createReview);
staysRouter.all("/:stayId/availability", handleStayAvailability);
staysRouter.get("/:slug", staysController.getBySlug);

export { staysRouter };
