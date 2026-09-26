import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import { notificationIdParamSchema } from "./notifications.schemas.js";
import { notificationsService } from "./notifications.service.js";

export const notificationsController = {
  async listNotifications(req: Request, res: Response) {
    try {
      const result = await notificationsService.listForUser(getAuthUserId(req));
      sendData(res, 200, result);
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async markRead(req: Request, res: Response) {
    try {
      const params = notificationIdParamSchema.parse(req.params);
      const notification = await notificationsService.markRead(
        getAuthUserId(req),
        params.notificationId,
      );
      sendData(res, 200, { notification });
    } catch (error) {
      handleControllerError(error, res);
    }
  },

  async markAllRead(req: Request, res: Response) {
    try {
      const unreadCount = await notificationsService.markAllRead(getAuthUserId(req));
      sendData(res, 200, { unreadCount });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
