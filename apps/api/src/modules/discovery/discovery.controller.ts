import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getOptionalAuthUserId } from "../../middleware/auth.js";
import { discoveryService } from "./discovery.service.js";

export const discoveryController = {
  async homepage(req: Request, res: Response) {
    const feed = await discoveryService.getHomepageFeed(getOptionalAuthUserId(req));
    sendData(res, 200, feed);
  },
};
