import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { notificationsController } from "./notifications.controller.js";

const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get("/", notificationsController.listNotifications);
notificationsRouter.post("/read-all", notificationsController.markAllRead);
notificationsRouter.post("/:notificationId/read", notificationsController.markRead);

export { notificationsRouter };
