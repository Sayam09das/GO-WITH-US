import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import { dashboardService } from "./dashboard.service.js";

export const dashboardController = {
  async getDashboard(req: Request, res: Response) {
    try {
      const dashboard = await dashboardService.getOverview(getAuthUserId(req));
      sendData(res, 200, dashboard);
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
