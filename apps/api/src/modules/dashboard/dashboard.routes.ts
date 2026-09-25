import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { dashboardController } from "./dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/", dashboardController.getDashboard);

export { dashboardRouter };
