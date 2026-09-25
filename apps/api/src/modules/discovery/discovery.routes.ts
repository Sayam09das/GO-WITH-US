import { Router } from "express";
import { optionalAuth } from "../../middleware/auth.js";
import { catalogRateLimit } from "../../middleware/rate-limit.js";
import { discoveryController } from "./discovery.controller.js";

const discoveryRouter = Router();

discoveryRouter.use(optionalAuth);
discoveryRouter.use(catalogRateLimit);

discoveryRouter.get("/homepage", discoveryController.homepage);

export { discoveryRouter };
