import type { Request, Response } from "express";
import { sendData } from "../../lib/errors.js";
import { getAuthUserId, handleControllerError } from "../../middleware/auth.js";
import { tripStatusQuerySchema } from "../users/users.schemas.js";
import { tripsService } from "./trips.service.js";

export const tripsController = {
  async listTrips(req: Request, res: Response) {
    try {
      const query = tripStatusQuerySchema.parse(req.query);
      const trips = await tripsService.listTrips(getAuthUserId(req), query.status);
      sendData(res, 200, { trips });
    } catch (error) {
      handleControllerError(error, res);
    }
  },
};
