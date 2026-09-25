import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { tripsController } from "./trips.controller.js";

const tripsRouter = Router();

tripsRouter.use(requireAuth);

tripsRouter.post("/", tripsController.createTrip);
tripsRouter.get("/", tripsController.listTrips);
tripsRouter.get("/:tripId", tripsController.getTrip);
tripsRouter.patch("/:tripId", tripsController.updateTrip);
tripsRouter.delete("/:tripId", tripsController.deleteTrip);

tripsRouter.get("/:tripId/days", tripsController.listDays);
tripsRouter.post("/:tripId/days", tripsController.createDay);
tripsRouter.patch("/:tripId/days/:dayId", tripsController.updateDay);

tripsRouter.post("/:tripId/days/:dayId/items", tripsController.addItem);
tripsRouter.patch("/:tripId/days/:dayId/items/reorder", tripsController.reorderItems);
tripsRouter.patch("/:tripId/days/:dayId/items/:itemId", tripsController.updateItem);
tripsRouter.delete("/:tripId/days/:dayId/items/:itemId", tripsController.deleteItem);

tripsRouter.patch("/:tripId/items/:itemId/move", tripsController.moveItem);

export { tripsRouter };
