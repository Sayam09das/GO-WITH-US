import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { tripsController } from "./trips.controller.js";

const tripsRouter = Router();

tripsRouter.use(requireAuth);
tripsRouter.get("/", tripsController.listTrips);

export { tripsRouter };
